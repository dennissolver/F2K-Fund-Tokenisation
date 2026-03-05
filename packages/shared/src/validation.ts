import { z } from "zod";

// Subscription
export const subscribeSchema = z.object({
  amount_usdc: z.number().min(10_000, "Minimum $10,000 USDC"),
  tx_hash: z.string().regex(/^0x[a-fA-F0-9]{64}$/).optional(),
});

// KYC webhook (Sumsub)
export const kycWebhookSchema = z.object({
  type: z.string(),
  applicantId: z.string(),
  reviewResult: z
    .object({
      reviewAnswer: z.enum(["GREEN", "RED", "PENDING"]),
    })
    .optional(),
  externalUserId: z.string().optional(),
});

// Wallet verification
export const walletVerifySchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  signature: z.string(),
  message: z.string(),
});

// Admin: allowlist action
export const allowlistActionSchema = z.object({
  action: z.enum(["approve", "deny", "revoke"]),
});

// Admin: NAV submission
export const navSubmitSchema = z.object({
  nav_per_token: z.number().positive(),
  total_nav: z.number().positive(),
  total_supply: z.number().positive(),
});

// Admin: distribution creation
export const distributionCreateSchema = z.object({
  distribution_date: z.string().datetime(),
  total_amount_usdc: z.number().positive(),
});

// Admin: KYC override
export const kycOverrideSchema = z.object({
  status: z.enum(["approved", "rejected"]),
});

// Asset staking: investor submits a stake
export const stakeSubmitSchema = z.object({
  asset_class_id: z.string().uuid(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  declared_value: z.number().positive("Value must be positive"),
});

// Asset staking: admin reviews a stake
export const stakeReviewSchema = z.object({
  action: z.enum(["approve", "reject"]),
  appraised_value: z.number().positive().optional(),
  ltv_override: z.number().min(0).max(1).optional(),
  review_notes: z.string().optional(),
  force: z.boolean().optional(),
});

// Asset staking: admin registers lien
export const stakeLienSchema = z.object({
  lien_reference: z.string().min(1, "Lien reference is required"),
});

// Asset staking: admin updates asset class
export const assetClassUpdateSchema = z.object({
  ltv_ratio: z.number().min(0).max(1).optional(),
  description: z.string().optional(),
  enabled: z.boolean().optional(),
  min_value_usd: z.number().positive().optional(),
});

// Registration of Interest
export const registerInterestSchema = z.object({
  type: z.enum(["lender", "government", "offtaker"]),
  org_name: z.string().min(2),
  contact_name: z.string().min(2),
  contact_email: z.string().email(),
  contact_phone: z.string().optional(),
  organisation_type: z.string().optional(),
  region: z.enum(["NSW","VIC","QLD","WA","SA","TAS","NT","ACT","National"]).optional(),
  message: z.string().max(2000).optional(),
  honeypot: z.string().optional(),
  details: z.record(z.unknown()).optional(),
});
export type RegisterInterestInput = z.infer<typeof registerInterestSchema>;

// Admin: ROI status update
export const roiStatusUpdateSchema = z.object({
  status: z.enum(["new", "contacted", "qualified", "declined"]),
  notes: z.string().optional(),
});
export type RoiStatusUpdateInput = z.infer<typeof roiStatusUpdateSchema>;

export type SubscribeInput = z.infer<typeof subscribeSchema>;
export type WalletVerifyInput = z.infer<typeof walletVerifySchema>;
export type AllowlistActionInput = z.infer<typeof allowlistActionSchema>;
export type NavSubmitInput = z.infer<typeof navSubmitSchema>;
export type StakeSubmitInput = z.infer<typeof stakeSubmitSchema>;
export type StakeReviewInput = z.infer<typeof stakeReviewSchema>;
export type StakeLienInput = z.infer<typeof stakeLienSchema>;
export type AssetClassUpdateInput = z.infer<typeof assetClassUpdateSchema>;
