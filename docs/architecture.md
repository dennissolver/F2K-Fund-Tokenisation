# F2K Platform Architecture

## System Overview

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Investor Portal │     │  Admin Console   │     │   Gnosis Safe    │
│  (Next.js/Vercel)│     │ (Next.js/Vercel) │     │  (3-of-5 Multisig│
└────────┬─────────┘     └────────┬─────────┘     └────────┬─────────┘
         │                        │                        │
         │  Auth/Data             │  Service Role          │  Propose/Sign
         ▼                        ▼                        ▼
┌──────────────────────────────────────┐     ┌──────────────────────┐
│           Supabase (Sydney)          │     │  Ethereum (Sepolia)  │
│  ┌──────┐ ┌─────┐ ┌──────┐ ┌─────┐ │     │  ┌────────────────┐  │
│  │ Auth │ │ RLS │ │ DB   │ │Audit│ │     │  │ F2K-HT (ERC3643│  │
│  └──────┘ └─────┘ └──────┘ └─────┘ │     │  │ Subscription   │  │
└──────────────────────────────────────┘     │  │ NAV Attestation│  │
         ▲                                    │  │ Distribution   │  │
         │  Webhook                           │  │ Identity Reg.  │  │
┌────────┴─────────┐                         │  └────────────────┘  │
│      Sumsub      │                         └──────────────────────┘
│  (KYC Provider)  │
└──────────────────┘
```

## Data Flows

### Subscription Flow
1. Investor → Portal → enters USDC amount
2. Portal → `usdc.approve()` → Subscription Contract
3. Portal → `subscription.subscribe(amount)` → USDC forwarded to Treasury
4. Portal → API → creates subscription record in Supabase with tx_hash
5. Admin → Console → "Confirm" → verifies USDC receipt
6. Admin → Console → "Mint" → `token.mint(investor, tokens)` via T-REX Agent
7. Admin → Console → `subscription.markProcessed(id)` on-chain
8. Supabase updated at each step with tx hashes + audit log

### Distribution Flow
1. Admin → Console → "Create Distribution" → calculates pro-rata shares
2. Admin → Console → "Approve" → different admin reviews
3. Admin → Console → "Execute On-Chain":
   - `usdc.approve(distributionContract, totalAmount)`
   - `distribution.distribute(recipients[], amounts[])`
4. Supabase → all payment records updated with tx_hash + "confirmed"

### NAV Publication Flow
1. Admin → Console → submits NAV (navPerToken, totalNav, totalSupply)
2. Different admin → "Approve"
3. Admin → "Publish On-Chain" → `navAttestation.publishNav()`
4. Supabase → nav_record updated with on_chain_tx_hash
5. Investor Portal → reads from contract via wagmi `useReadContract`

### Investor Onboarding Flow
1. Register (email/password) → Supabase Auth
2. Eligibility questionnaire → investor record created
3. KYC via Sumsub → webhook updates kyc_status
4. Compliance officer reviews → approve/reject
5. Connect wallet → signature verification → wallet stored
6. Admin approves allowlist → identity registered on-chain
7. Investor can now subscribe

## Security Model

| Layer | Protection |
|-------|-----------|
| Investor data | Supabase RLS — investors see own data only |
| Admin actions | Role-based access (super_admin, fund_manager, compliance, read_only) |
| Audit trail | Every admin mutation logged with actor, action, entity, details |
| Smart contracts | Gnosis Safe 3-of-5 multisig for all privileged operations |
| Token transfers | ERC-3643 compliance — only verified wallets can hold/transfer |
| API security | Rate limiting, CSP headers, zod validation, HMAC webhook verification |

## Database Schema

8 tables with RLS:
- `investors` — profile, KYC status, wallet
- `subscriptions` — USDC deposits, token calculations, tx hashes
- `nav_records` — weekly NAV with approval workflow
- `distributions` — quarterly payouts
- `distribution_payments` — per-investor payment records
- `allowlist` — wallet verification + on-chain identity
- `audit_log` — immutable action trail
- `admin_users` — RBAC for admin console

## Smart Contracts

| Contract | Purpose | Access Control |
|----------|---------|---------------|
| F2KSubscription | Accept USDC subscriptions, forward to treasury | MANAGER_ROLE |
| F2KNavAttestation | Publish NAV on-chain for transparency | PUBLISHER_ROLE |
| F2KDistribution | Pro-rata USDC distribution to holders | DISTRIBUTOR_ROLE |
| F2K-HT Token | ERC-3643 security token (T-REX) | Agent role for minting |
| Identity Registry | Allowlist of verified wallets | Registry Agent |
