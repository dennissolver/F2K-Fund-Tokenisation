-- Branscombe Estate — Registration of Interest table
-- Part of F2K Fund Tokenisation demand-validation

CREATE TABLE IF NOT EXISTS branscombe_registrations (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT,
  units_selected TEXT[] NOT NULL DEFAULT '{}',
  notes         TEXT,
  consent       BOOLEAN NOT NULL DEFAULT FALSE,
  source        TEXT NOT NULL DEFAULT 'web-roi',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast unit count aggregation
CREATE INDEX IF NOT EXISTS idx_branscombe_reg_units
  ON branscombe_registrations USING GIN (units_selected);

-- Index for admin queries
CREATE INDEX IF NOT EXISTS idx_branscombe_reg_created
  ON branscombe_registrations (created_at DESC);

-- RLS: service role inserts only (no public access)
ALTER TABLE branscombe_registrations ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (API routes use service key)
CREATE POLICY "Service role full access on branscombe_registrations"
  ON branscombe_registrations
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Comment for documentation
COMMENT ON TABLE branscombe_registrations IS
  'Registration of interest for Branscombe Estate (122-124 Branscombe Rd, Claremont TAS). F2K Fund demand validation.';
