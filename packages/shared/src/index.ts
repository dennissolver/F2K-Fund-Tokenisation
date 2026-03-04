// Token constants
export const TOKEN_NAME = "F2K Housing Token";
export const TOKEN_SYMBOL = "F2K-HT";
export const TOKEN_DECIMALS = 6;
export const USDC_DECIMALS = 6;

// Fund parameters
export const PREFERRED_RETURN = 0.08; // 8% p.a.
export const MANAGEMENT_FEE = 0.015; // 1.5% p.a.
export const PERFORMANCE_FEE = 0.2; // 20% above hurdle
export const INTEGRATION_FEE = 0.12; // 12% of GDV
export const MIN_INVESTMENT_USDC = 10_000;

// Investor types
export type InvestorType = "wholesale" | "sophisticated";
export type KYCStatus =
  | "not_started"
  | "pending"
  | "approved"
  | "rejected"
  | "expired";
export type SubscriptionStatus =
  | "pending"
  | "confirmed"
  | "minted"
  | "failed"
  | "cancelled";
export type DistributionStatus =
  | "draft"
  | "approved"
  | "executing"
  | "completed"
  | "failed";
export type AllowlistStatus = "pending" | "approved" | "denied" | "revoked";
export type NavStatus = "draft" | "approved" | "published";
export type AdminRole =
  | "super_admin"
  | "fund_manager"
  | "compliance"
  | "read_only";

// Investor record
export interface Investor {
  id: string;
  auth_user_id: string | null;
  email: string;
  full_name: string | null;
  entity_name: string | null;
  wallet_address: string | null;
  wallet_verified_at: string | null;
  investor_type: InvestorType | null;
  kyc_status: KYCStatus;
  kyc_provider_id: string | null;
  kyc_completed_at: string | null;
  net_assets_declared: boolean;
  income_declared: boolean;
  country_code: string;
  created_at: string;
  updated_at: string;
}

// Subscription record
export interface Subscription {
  id: string;
  investor_id: string;
  amount_usdc: number;
  token_price: number;
  tokens_to_mint: number;
  tx_hash: string | null;
  mint_tx_hash: string | null;
  status: SubscriptionStatus;
  confirmed_by: string | null;
  confirmed_at: string | null;
  created_at: string;
}

// NAV record
export interface NavRecord {
  id: string;
  nav_per_token: number;
  total_nav: number;
  total_supply: number;
  calculated_at: string;
  calculated_by: string | null;
  approved_by: string | null;
  approved_at: string | null;
  published_at: string | null;
  on_chain_tx_hash: string | null;
  status: NavStatus;
  created_at: string;
}

// Distribution
export interface Distribution {
  id: string;
  distribution_date: string;
  total_amount_usdc: number;
  nav_at_distribution: number | null;
  total_tokens_at_snapshot: number | null;
  status: DistributionStatus;
  approved_by: string | null;
  approved_at: string | null;
  executed_at: string | null;
  created_at: string;
}

// Distribution payment
export interface DistributionPayment {
  id: string;
  distribution_id: string;
  investor_id: string;
  token_balance_at_snapshot: number;
  share_percentage: number;
  amount_usdc: number;
  tx_hash: string | null;
  status: "pending" | "sent" | "confirmed" | "failed";
  created_at: string;
}

// Allowlist entry
export interface AllowlistEntry {
  id: string;
  wallet_address: string;
  investor_id: string | null;
  status: AllowlistStatus;
  added_by: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  on_chain_tx_hash: string | null;
  created_at: string;
}

// Audit log entry
export interface AuditEntry {
  actor_id: string;
  actor_email: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: Record<string, unknown>;
}

// Admin user
export interface AdminUser {
  id: string;
  auth_user_id: string;
  email: string;
  role: AdminRole;
  full_name: string | null;
  created_at: string;
}

// Concentration limits (Whitepaper Section 8)
export const CONCENTRATION_LIMITS = {
  maxAssetClassPct: 0.40, // No single asset class >40% of total fund NAV
  maxSingleAssetPct: 0.05, // No single real asset >5% of total fund NAV
  minTier12Pct: 0.25, // Minimum 25% in Tier 1+2 assets (cash + bonds)
} as const;

export const ASSET_CLASS_TIERS: Record<AssetClassCode, number> = {
  cash: 1,
  bonds: 2,
  art: 3,
  property: 4,
};

export interface ConcentrationExposure {
  byClass: Record<string, { value: number; pct: number }>;
  tier12Pct: number;
  largestSingleAssetPct: number;
  totalStakedValue: number;
}

export interface ConcentrationCheck {
  allowed: boolean;
  violations: string[];
  exposure: ConcentrationExposure;
}

// Asset Staking
export type AssetClassCode = "cash" | "art" | "property" | "bonds";

export type AssetStakeStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "lien_registered"
  | "tokens_minted";

export type SubscriptionSource = "direct" | "asset_stake";

export interface AssetClass {
  id: string;
  code: AssetClassCode;
  label: string;
  ltv_ratio: number;
  requires_appraisal: boolean;
  required_documents: string[];
  enabled: boolean;
  min_value_usd: number;
  created_at: string;
  updated_at: string;
}

export interface AssetStake {
  id: string;
  investor_id: string;
  asset_class_id: string;
  description: string;
  declared_value: number;
  appraised_value: number | null;
  ltv_ratio_applied: number | null;
  collateral_value: number | null;
  nav_at_stake: number | null;
  tokens_to_mint: number | null;
  subscription_id: string | null;
  appraisal_doc_url: string | null;
  supporting_docs: string[];
  lien_reference: string | null;
  status: AssetStakeStatus;
  review_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}
