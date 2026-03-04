-- 004: Fix missing RLS policies + create stake-documents storage bucket
-- Addresses gaps found during E2E testing audit

-- ============================================================
-- 1. STORAGE BUCKET: stake-documents
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('stake-documents', 'stake-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Authenticated users can upload to their own folder (investor_id prefix)
CREATE POLICY "stake_docs_insert_own" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'stake-documents'
    AND auth.role() = 'authenticated'
  );

-- Authenticated users can read their own uploads
CREATE POLICY "stake_docs_read_own" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'stake-documents'
    AND auth.role() = 'authenticated'
  );

-- ============================================================
-- 2. SUBSCRIPTIONS: INSERT for authenticated investors
-- ============================================================
CREATE POLICY "subscriptions_insert_own" ON subscriptions
  FOR INSERT WITH CHECK (
    investor_id IN (SELECT id FROM investors WHERE auth_user_id = auth.uid())
  );

-- ============================================================
-- 3. ASSET_STAKES: INSERT + UPDATE for authenticated investors
-- ============================================================
CREATE POLICY "asset_stakes_insert_own" ON asset_stakes
  FOR INSERT WITH CHECK (
    investor_id IN (SELECT id FROM investors WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "asset_stakes_update_own" ON asset_stakes
  FOR UPDATE USING (
    investor_id IN (SELECT id FROM investors WHERE auth_user_id = auth.uid())
  )
  WITH CHECK (
    investor_id IN (SELECT id FROM investors WHERE auth_user_id = auth.uid())
  );

-- ============================================================
-- 4. AUDIT_LOG: INSERT for authenticated users (logging actions)
--    No SELECT for non-service-role (admin console uses service role)
-- ============================================================
CREATE POLICY "audit_log_insert_authenticated" ON audit_log
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
