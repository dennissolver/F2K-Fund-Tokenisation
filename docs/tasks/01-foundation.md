# Module 1: Foundation

## Goal
Monorepo scaffolded, database provisioned, auth working, both apps deploying to Vercel.

## Setup Steps

### 1. Initialise monorepo
```bash
mkdir f2k-platform && cd f2k-platform
pnpm init
pnpm add -Dw turbo
mkdir -p apps/investor-portal apps/admin-console packages/contracts packages/shared packages/db docs/tasks
```

Create `turbo.json`:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": {},
    "typecheck": {}
  }
}
```

Create `pnpm-workspace.yaml`:
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### 2. Create Next.js apps
```bash
cd apps/investor-portal
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm
cd ../admin-console
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm
```

Both apps:
- Add shadcn/ui: `pnpm dlx shadcn@latest init`
- Set base path in shadcn config to use shared theme
- Add to each `layout.tsx`: F2K branding (navy #1A2744, blue #2B5797, gold #D4A843)

### 3. Shared package
`packages/shared/package.json`:
```json
{
  "name": "@f2k/shared",
  "version": "0.0.1",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": { "typecheck": "tsc --noEmit" }
}
```

Create `packages/shared/src/index.ts` — export shared types:
```typescript
// Token constants
export const TOKEN_NAME = "F2K Housing Token";
export const TOKEN_SYMBOL = "F2K-HT";
export const TOKEN_DECIMALS = 6;
export const USDC_DECIMALS = 6;

// Fund parameters
export const PREFERRED_RETURN = 0.08;       // 8% p.a.
export const MANAGEMENT_FEE = 0.015;        // 1.5% p.a.
export const PERFORMANCE_FEE = 0.20;        // 20% above hurdle
export const INTEGRATION_FEE = 0.12;        // 12% of GDV
export const MIN_INVESTMENT_USDC = 10_000;

// Investor types
export type InvestorType = "wholesale" | "sophisticated";
export type KYCStatus = "not_started" | "pending" | "approved" | "rejected" | "expired";
export type SubscriptionStatus = "pending" | "confirmed" | "minted" | "failed" | "cancelled";
export type DistributionStatus = "draft" | "approved" | "executing" | "completed" | "failed";
export type AllowlistStatus = "pending" | "approved" | "denied" | "revoked";

// Investor record
export interface Investor {
  id: string;
  email: string;
  wallet_address: string | null;
  kyc_status: KYCStatus;
  investor_type: InvestorType | null;
  created_at: string;
  updated_at: string;
}
```

### 4. Database package + schema
`packages/db/package.json`:
```json
{
  "name": "@f2k/db",
  "version": "0.0.1",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "generate": "supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > src/database.types.ts",
    "push": "supabase db push"
  }
}
```

Create `packages/db/supabase/migrations/001_initial_schema.sql`:
```sql
-- Investors
CREATE TABLE investors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  entity_name TEXT,
  wallet_address TEXT UNIQUE,
  wallet_verified_at TIMESTAMPTZ,
  investor_type TEXT CHECK (investor_type IN ('wholesale', 'sophisticated')),
  kyc_status TEXT NOT NULL DEFAULT 'not_started'
    CHECK (kyc_status IN ('not_started', 'pending', 'approved', 'rejected', 'expired')),
  kyc_provider_id TEXT,
  kyc_completed_at TIMESTAMPTZ,
  net_assets_declared BOOLEAN DEFAULT FALSE,
  income_declared BOOLEAN DEFAULT FALSE,
  country_code TEXT DEFAULT 'AU',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID NOT NULL REFERENCES investors(id),
  amount_usdc NUMERIC(18,6) NOT NULL,
  token_price NUMERIC(18,6) NOT NULL,
  tokens_to_mint NUMERIC(18,6) NOT NULL,
  tx_hash TEXT,
  mint_tx_hash TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'minted', 'failed', 'cancelled')),
  confirmed_by UUID,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- NAV records
CREATE TABLE nav_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nav_per_token NUMERIC(18,6) NOT NULL,
  total_nav NUMERIC(18,2) NOT NULL,
  total_supply NUMERIC(18,6) NOT NULL,
  calculated_at TIMESTAMPTZ NOT NULL,
  calculated_by UUID,
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  on_chain_tx_hash TEXT,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'approved', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Distributions
CREATE TABLE distributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distribution_date DATE NOT NULL,
  total_amount_usdc NUMERIC(18,6) NOT NULL,
  nav_at_distribution NUMERIC(18,6),
  total_tokens_at_snapshot NUMERIC(18,6),
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'approved', 'executing', 'completed', 'failed')),
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Distribution payments (one per investor per distribution)
CREATE TABLE distribution_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distribution_id UUID NOT NULL REFERENCES distributions(id),
  investor_id UUID NOT NULL REFERENCES investors(id),
  token_balance_at_snapshot NUMERIC(18,6) NOT NULL,
  share_percentage NUMERIC(10,8) NOT NULL,
  amount_usdc NUMERIC(18,6) NOT NULL,
  tx_hash TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'sent', 'confirmed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Allowlist
CREATE TABLE allowlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL UNIQUE,
  investor_id UUID REFERENCES investors(id),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'denied', 'revoked')),
  added_by UUID,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  on_chain_tx_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Audit log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID,
  actor_email TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER investors_updated_at
  BEFORE UPDATE ON investors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS policies (IMPORTANT: all tables must have RLS enabled)
ALTER TABLE investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nav_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE distribution_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE allowlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Investor can read own record
CREATE POLICY "investors_read_own" ON investors
  FOR SELECT USING (auth_user_id = auth.uid());

-- Investor can read own subscriptions
CREATE POLICY "subscriptions_read_own" ON subscriptions
  FOR SELECT USING (
    investor_id IN (SELECT id FROM investors WHERE auth_user_id = auth.uid())
  );

-- Investor can read own distribution payments
CREATE POLICY "distribution_payments_read_own" ON distribution_payments
  FOR SELECT USING (
    investor_id IN (SELECT id FROM investors WHERE auth_user_id = auth.uid())
  );

-- NAV records are public read
CREATE POLICY "nav_records_public_read" ON nav_records
  FOR SELECT USING (status = 'published');

-- Allowlist: investors can read own
CREATE POLICY "allowlist_read_own" ON allowlist
  FOR SELECT USING (
    investor_id IN (SELECT id FROM investors WHERE auth_user_id = auth.uid())
  );

-- Admin policies (service_role key bypasses RLS)
-- Admin console uses service_role, so no additional policies needed for admin ops
```

### 5. Contracts package (Hardhat)
```bash
cd packages/contracts
pnpm init
pnpm add -D hardhat @nomicfoundation/hardhat-toolbox typescript ts-node
npx hardhat init  # choose TypeScript project
pnpm add @openzeppelin/contracts
```

### 6. Environment template
Create `.env.example` at project root:
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_PROJECT_ID=

# Blockchain (Sepolia testnet)
NEXT_PUBLIC_ALCHEMY_API_KEY=
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=
DEPLOYER_PRIVATE_KEY=

# KYC (Sumsub sandbox)
SUMSUB_APP_TOKEN=
SUMSUB_SECRET_KEY=

# App
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 7. Git setup
```bash
git init
# .gitignore should include: node_modules, .env.local, .next, dist, out, cache, artifacts
git add -A
git commit -m "feat: initial monorepo scaffold"
```

## Acceptance Criteria
- [ ] `pnpm install` completes without errors
- [ ] `pnpm dev` starts both apps (investor-portal on :3000, admin-console on :3001)
- [ ] `pnpm build` completes without errors
- [ ] `pnpm typecheck` passes
- [ ] `cd packages/contracts && npx hardhat compile` succeeds
- [ ] Both apps show F2K-branded landing page with navy/blue/gold theme
- [ ] Database migration runs against Supabase (tables visible in dashboard)
- [ ] `.env.example` has all required keys documented
- [ ] Git repo initialised with clean first commit

## Files Created
```
f2k-platform/
├── CLAUDE.md
├── .env.example
├── .gitignore
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── apps/
│   ├── investor-portal/         # Next.js app (scaffolded)
│   │   └── src/app/
│   │       ├── layout.tsx       # F2K branded layout
│   │       └── page.tsx         # Landing page
│   └── admin-console/           # Next.js app (scaffolded)
│       └── src/app/
│           ├── layout.tsx       # F2K branded layout
│           └── page.tsx         # Admin dashboard shell
├── packages/
│   ├── contracts/               # Hardhat project
│   │   ├── hardhat.config.ts
│   │   └── contracts/           # (empty, ready for Module 4)
│   ├── shared/
│   │   └── src/index.ts         # Shared types + constants
│   └── db/
│       ├── src/index.ts         # Supabase client export
│       └── supabase/migrations/001_initial_schema.sql
└── docs/
    └── tasks/                   # These task files
```
