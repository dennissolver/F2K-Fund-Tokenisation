import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAdminUser, hasPermission, auditLog } from "@/lib/auth";
import { createSupabaseService } from "@/lib/supabase-service";

const LTV_GUIDANCE: Record<string, { default: number; range: string; factors: string }> = {
  cash: {
    default: 0.95,
    range: "90-95%",
    factors: "Verify account holder matches investor, balance >= declared value, bank is ADI-regulated",
  },
  bonds: {
    default: 0.85,
    range: "75-90%",
    factors: "Issuer credit rating (AAA=90%, AA=85%, A=80%, BBB=75%), maturity date, coupon rate, liquidity",
  },
  art: {
    default: 0.50,
    range: "30-60%",
    factors: "Artist market depth, provenance chain, insurance coverage, auction history, condition, storage",
  },
  property: {
    default: 0.70,
    range: "50-75%",
    factors: "Location (metro vs regional), property type (residential/commercial), zoning, encumbrances, rental yield, vacancy rate",
  },
};

function buildPrompt(stake: Record<string, unknown>, assetClass: Record<string, string | number>, docs: string[]): string {
  const code = assetClass.code as string;
  const guidance = LTV_GUIDANCE[code] || LTV_GUIDANCE.cash;

  return `You are an asset valuation analyst for the F2K Housing Token Fund, an Australian regulated managed investment scheme (MIS). You are assisting the Contributions Committee in reviewing a non-crypto asset stake submitted by a wholesale investor.

Your role is ADVISORY ONLY. A human committee member makes the final decision.

## Asset Stake Details
- Asset Class: ${assetClass.label} (${code}, Tier ${code === "cash" ? 1 : code === "bonds" ? 2 : code === "art" ? 3 : 4})
- Declared Value (USD): $${Number(stake.declared_value).toLocaleString()}
- Investor Description: ${stake.description}
- Default LTV: ${(Number(assetClass.ltv_ratio) * 100).toFixed(0)}%
- LTV Guidance for ${code}: ${guidance.range} based on: ${guidance.factors}

## Supporting Documents Uploaded
${docs.length > 0 ? docs.map((d, i) => `${i + 1}. ${d}`).join("\n") : "No documents uploaded yet."}

## Required Documents for ${assetClass.label}
${code === "cash" ? "- Bank statement (< 30 days)" : ""}${code === "bonds" ? "- Bond certificate or CHESS statement\n- Holding statement" : ""}${code === "art" ? "- Independent valuation (< 12 months)\n- Provenance certificate\n- Insurance certificate" : ""}${code === "property" ? "- Independent valuation (< 6 months)\n- Title search\n- Council rates notice" : ""}

## Your Task
Analyse this stake and provide:

1. **suggested_appraised_value**: Your best estimate in USD. For cash/bonds, this is usually close to declared value if docs check out. For art/property, be conservative — use independent valuation benchmarks.

2. **suggested_ltv**: A decimal between 0 and 1. Use the default unless factors justify adjustment. Explain any deviation.

3. **confidence**: "high", "medium", or "low"
   - high = asset class is straightforward (cash, investment-grade bonds) and all required docs appear present
   - medium = some docs missing or asset requires specialist knowledge
   - low = significant uncertainty, incomplete info, or asset is unusual

4. **risk_flags**: Array of specific concerns the committee should investigate. Examples: missing documents, declared value seems high for asset class, unusual asset description, liquidity concerns.

5. **reasoning**: 2-4 sentences explaining your valuation logic. Reference specific factors from the description and documents.

6. **document_checklist**: For each required document, state whether it appears to be present (based on filenames) or missing.

Respond in JSON only. No markdown fences. No explanation outside the JSON.

{
  "suggested_appraised_value": <number>,
  "suggested_ltv": <number>,
  "confidence": "<high|medium|low>",
  "risk_flags": ["<string>", ...],
  "reasoning": "<string>",
  "document_checklist": [{"document": "<string>", "status": "present|missing|unclear"}]
}`;
}

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminUser();
  if (!admin || !hasPermission(admin.role, "manage_stakes")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 }
    );
  }

  const supabase = createSupabaseService();

  const { data: stake, error: fetchError } = await supabase
    .from("asset_stakes")
    .select("*, asset_classes(*)")
    .eq("id", params.id)
    .single();

  if (fetchError || !stake) {
    return NextResponse.json({ error: "Stake not found" }, { status: 404 });
  }

  if (!["submitted", "under_review"].includes(stake.status)) {
    return NextResponse.json(
      { error: `Cannot appraise a stake in "${stake.status}" status` },
      { status: 400 }
    );
  }

  const assetClass = stake.asset_classes as Record<string, string | number>;
  const docs = (stake.supporting_docs as string[] || []).map(
    (path: string) => path.split("/").pop() || path
  );

  const prompt = buildPrompt(stake, assetClass, docs);

  const anthropic = new Anthropic({ apiKey });

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return NextResponse.json({ error: "No response from AI" }, { status: 500 });
  }

  let appraisal: Record<string, unknown>;
  try {
    appraisal = JSON.parse(textBlock.text);
  } catch {
    return NextResponse.json(
      { error: "Failed to parse AI response", raw: textBlock.text },
      { status: 500 }
    );
  }

  // Mark stake as under_review if it was just submitted
  if (stake.status === "submitted") {
    await supabase
      .from("asset_stakes")
      .update({ status: "under_review" })
      .eq("id", params.id);
  }

  await auditLog(admin.id, admin.email, "stake_ai_appraisal", "asset_stake", params.id, {
    confidence: appraisal.confidence,
    suggested_appraised_value: appraisal.suggested_appraised_value,
    suggested_ltv: appraisal.suggested_ltv,
    risk_flags: appraisal.risk_flags,
    model: "claude-sonnet-4-20250514",
    input_tokens: message.usage.input_tokens,
    output_tokens: message.usage.output_tokens,
  });

  return NextResponse.json({ appraisal });
}
