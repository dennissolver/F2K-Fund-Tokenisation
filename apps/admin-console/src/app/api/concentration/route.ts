import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { createSupabaseService } from "@/lib/supabase-service";
import { CONCENTRATION_LIMITS, ASSET_CLASS_TIERS, type AssetClassCode } from "@f2k/shared";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createSupabaseService();

  // Fetch all active stakes with asset class code
  const activeStatuses = ["approved", "lien_registered", "tokens_minted"];
  const { data: stakes } = await supabase
    .from("asset_stakes")
    .select("id, collateral_value, asset_classes(code)")
    .in("status", activeStatuses);

  // Get latest published NAV
  const { data: latestNav } = await supabase
    .from("nav_records")
    .select("total_nav")
    .eq("status", "published")
    .order("calculated_at", { ascending: false })
    .limit(1)
    .single();

  // Aggregate by class
  const classTotals: Record<string, { value: number; count: number }> = {};
  let totalStakedValue = 0;
  let largestSingleAssetValue = 0;

  for (const s of stakes || []) {
    const val = Number(s.collateral_value) || 0;
    const code = ((s.asset_classes as unknown) as { code: string })?.code || "unknown";
    if (!classTotals[code]) classTotals[code] = { value: 0, count: 0 };
    classTotals[code].value += val;
    classTotals[code].count += 1;
    totalStakedValue += val;
    if (val > largestSingleAssetValue) largestSingleAssetValue = val;
  }

  const totalFundNav = latestNav ? Number(latestNav.total_nav) : totalStakedValue;
  const denominator = totalFundNav > 0 ? totalFundNav : 1;

  // Build per-class breakdown
  const byClass: Record<string, { value: number; pct: number; count: number; tier: number }> = {};
  for (const [code, data] of Object.entries(classTotals)) {
    byClass[code] = {
      value: data.value,
      pct: data.value / denominator,
      count: data.count,
      tier: ASSET_CLASS_TIERS[code as AssetClassCode] ?? 0,
    };
  }

  // Tier 1+2 %
  const tier12Codes = Object.entries(ASSET_CLASS_TIERS)
    .filter(([, tier]) => tier <= 2)
    .map(([code]) => code);
  const tier12Value = tier12Codes.reduce((sum, code) => sum + (classTotals[code]?.value || 0), 0);
  const tier12Pct = tier12Value / denominator;

  const largestSingleAssetPct = largestSingleAssetValue / denominator;

  return NextResponse.json({
    byClass,
    tier12Pct,
    largestSingleAssetPct,
    totalStakedValue,
    totalFundNav,
    limits: CONCENTRATION_LIMITS,
    breaches: {
      classOver40: Object.entries(byClass).filter(([, d]) => d.pct > CONCENTRATION_LIMITS.maxAssetClassPct).map(([code]) => code),
      tier12Under25: tier12Pct < CONCENTRATION_LIMITS.minTier12Pct,
      singleAssetOver5: largestSingleAssetPct > CONCENTRATION_LIMITS.maxSingleAssetPct,
    },
  });
}
