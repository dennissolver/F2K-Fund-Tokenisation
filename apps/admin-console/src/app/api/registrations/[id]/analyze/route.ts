import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAdminUser, hasPermission, auditLog } from "@/lib/auth";
import { createSupabaseService } from "@/lib/supabase-service";

function buildDealAnalysisPrompt(roi: Record<string, unknown>): string {
  const details = (roi.details || {}) as Record<string, unknown>;

  return `You are the Deal Analyzer for the F2K Housing Token Fund — a $600M tokenised Australian residential housing fund operating as a regulated Managed Investment Scheme (MIS).

Your role is to evaluate housing project submissions from promoters who want the fund to invest. You produce an institutional-grade deal analysis with a clear BUY / NEGOTIATE / PASS recommendation.

## Project Submission Data

**Organisation:** ${roi.org_name}
**Contact:** ${roi.contact_name} (${roi.contact_email})
**State:** ${roi.region || "Not specified"}

**Project Type:** ${details.project_type || "Not specified"}
**Number of Dwellings:** ${details.dwelling_count || "Not specified"}
**Land Status:** ${details.land_status || "Not specified"}
**Construction Preference:** ${details.construction_preference || "Not specified"}
**Funding Status:** ${details.funding_status || "Not specified"}
**Site Address:** ${details.site_address || "Not specified"}
**Target Timeline:** ${details.target_timeline || "Not specified"}

**Financial Details (if provided):**
- Total Project Cost: ${details.total_project_cost ? "$" + Number(details.total_project_cost).toLocaleString() : "Not provided"}
- Estimated GRV (Gross Realisation Value): ${details.estimated_grv ? "$" + Number(details.estimated_grv).toLocaleString() : "Not provided"}
- Expected Annual Rental Income: ${details.expected_annual_rent ? "$" + Number(details.expected_annual_rent).toLocaleString() : "Not provided"}
- Land Value: ${details.land_value ? "$" + Number(details.land_value).toLocaleString() : "Not provided"}
- Construction Cost per Dwelling: ${details.cost_per_dwelling ? "$" + Number(details.cost_per_dwelling).toLocaleString() : "Not provided"}

**Promoter Summary:** ${roi.message || "No description provided."}

## F2K Fund Investment Criteria

The fund targets:
- Residential housing projects across Australia (social, affordable, NDIS SDA, BTR, defence, key worker, student)
- 10+ dwelling developments
- Modular/modern construction methods preferred (lower cost, faster delivery)
- 8% preferred return to token holders
- Projects that generate stable rental yield OR sale proceeds for fund distributions
- DA-approved or near-approval projects preferred
- Fund holds assets via SPV structure (one SPV per project)

## Your Analysis Task

Evaluate this project against the fund's criteria and produce:

1. **quick_screen** — Object with three tests:
   - **fund_fit**: Does the project type match F2K's mandate? (PASS/FAIL)
   - **scale_adequate**: Is the dwelling count >= 10 and large enough for SPV economics? (PASS/FAIL)
   - **land_secured**: Is land owned or under contract? (PASS/FAIL/UNCLEAR)

2. **financial_assessment** — Object (use available data, estimate where needed):
   - **estimated_yield_pct**: Estimated gross rental yield if hold-to-rent (number or null)
   - **estimated_development_margin_pct**: (GRV - total cost) / total cost (number or null)
   - **cost_per_dwelling_benchmark**: How the cost per dwelling compares to Australian benchmarks for this type
   - **funding_gap_assessment**: Analysis of how much capital the fund would need to commit

3. **risk_factors**: Array of specific risk strings the investment committee should investigate

4. **strengths**: Array of positive aspects of this project

5. **missing_information**: Array of data points the promoter needs to provide before a full analysis is possible

6. **recommendation**: "BUY" | "NEGOTIATE" | "PASS" | "MORE_INFO_NEEDED"

7. **recommendation_summary**: 3-5 sentences explaining the recommendation. Reference specific data points.

8. **suggested_next_steps**: Array of concrete actions (e.g., "Request detailed feasibility study", "Schedule site visit", "Request independent valuation")

9. **confidence**: "high" | "medium" | "low" — based on completeness of data provided

Respond in JSON only. No markdown fences. No explanation outside the JSON.`;
}

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminUser();
  if (!admin || !hasPermission(admin.role, "manage_registrations")) {
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

  const { data: roi, error: fetchError } = await (supabase.from("registrations_of_interest") as any)
    .select("*")
    .eq("id", params.id)
    .single();

  if (fetchError || !roi) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }

  if (roi.type !== "project") {
    return NextResponse.json(
      { error: "Deal analysis is only available for project submissions" },
      { status: 400 }
    );
  }

  const prompt = buildDealAnalysisPrompt(roi);

  const anthropic = new Anthropic({ apiKey });

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return NextResponse.json({ error: "No response from AI" }, { status: 500 });
  }

  let analysis: Record<string, unknown>;
  try {
    analysis = JSON.parse(textBlock.text);
  } catch {
    return NextResponse.json(
      { error: "Failed to parse AI response", raw: textBlock.text },
      { status: 500 }
    );
  }

  // Store analysis in the ROI details
  const existingDetails = (roi.details || {}) as Record<string, unknown>;
  await (supabase.from("registrations_of_interest") as any)
    .update({
      details: {
        ...existingDetails,
        deal_analysis: analysis,
        deal_analysis_at: new Date().toISOString(),
      },
    } as never)
    .eq("id", params.id);

  await auditLog(
    admin.id,
    admin.email,
    "project_deal_analysis",
    "registration_of_interest",
    params.id,
    {
      recommendation: analysis.recommendation,
      confidence: analysis.confidence,
      model: "claude-sonnet-4-20250514",
      input_tokens: message.usage.input_tokens,
      output_tokens: message.usage.output_tokens,
    }
  );

  return NextResponse.json({ analysis });
}
