# Investor Onboarding

## Flow

1. **Registration**
   - Investor visits portal → "Register"
   - Enters email and password
   - Supabase Auth creates account
   - Investor record created in DB

2. **Eligibility Questionnaire**
   - Investor declares wholesale status (s708 exemption)
   - Confirms: net assets >$2.5M OR income >$250K
   - Selects investor type: wholesale or sophisticated

3. **KYC Verification**
   - Investor completes KYC via Sumsub widget
   - Sumsub processes verification
   - Webhook updates `kyc_status` to `approved` or `rejected`

4. **Compliance Review (Admin)**
   - Admin Console → Investors → find investor
   - Review KYC status, eligibility declarations
   - For manual override: "Approve KYC" or "Reject KYC"

5. **Wallet Connection**
   - Investor → Portal → Onboarding → "Connect Wallet"
   - Signs message to prove ownership
   - Portal verifies signature → stores wallet address

6. **Allowlist Approval (Admin)**
   - Admin Console → Allowlist → find pending wallet
   - Review investor profile
   - "Approve" → registers identity on-chain (Identity Registry)
   - Investor can now hold and transfer F2K-HT tokens

7. **Subscription**
   - Investor → Portal → "Subscribe"
   - Enters USDC amount (min $10,000)
   - Approves USDC → subscribes on-chain
   - USDC forwarded to treasury

## Admin Actions Required

| Step | Admin Role | Action |
|------|-----------|--------|
| KYC review | compliance, super_admin | Approve/reject KYC |
| Wallet approve | fund_manager, compliance, super_admin | Approve allowlist |
| Subscription confirm | fund_manager, super_admin | Confirm receipt |
| Token mint | fund_manager, super_admin | Mint F2K-HT |
