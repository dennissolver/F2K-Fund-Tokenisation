import {
  CONCENTRATION_LIMITS,
  ASSET_CLASS_TIERS,
  type AssetClassCode,
  type ConcentrationCheck,
} from "./index";

interface StakeInput {
  asset_class_code: string;
  collateral_value: number;
  id: string;
}

interface CheckParams {
  currentStakes: StakeInput[];
  proposedClassCode: string;
  proposedCollateralValue: number;
  totalFundNav: number;
}

export function checkConcentrationLimits(params: CheckParams): ConcentrationCheck {
  const { currentStakes, proposedClassCode, proposedCollateralValue, totalFundNav } = params;
  const violations: string[] = [];

  // Aggregate current stakes by class
  const classTotals: Record<string, number> = {};
  let totalStakedValue = 0;

  for (const s of currentStakes) {
    const val = Number(s.collateral_value) || 0;
    classTotals[s.asset_class_code] = (classTotals[s.asset_class_code] || 0) + val;
    totalStakedValue += val;
  }

  // Add the proposed stake
  classTotals[proposedClassCode] = (classTotals[proposedClassCode] || 0) + proposedCollateralValue;
  totalStakedValue += proposedCollateralValue;

  // Use fund NAV or fallback to total staked value
  const denominator = totalFundNav > 0 ? totalFundNav : totalStakedValue;

  // Build per-class exposure
  const byClass: Record<string, { value: number; pct: number }> = {};
  for (const [code, value] of Object.entries(classTotals)) {
    const pct = denominator > 0 ? value / denominator : 0;
    byClass[code] = { value, pct };
  }

  // Check 1: No single asset class >40%
  const proposedClassPct = denominator > 0
    ? (classTotals[proposedClassCode] || 0) / denominator
    : 0;
  if (proposedClassPct > CONCENTRATION_LIMITS.maxAssetClassPct) {
    violations.push(
      `${proposedClassCode} would be ${(proposedClassPct * 100).toFixed(1)}% of NAV (limit: ${CONCENTRATION_LIMITS.maxAssetClassPct * 100}%)`
    );
  }

  // Check 2: No single asset >5%
  const singleAssetPct = denominator > 0 ? proposedCollateralValue / denominator : 0;
  if (singleAssetPct > CONCENTRATION_LIMITS.maxSingleAssetPct) {
    violations.push(
      `Single asset would be ${(singleAssetPct * 100).toFixed(1)}% of NAV (limit: ${CONCENTRATION_LIMITS.maxSingleAssetPct * 100}%)`
    );
  }

  // Check 3: Minimum 25% in Tier 1+2
  const tier12Codes = Object.entries(ASSET_CLASS_TIERS)
    .filter(([, tier]) => tier <= 2)
    .map(([code]) => code);
  const tier12Value = tier12Codes.reduce((sum, code) => sum + (classTotals[code] || 0), 0);
  const tier12Pct = denominator > 0 ? tier12Value / denominator : 0;
  if (tier12Pct < CONCENTRATION_LIMITS.minTier12Pct) {
    violations.push(
      `Tier 1+2 (cash/bonds) would be ${(tier12Pct * 100).toFixed(1)}% of NAV (minimum: ${CONCENTRATION_LIMITS.minTier12Pct * 100}%)`
    );
  }

  // Find largest single asset %
  let largestSingleAssetPct = singleAssetPct;
  for (const s of currentStakes) {
    const val = Number(s.collateral_value) || 0;
    const pct = denominator > 0 ? val / denominator : 0;
    if (pct > largestSingleAssetPct) largestSingleAssetPct = pct;
  }

  return {
    allowed: violations.length === 0,
    violations,
    exposure: {
      byClass,
      tier12Pct,
      largestSingleAssetPct,
      totalStakedValue,
    },
  };
}
