-- 002_asset_staking.sql
-- Asset staking: investors stake real-world assets as collateral for F2K-HT tokens

-- Asset classes lookup table
CREATE TABLE asset_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE CHECK (code IN ('cash', 'art', 'property', 'bonds')),
  label TEXT NOT NULL,
  ltv_ratio NUMERIC(5,4) NOT NULL CHECK (ltv_ratio > 0 AND ltv_ratio <= 1),
  requires_appraisal BOOLEAN NOT NULL DEFAULT true,
  required_documents TEXT[] NOT NULL DEFAULT '{}',
  enabled BOOLEAN NOT NULL DEFAULT true,
  min_value_usd NUMERIC(18,2) NOT NULL DEFAULT 10000,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed the four asset classes (LTV per whitepaper Section 8)
INSERT INTO asset_classes (code, label, ltv_ratio, requires_appraisal, required_documents, min_value_usd) VALUES
  ('cash',     'Cash & Stablecoins', 1.0000, false, ARRAY['bank_statement'], 10000),
  ('art',      'Fine Art',           0.5000, true,  ARRAY['appraisal_report', 'provenance_certificate', 'insurance_certificate'], 50000),
  ('property', 'Real Property',      0.6000, true,  ARRAY['valuation_report', 'title_deed', 'insurance_certificate'], 100000),
  ('bonds',    'Government Bonds',   0.8000, false, ARRAY['holding_statement', 'bond_certificate'], 25000);

-- Asset stakes — full staking records
CREATE TABLE asset_stakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID NOT NULL REFERENCES investors(id),
  asset_class_id UUID NOT NULL REFERENCES asset_classes(id),
  description TEXT NOT NULL,
  declared_value NUMERIC(18,2) NOT NULL CHECK (declared_value > 0),
  appraised_value NUMERIC(18,2),
  ltv_ratio_applied NUMERIC(5,4),
  collateral_value NUMERIC(18,2),
  nav_at_stake NUMERIC(18,6),
  tokens_to_mint NUMERIC(18,6),
  subscription_id UUID REFERENCES subscriptions(id),
  appraisal_doc_url TEXT,
  supporting_docs TEXT[] NOT NULL DEFAULT '{}',
  lien_reference TEXT,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'lien_registered', 'tokens_minted')),
  review_notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add source column to subscriptions to distinguish stake-backed mints
ALTER TABLE subscriptions
  ADD COLUMN source TEXT NOT NULL DEFAULT 'direct'
    CHECK (source IN ('direct', 'asset_stake'));

-- Updated_at trigger function (create if not exists)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Updated_at triggers
CREATE TRIGGER set_asset_classes_updated_at
  BEFORE UPDATE ON asset_classes
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_asset_stakes_updated_at
  BEFORE UPDATE ON asset_stakes
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE asset_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_stakes ENABLE ROW LEVEL SECURITY;

-- Anyone can read enabled asset classes
CREATE POLICY asset_classes_public_read ON asset_classes
  FOR SELECT USING (enabled = true);

-- Investors read own stakes
CREATE POLICY asset_stakes_read_own ON asset_stakes
  FOR SELECT USING (
    investor_id IN (
      SELECT id FROM investors WHERE auth_user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX idx_asset_stakes_investor ON asset_stakes(investor_id);
CREATE INDEX idx_asset_stakes_status ON asset_stakes(status);
CREATE INDEX idx_asset_stakes_asset_class ON asset_stakes(asset_class_id);
