import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAdminUser, hasPermission, auditLog } from "@/lib/auth";
import { createSupabaseService } from "@/lib/supabase-service";

function buildRevaluationPrompt(
  stake: Record<string, unknown>,
  assetClass: Record<string, string | number>,
  docs: string[]
): string {
  const timeSinceReview = stake.reviewed_at
    ? `${Math.round((Date.now() - new Date(stake.reviewed_at as string).getTime()) / (1000 * 60 * 60 * 24))} days`
    : "unknown";

  return `You are an asset revaluation analyst for the F2K Housing Token Fund, an Australian regulated managed investment scheme (MIS). You are assisting the Contributions Committee in determining whether a previously approved asset stake still carries an appropriate appraised value.

Your role is ADVISORY ONLY. A human committee member makes the final decision.

## Asset Stake Details
- Asset Class: ${assetClass.label} (${assetClass.code})
- Original Declared Value (USD): $${Number(stake.declared_value).toLocaleString()}
- Current Appraised Value (USD): $${Number(stake.appraised_value).toLocaleString()}
- Current LTV Applied: ${stake.ltv_ratio_applied ? `${(Number(stake.ltv_ratio_applied) * 100).toFixed(1)}%` : "N/A"}
- Current Collateral Value (USD): ${stake.collateral_value ? `$${Number(stake.collateral_value).toLocaleString()}` : "N/A"}
- Default LTV for Class: ${(Number(assetClass.ltv_ratio) * 100).toFixed(0)}%
- Time Since Last Review: ${timeSinceReview}
- Current Status: ${stake.status}
- Investor Description: ${stake.description}

## Supporting Documents on File
${docs.length > 0 ? docs.map((d, i) => `${i + 1}. ${d}`).join("\n") : "No documents on file."}

## Previous Review Notes
${stake.review_notes || "None"}

## Your Task
Assess whether the current appraised value is still appropriate. Consider:
1. Time elapsed since last review — older valuations carry more uncertainty
2. Asset class characteristics — how volatile is this asset type?
3. Whether the current LTV is still appropriate given market conditions
4. Whether the supporting documentation is likely still current

Provide your assessment as JSON only. No markdown fences. No explanation outside the JSON.

{
  "recommended_action": "maintain" | "increase" | "decrease",
  "suggested_value": <number — your recommended appraised value in USD>,
  "suggested_ltv": <number — decimal between 0 and 1>,
  "confidence": "high" | "medium" | "low",
  "reasoning": "<string — 2-4 sentences explaining your recommendation>",
  "market_factors": ["<string — specific market factors influencing your recommendation>"]
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

  if (!["approved", "lien_registered", "tokens_minted"].includes(stake.status)) {
    return NextResponse.json(
      { error: `Cannot revalue a stake in "${stake.status}" status. Must be approved, lien_registered, or tokens_minted.` },
      { status: 400 }
    );
  }

  const assetClass = stake.asset_classes as Record<string, string | number>;
  const docs = (stake.supporting_docs as string[] || []).map(
    (path: string) => path.split("/").pop() || path
  );

  const prompt = buildRevaluationPrompt(stake, assetClass, docs);

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

  await auditLog(admin.id, admin.email, "stake_ai_revaluation", "asset_stake", params.id, {
    recommended_action: appraisal.recommended_action,
    suggested_value: appraisal.suggested_value,
    suggested_ltv: appraisal.suggested_ltv,
    confidence: appraisal.confidence,
    market_factors: appraisal.market_factors,
    model: "claude-sonnet-4-20250514",
    input_tokens: message.usage.input_tokens,
    output_tokens: message.usage.output_tokens,
  });

  return NextResponse.json({ appraisal });
}
