import { NextResponse } from "next/server";
import { createSupabaseService } from "@/lib/supabase-service";
import { CONCENTRATION_LIMITS, ASSET_CLASS_TIERS, type AssetClassCode } from "@f2k/shared";

export const dynamic = "force-dynamic";

export async function GET() {
  const service = createSupabaseService();

  const { data: classes, error } = await service
    .from("asset_classes")
    .select("*")
    .eq("enabled", true)
    .order("code");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fetch concentration data for investor awareness
  const activeStatuses = ["approved", "lien_registered", "tokens_minted"];
  const { data: stakes } = await service
    .from("asset_stakes")
    .select("collateral_value, asset_classes(code)")
    .in("status", activeStatuses);

  const { data: latestNav } = await service
    .from("nav_records")
    .select("total_nav")
    .eq("status", "published")
    .order("calculated_at", { ascending: false })
    .limit(1)
    .single();

  const classTotals: Record<string, number> = {};
  let totalStakedValue = 0;
  for (const s of stakes || []) {
    const val = Number(s.collateral_value) || 0;
    const code = ((s.asset_classes as unknown) as { code: string })?.code || "";
    classTotals[code] = (classTotals[code] || 0) + val;
    totalStakedValue += val;
  }

  const denominator = latestNav ? Number(latestNav.total_nav) : totalStakedValue;
  const concentration: Record<string, number> = {};
  for (const [code, value] of Object.entries(classTotals)) {
    concentration[code] = denominator > 0 ? value / denominator : 0;
  }

  // Tier 1+2 %
  const tier12Codes = Object.entries(ASSET_CLASS_TIERS)
    .filter(([, tier]) => tier <= 2)
    .map(([code]) => code);
  const tier12Value = tier12Codes.reduce((sum, code) => sum + (classTotals[code] || 0), 0);
  const tier12Pct = denominator > 0 ? tier12Value / denominator : 0;

  return NextResponse.json({
    classes,
    concentration,
    tier12Pct,
    limits: CONCENTRATION_LIMITS,
  });
}
