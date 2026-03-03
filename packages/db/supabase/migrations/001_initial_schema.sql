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

-- Admin users
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'fund_manager', 'compliance', 'read_only')),
  full_name TEXT,
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

-- RLS policies (all tables must have RLS enabled)
ALTER TABLE investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nav_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE distribution_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE allowlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

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

-- NAV records are public read (published only)
CREATE POLICY "nav_records_public_read" ON nav_records
  FOR SELECT USING (status = 'published');

-- Allowlist: investors can read own
CREATE POLICY "allowlist_read_own" ON allowlist
  FOR SELECT USING (
    investor_id IN (SELECT id FROM investors WHERE auth_user_id = auth.uid())
  );

-- Admin users: can read own
CREATE POLICY "admin_users_read_own" ON admin_users
  FOR SELECT USING (auth_user_id = auth.uid());

-- Admin console uses service_role key which bypasses RLS
