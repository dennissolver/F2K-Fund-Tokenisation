# Module 2: Investor Portal

## Goal
Investor-facing app: register, eligibility check, KYC, connect wallet, subscribe (mock), dashboard.

## Dependencies
- Module 1 complete (monorepo, DB, auth working)

## Pages to Build

### 2.1 Landing Page (`/`)
- Hero: "F2K Housing Token — Tokenised National Housing Fund"
- Key stats: $600M target, 10,800 homes, 8-12% yield, 24/7 liquidity
- "Apply to Invest" CTA → `/register`
- "Already registered? Sign in" → `/login`
- F2K branding: navy background hero, gold accents, blue CTAs

### 2.2 Registration (`/register`)
- Email + password signup (Supabase Auth)
- On success: create `investors` record linked to `auth_user_id`
- Redirect to `/onboarding`

### 2.3 Login (`/login`)
- Email + password (Supabase Auth)
- Redirect to `/dashboard` if KYC approved, `/onboarding` otherwise

### 2.4 Onboarding (`/onboarding`)
Multi-step flow — use URL params or state for step tracking:

**Step 1: Eligibility** (`/onboarding?step=eligibility`)
- "Are you a wholesale or sophisticated investor under s708 of the Corporations Act?"
- Checkboxes:
  - [ ] I have net assets of at least $2.5 million (wholesale)
  - [ ] I have gross income of at least $250,000/year for each of the last 2 years (sophisticated)
  - [ ] I am investing through a company/trust that meets the above criteria
- Must tick at least one to proceed
- Store selection in `investors.investor_type` and declaration flags

**Step 2: Personal Details** (`/onboarding?step=details`)
- Full name (or entity name if company/trust)
- Country (default Australia, restrict to AU for MVP)
- Store in `investors` table

**Step 3: KYC** (`/onboarding?step=kyc`)
- Embed Sumsub Web SDK iframe
- Sumsub config: applicant level = "basic-kyc-level" (or sandbox equivalent)
- On completion: webhook from Sumsub → API route updates `investors.kyc_status`
- Show status: pending / approved / rejected with appropriate messaging
- If sandbox: add a "Simulate KYC Approval" button for dev/testing

**Step 4: Connect Wallet** (`/onboarding?step=wallet`)
- RainbowKit ConnectButton
- After connecting: sign a message to prove wallet ownership
  - Message: "I am connecting wallet {address} to my F2K investor account {email} at {timestamp}"
- Store `wallet_address` and `wallet_verified_at` in `investors` table
- Check: wallet not already linked to another investor

**Step 5: Complete** (`/onboarding?step=complete`)
- Summary of all info
- "Your account is ready. Go to Dashboard →"

### 2.5 Dashboard (`/dashboard`)
Server component. Reads from Supabase.

**Holdings card:**
- Token balance (from `subscriptions` where status = 'minted', summed)
- Current NAV per token (latest published `nav_records`)
- Total value = balance × NAV
- Unrealised gain/loss vs subscription cost

**Distributions card:**
- Table: date, amount USDC, status, tx hash (link to Etherscan Sepolia)
- Total distributions received

**Subscriptions card:**
- Table: date, amount USDC, token price, tokens received, status, tx hash
- "Subscribe More" button → `/subscribe`

**Fund overview card:**
- Current NAV per token
- Total fund NAV
- Last updated timestamp
- Link to on-chain NAV (placeholder until Module 5)

### 2.6 Subscribe (`/subscribe`)
- Input: amount in USDC (minimum $10,000)
- Display: current NAV, tokens to receive (amount / NAV)
- Review step: show all details + terms checkbox
- Submit: creates `subscriptions` record with status = 'pending'
- For MVP: no actual USDC transfer. Show "Subscription submitted. Our team will confirm receipt."
- In Module 5 this becomes a real USDC transfer flow.

### 2.7 Statements (`/statements`)
- Select quarter (dropdown)
- Generate PDF/CSV with: holdings at quarter end, subscriptions in quarter, distributions in quarter
- Download button
- Use server-side generation (API route returns file)

## API Routes

Create in `apps/investor-portal/src/app/api/`:

```
api/
├── auth/
│   └── callback/route.ts        # Supabase auth callback
├── kyc/
│   ├── webhook/route.ts         # Sumsub webhook receiver
│   └── token/route.ts           # Generate Sumsub access token
├── wallet/
│   └── verify/route.ts          # Verify wallet signature + store
├── subscribe/
│   └── route.ts                 # POST: create subscription
└── statements/
    └── route.ts                 # GET: generate statement PDF/CSV
```

### KYC Webhook (`api/kyc/webhook/route.ts`)
- Verify Sumsub webhook signature (HMAC)
- On `applicantReviewed` event with `reviewResult.reviewAnswer === "GREEN"`:
  - Update `investors.kyc_status` = 'approved'
  - Update `investors.kyc_completed_at` = now()
  - Create audit log entry
- On "RED": update status to 'rejected'

### Wallet Verify (`api/wallet/verify/route.ts`)
- Receive: wallet_address, signed_message, signature
- Verify signature using `viem.verifyMessage()`
- Check wallet not already claimed by another investor
- Update `investors.wallet_address` and `wallet_verified_at`
- Create audit log entry

## Packages to Install
```bash
# In apps/investor-portal
pnpm add @rainbow-me/rainbowkit wagmi viem @tanstack/react-query
pnpm add @supabase/supabase-js @supabase/ssr
pnpm add date-fns                    # date formatting
pnpm add -D @types/node
```

## wagmi + RainbowKit Setup

Create `apps/investor-portal/src/lib/wagmi.ts`:
```typescript
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "F2K Housing Token",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  chains: [sepolia],
  ssr: true,
});
```

Wrap app in providers (`layout.tsx`):
```typescript
// WagmiProvider + QueryClientProvider + RainbowKitProvider
// See RainbowKit docs for exact setup
```

## Acceptance Criteria
- [ ] New user can register with email/password
- [ ] Eligibility questionnaire enforces s708 requirements
- [ ] KYC flow shows Sumsub iframe (sandbox mode) or simulation button
- [ ] Wallet connect works (MetaMask/WalletConnect on Sepolia)
- [ ] Wallet ownership verified via signed message
- [ ] Dashboard shows holdings, distributions, subscriptions (empty state handled)
- [ ] Subscribe page creates pending subscription record
- [ ] All pages are responsive (mobile-friendly)
- [ ] Navigation: landing → register → onboarding (4 steps) → dashboard
- [ ] Supabase RLS: investor can only see own data
- [ ] `pnpm build` and `pnpm typecheck` pass

## Verification
```bash
pnpm --filter investor-portal build
pnpm --filter investor-portal typecheck
# Manual: walk through full registration flow in browser
# Manual: check Supabase dashboard — records created correctly
# Manual: connect MetaMask on Sepolia, sign message, verify wallet stored
```
