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

export type SubscribeInput = z.infer<typeof subscribeSchema>;
export type WalletVerifyInput = z.infer<typeof walletVerifySchema>;
export type AllowlistActionInput = z.infer<typeof allowlistActionSchema>;
export type NavSubmitInput = z.infer<typeof navSubmitSchema>;
