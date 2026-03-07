-- Migration: redemptions & marketplace_listings
-- Description: Adds fund redemption requests and peer-to-peer token marketplace

-- =============================================================================
-- 1. Trigger function for updated_at (idempotent)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 2. redemptions table
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.redemptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id     UUID NOT NULL REFERENCES public.investors(id),
  token_amount    NUMERIC(18,6) NOT NULL,
  nav_at_request  NUMERIC(18,6),
  redemption_value_usdc NUMERIC(18,6),
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'approved', 'rejected', 'processing', 'completed', 'cancelled')),
  notice_period_ends TIMESTAMPTZ,
  approved_by     UUID,
  approved_at     TIMESTAMPTZ,
  burn_tx_hash    TEXT,
  payout_tx_hash  TEXT,
  rejection_reason TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- updated_at trigger
CREATE TRIGGER set_redemptions_updated_at
  BEFORE UPDATE ON public.redemptions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- RLS
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Investors can view own redemptions"
  ON public.redemptions
  FOR SELECT
  USING (
    investor_id IN (
      SELECT id FROM public.investors WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Investors can create own redemptions"
  ON public.redemptions
  FOR INSERT
  WITH CHECK (
    investor_id IN (
      SELECT id FROM public.investors WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Service role full access on redemptions"
  ON public.redemptions
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- =============================================================================
-- 3. marketplace_listings table
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id           UUID NOT NULL REFERENCES public.investors(id),
  token_amount        NUMERIC(18,6) NOT NULL,
  price_per_token     NUMERIC(18,6) NOT NULL,
  total_price_usdc    NUMERIC(18,6) NOT NULL,
  status              TEXT NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active', 'filled', 'cancelled', 'expired')),
  buyer_id            UUID REFERENCES public.investors(id),
  filled_at           TIMESTAMPTZ,
  transfer_tx_hash    TEXT,
  settlement_tx_hash  TEXT,
  expires_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- updated_at trigger
CREATE TRIGGER set_marketplace_listings_updated_at
  BEFORE UPDATE ON public.marketplace_listings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- RLS
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view active listings"
  ON public.marketplace_listings
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Investors can create own listings"
  ON public.marketplace_listings
  FOR INSERT
  WITH CHECK (
    seller_id IN (
      SELECT id FROM public.investors WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Investors can update own listings"
  ON public.marketplace_listings
  FOR UPDATE
  USING (
    seller_id IN (
      SELECT id FROM public.investors WHERE auth_user_id = auth.uid()
    )
  )
  WITH CHECK (
    seller_id IN (
      SELECT id FROM public.investors WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Service role full access on marketplace_listings"
  ON public.marketplace_listings
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
