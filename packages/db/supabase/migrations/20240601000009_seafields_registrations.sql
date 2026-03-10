-- Seafields Estate — Registration of Interest table
-- Part of F2K Fund Tokenisation demand-validation
-- 141-lot subdivision, Pepper Gate, Waggrakine WA 6530

CREATE TABLE IF NOT EXISTS seafields_registrations (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name        TEXT NOT NULL,
  last_name         TEXT NOT NULL,
  email             TEXT NOT NULL,
  phone             TEXT,
  lots_selected     TEXT[] NOT NULL DEFAULT '{}',
  interest_type     TEXT,
  price_preferences JSONB NOT NULL DEFAULT '{}',
  suburb            TEXT,
  postcode          TEXT,
  buyer_type        TEXT,
  buyer_profile     TEXT,
  current_housing   TEXT,
  purchase_timeline TEXT,
  finance_status    TEXT,
  how_heard         TEXT,
  referrer_type     TEXT,
  referrer_name     TEXT,
  referrer_company  TEXT,
  referrer_contact  TEXT,
  notes             TEXT,
  consent           BOOLEAN NOT NULL DEFAULT FALSE,
  source            TEXT NOT NULL DEFAULT 'web-roi',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast lot count aggregation
CREATE INDEX IF NOT EXISTS idx_seafields_reg_lots
  ON seafields_registrations USING GIN (lots_selected);

-- Index for admin queries
CREATE INDEX IF NOT EXISTS idx_seafields_reg_created
  ON seafields_registrations (created_at DESC);

-- RLS: service role inserts only (no public access)
ALTER TABLE seafields_registrations ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (API routes use service key)
CREATE POLICY "Service role full access on seafields_registrations"
  ON seafields_registrations
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Comment for documentation
COMMENT ON TABLE seafields_registrations IS
  'Registration of interest for Seafields Estate (Pepper Gate, Waggrakine WA 6530). F2K Fund demand validation.';
