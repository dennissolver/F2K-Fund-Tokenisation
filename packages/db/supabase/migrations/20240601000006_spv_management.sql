CREATE TABLE spvs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('unit_trust', 'pty_ltd', 'partnership')),
  abn TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'winding_down', 'closed')),
  target_allocation NUMERIC(18,2),
  current_nav NUMERIC(18,2) DEFAULT 0,
  description TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE spvs ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER spvs_updated_at
  BEFORE UPDATE ON spvs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
