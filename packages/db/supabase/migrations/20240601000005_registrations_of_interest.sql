-- Registration of Interest table for multi-audience lead capture
CREATE TABLE registrations_of_interest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('lender', 'government', 'offtaker')),
  org_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  organisation_type TEXT,
  region TEXT CHECK (region IN ('NSW','VIC','QLD','WA','SA','TAS','NT','ACT','National')),
  message TEXT,
  details JSONB DEFAULT '{}',
  honeypot TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','qualified','declined')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE registrations_of_interest ENABLE ROW LEVEL SECURITY;

-- Anon can insert (public registration form)
CREATE POLICY "roi_anon_insert" ON registrations_of_interest
  FOR INSERT TO anon WITH CHECK (true);

-- Only service_role can read/update (admin console uses service client)
-- No explicit SELECT/UPDATE policies for anon = denied by default with RLS enabled

CREATE INDEX idx_roi_type ON registrations_of_interest(type);
CREATE INDEX idx_roi_status ON registrations_of_interest(status);
CREATE INDEX idx_roi_created ON registrations_of_interest(created_at DESC);
