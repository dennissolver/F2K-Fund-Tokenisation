-- Add missing INSERT and UPDATE RLS policies for the investors table.
-- Previously only a SELECT policy existed, blocking registration and onboarding.

-- Allow authenticated users to insert their own investor record
CREATE POLICY "investors_insert_own" ON investors
  FOR INSERT WITH CHECK (auth_user_id = auth.uid());

-- Allow authenticated users to update their own investor record
CREATE POLICY "investors_update_own" ON investors
  FOR UPDATE USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());
