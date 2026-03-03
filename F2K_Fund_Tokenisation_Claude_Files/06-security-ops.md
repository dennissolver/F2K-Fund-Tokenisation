# Module 6: Security & Operations

## Goal
Production hardening, Gnosis Safe multisig, operational runbooks, documentation. Platform ready to demo to Labrys.

## Dependencies
- Modules 1-5 complete (full end-to-end working on Sepolia)

## Tasks

### 6.1 Gnosis Safe Setup

1. Go to app.safe.global → create new Safe on Sepolia
2. Configure 3-of-5 multisig (use 5 test wallets)
3. Transfer contract admin roles to Safe:
   - F2KNavAttestation: grant PUBLISHER_ROLE to Safe, revoke from deployer
   - F2KDistribution: grant DISTRIBUTOR_ROLE to Safe, revoke from deployer
   - F2KSubscription: grant MANAGER_ROLE to Safe, revoke from deployer
   - T-REX Token: transfer Agent role to Safe
4. Test: all admin operations now require multisig approval
5. Document Safe address in `packages/contracts/deployments.json`

### 6.2 Security Hardening

**API routes (both apps):**
- [ ] Rate limiting: use Vercel edge middleware or `next-rate-limit`
  - Auth endpoints: 5 req/min per IP
  - API routes: 30 req/min per user
  - Webhook endpoints: 100 req/min per IP
- [ ] Input validation: use `zod` schemas for all API request bodies
- [ ] CORS: restrict to app domains only
- [ ] CSP headers: add Content-Security-Policy in `next.config.js`

**Supabase:**
- [ ] Verify ALL tables have RLS enabled (run audit query)
- [ ] Verify no table uses `anon` key for writes
- [ ] Admin console exclusively uses `service_role` key
- [ ] Investor portal uses `anon` key with RLS

**Webhooks:**
- [ ] Sumsub webhook: verify HMAC signature on every request
- [ ] Reject webhooks with invalid signatures (return 401)

**Environment:**
- [ ] All secrets in environment variables (never in code)
- [ ] `.env.local` in .gitignore
- [ ] Separate Supabase projects for dev/staging/production (document in README)

**Smart contracts:**
- [ ] Verify all admin functions have access control modifiers
- [ ] Verify ReentrancyGuard on all state-changing external calls with transfers
- [ ] Run `npx hardhat compile --force` — no warnings

### 6.3 Monitoring

Create `docs/monitoring.md`:
- Vercel: enable Analytics and Speed Insights for both apps
- Supabase: set up email alerts for auth failures, high DB usage
- Blockchain: document how to watch for contract events via Etherscan
- For production: recommend Tenderly or Alchemy Notify for real-time alerts

### 6.4 Operational Runbooks

Create `docs/runbooks/` directory with:

**`weekly-nav-publication.md`:**
1. Fund admin calculates NAV (off-chain spreadsheet or system)
2. Log in to admin console → NAV → "Create NAV Record"
3. Enter: NAV per token, total NAV, calculation date
4. Different admin logs in → "Approve"
5. Click "Publish On-Chain" → confirm multisig transaction in Safe
6. Verify: investor portal shows updated NAV
7. Verify: Etherscan shows NavPublished event

**`quarterly-distribution.md`:**
1. Calculate total USDC to distribute this quarter
2. Admin console → Distributions → "Create Distribution"
3. Enter total amount → system calculates pro-rata shares
4. Review payment preview → "Approve"
5. Fund treasury: ensure distribution contract has USDC approved
6. "Execute On-Chain" → confirm multisig in Safe
7. Verify: each investor wallet received USDC
8. Verify: admin console shows all payments confirmed
9. Generate distribution report (CSV) for trustee records

**`investor-onboarding.md`:**
1. Investor registers on portal
2. Completes eligibility questionnaire
3. Completes KYC via Sumsub
4. Compliance officer reviews in admin console → approve/reject
5. Investor connects wallet on portal
6. Admin approves wallet on allowlist → on-chain identity registered
7. Investor can now subscribe

**`emergency-token-pause.md`:**
1. Identify the emergency (exploit, regulatory order, etc.)
2. Go to Safe → propose transaction: `token.pause()`
3. Collect 3-of-5 signatures
4. Execute → all transfers halted
5. Investigate and remediate
6. Resume: `token.unpause()` with 3-of-5

**`emergency-wallet-freeze.md`:**
1. Identify compromised wallet address
2. Safe → propose: `token.freezePartialTokens(wallet, amount)` or `setAddressFrozen(wallet, true)`
3. Collect signatures → execute
4. Investigate
5. Unfreeze when resolved

**`failed-transaction-recovery.md`:**
1. Check Etherscan for failed tx → identify revert reason
2. Common causes: insufficient gas, nonce issues, contract paused, insufficient balance
3. For each cause: specific resolution steps
4. Retry process: construct new tx with correct params

### 6.5 Architecture Documentation

Create `docs/architecture.md`:

```markdown
# F2K Platform Architecture

## System Diagram
[ASCII or Mermaid diagram showing:]
- Investor Portal (Vercel) → Supabase → Smart Contracts (Ethereum)
- Admin Console (Vercel) → Supabase → Smart Contracts
- Sumsub → Webhook → Investor Portal API
- Gnosis Safe → Smart Contracts

## Data Flow: Subscription
1. Investor → Portal → approve USDC → Subscription Contract → Treasury
2. Admin → Console → verify deposit → mint F2K-HT via Token Agent → Investor wallet
3. Supabase updated at each step with tx hashes

## Data Flow: Distribution
1. Admin → Console → create distribution → calculate shares
2. Admin → Console → approve → execute on-chain
3. Distribution Contract → USDC to each holder
4. Supabase updated with payment records + tx hashes

## Data Flow: NAV
1. Admin → Console → input NAV → approve
2. Admin → Console → publish → NavAttestation Contract
3. Portal reads from contract → displays to investors

## Security Model
- Investor data: Supabase RLS (investors see own data only)
- Admin actions: role-based access + audit logging
- Smart contracts: Gnosis Safe 3-of-5 multisig for all admin operations
- Token transfers: ERC-3643 compliance (verified wallets only)
```

### 6.6 Contract Interaction Guide

Create `docs/contract-guide.md`:
- For each contract: address, ABI location, key functions, example calls
- How to interact via Etherscan (for manual operations)
- How to interact via Safe (for multisig operations)
- How to interact via code (viem examples)

### 6.7 README

Create root `README.md`:
- Project overview (2 paragraphs)
- Quick start: prerequisites, install, env setup, run dev
- Project structure (brief)
- Link to docs/ for detailed documentation
- Link to deployment guide

## Acceptance Criteria
- [ ] Gnosis Safe deployed on Sepolia, all contract roles transferred
- [ ] Admin operations require multisig (test: single signer cannot publish NAV)
- [ ] Rate limiting active on all API routes
- [ ] Zod validation on all API request bodies
- [ ] CSP headers present on both apps
- [ ] Supabase RLS audit: all tables protected
- [ ] All 6 runbooks written and walkable
- [ ] Architecture doc complete with data flow diagrams
- [ ] Contract interaction guide usable by someone new to the project
- [ ] README allows new developer to get running in <15 minutes
- [ ] `pnpm build` passes
- [ ] `npx hardhat test` all passing
- [ ] Full end-to-end test completed following runbooks

## Final Verification: End-to-End Demo Script

Run through this entire flow as a final acceptance test:

```
1. Start both apps: pnpm dev
2. Register as new investor on portal
3. Complete eligibility (wholesale)
4. Complete KYC (sandbox/simulate)
5. Admin console: approve KYC
6. Portal: connect wallet (Sepolia MetaMask)
7. Admin console: approve wallet on allowlist
8. Portal: subscribe 10,000 USDC (testnet)
9. Admin console: confirm subscription, mint tokens
10. Portal: verify dashboard shows 10,000 F2K-HT
11. Admin console: publish NAV ($1.05 per token)
12. Portal: verify NAV updated, value shows $10,500
13. Admin console: create distribution ($800 total, this investor gets $800)
14. Admin console: execute distribution
15. Verify: investor wallet has USDC from distribution
16. Admin console: verify all audit log entries present
17. Export investor register CSV — verify correct
```

If all 17 steps pass: **platform is ready to take to Labrys.**
