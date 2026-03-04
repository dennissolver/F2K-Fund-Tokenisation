# F2K Housing Token — Action Plan

**Created:** 5 March 2026
**Status:** Pre-Tranche-1 / Platform Build Complete (Modules 0–6)

---

## Section 1: Critical Path (Blocks Everything Else)

These items have the longest lead times and gate everything downstream. Start immediately.

### 1.1 AFSL Application — Scoping & Lodgement

| Field | Detail |
|-------|--------|
| **What** | Australian Financial Services Licence to operate MIS + deal in financial products. Required before accepting any Tranche 2 investor funds. |
| **Who** | Law firm (Hamilton Locke, King & Wood Mallesons, or Gilbert + Tobin — all have digital assets teams) |
| **Timeline** | 4–8 weeks to prepare application; 6–12 months ASIC review. Total: 8–14 months |
| **Cost** | $80K–$150K (legal fees for preparation + ongoing liaison) |
| **Blocks** | Tranche 2 launch, accepting wholesale investor funds, fund operations |
| **Next action** | Email Hamilton Locke digital assets team requesting scoping meeting. Reference: AFSL for tokenised MIS under Chapter 5C, ASIC INFO 225 (Oct 2025), s708 wholesale only. Request fee estimate + timeline for lodgement. |

**Note:** ASIC's no-action position runs until 30 June 2026. If AFSL not granted by then, legal counsel must advise on interim arrangements.

### 1.2 Entity Formation — Trustee + Investment Manager + Operating Entity

| Field | Detail |
|-------|--------|
| **What** | Incorporate three entities: (1) F2K Housing Trustee Pty Ltd, (2) F2K Housing Management Pty Ltd (Investment Manager), (3) F2K Operating Pty Ltd. Prepare Trust Deed and Investment Management Agreement. |
| **Who** | Same law firm as AFSL (package deal). Dennis as initial director of all three. |
| **Timeline** | 2–4 weeks (entity incorporation: 1 week; Trust Deed drafting: 2–3 weeks) |
| **Cost** | $40K–$80K (Trust Deed: $25K–$50K; IMA: $15K–$25K; incorporations: $3K) |
| **Blocks** | AFSL application (needs entity to apply), trust deed (needed for IM), bank accounts, Tranche 1 convertible notes |
| **Next action** | Request entity formation as part of AFSL engagement letter. Trust Deed must reflect hybrid unit trust structure per whitepaper Section 5. |

### 1.3 Information Memorandum (IM) Drafting

| Field | Detail |
|-------|--------|
| **What** | Offer document for wholesale investors under s708. Must include: fund structure, risks, fees, redemption terms, smart contract architecture, governance. |
| **Who** | Law firm (same as AFSL) with input from Dennis on operational sections |
| **Timeline** | 4–6 weeks (can run parallel with AFSL prep, but needs Trust Deed complete first) |
| **Cost** | $30K–$60K |
| **Blocks** | Tranche 1 seed raise, Tranche 2 launch |
| **Next action** | Commission as part of law firm engagement. Whitepaper V3 is the source material — IM formalises it as a legal offer document. |

### 1.4 Smart Contract Audit (Tier-1)

| Field | Detail |
|-------|--------|
| **What** | Security audit of all Solidity contracts: F2KSubscription, F2KNavAttestation, F2KDistribution, plus T-REX configuration. Whitepaper mandates "Trail of Bits, OpenZeppelin, or equivalent." |
| **Who** | Trail of Bits, OpenZeppelin, Halborn, or Sigma Prime (Australian — may be faster). |
| **Timeline** | 2–4 weeks for audit engagement; 4–8 weeks audit execution; 2–4 weeks remediation. Total: 8–16 weeks. |
| **Cost** | $60K–$150K (depends on scope; 3 custom contracts + T-REX config = moderate scope) |
| **Blocks** | Mainnet deployment, Tranche 2 launch |
| **Next action** | Request quotes from Trail of Bits and Sigma Prime. Send: contract source code (packages/contracts/), test results (32 passing), deployment architecture doc. Ask for timeline + fixed-price quote. |

**IMPORTANT:** Our custom contracts (Subscription, NAV, Distribution) are relatively simple (~250 lines each). T-REX suite is Tokeny's audited code — our audit covers configuration and integration only. This should reduce scope and cost vs. a full protocol audit.

---

## Section 2: Parallel Workstreams

### Legal & Entity

| # | Item | Who | When | Cost | Next Action |
|---|------|-----|------|------|-------------|
| 2.1 | AUSTRAC DCE registration | Law firm | Weeks 3–8 | $10K–$20K | Include in law firm engagement. AML/CTF program template needed. Updated regs March 2026 — confirm compliance. |
| 2.2 | AML/CTF program | Law firm + compliance consultant | Weeks 4–10 | $15K–$25K | Commission AML/CTF program template. Must cover: CDD, EDD for >$10K, transaction monitoring, Travel Rule (>$1,500), sanctions screening, suspicious matter reporting. |
| 2.3 | Convertible note agreement (Tranche 1) | Law firm | Weeks 2–4 | $8K–$15K | Template for seed investors. 20–30% discount to NAV. 12-month lock-up. Must comply with s708. |
| 2.4 | Subscription agreement template | Law firm | Weeks 6–10 | $8K–$15K | For Tranche 2. Wholesale investor certification, risk acknowledgement, wallet verification consent. |
| 2.5 | Privacy policy & terms of service | Law firm | Weeks 4–6 | $5K–$10K | Required for investor portal. Must cover: data collection, wallet data, KYC data handling, cross-border data (Sumsub). |

### Regulatory

| # | Item | Who | When | Cost | Next Action |
|---|------|-----|------|------|-------------|
| 2.6 | AFSL application lodgement | Law firm | Week 6 (after entities formed) | Included in 1.1 | ASIC lodgement fee: $3,964 (current). |
| 2.7 | Responsible Manager appointment | Dennis + law firm | Weeks 4–8 | $0 (Dennis as initial RM) | AFSL requires at least 2 Responsible Managers. Dennis as one; second RM needed — recruit or appoint director with AFSL experience. |
| 2.8 | Compliance arrangements | Compliance consultant | Weeks 6–12 | $15K–$25K | AFSL conditions require documented compliance arrangements: breach reporting, conflict management, complaints handling. |
| 2.9 | Digital Assets Framework Bill monitoring | Law firm | Ongoing | Included in retainer | Bill introduced Nov 2025, not yet enacted. Law firm must advise on any structural changes needed if/when passed. |

### Vendor Selection

| # | Item | Who | When | Cost (setup) | Cost (ongoing) | Next Action |
|---|------|-----|------|-------------|----------------|-------------|
| 2.10 | Digital asset custody | Dennis | Weeks 4–8 | $5K–$15K | $2K–$5K/mo | Evaluate: Fireblocks (institutional standard), BitGo, Copper. Need: multi-sig, insurance, Australian entity support. Request demos from Fireblocks and BitGo. |
| 2.11 | KYC/AML production provider | Dennis | Weeks 4–8 | $2K–$5K | $2–$5/check | Current: Sumsub (sandbox). Production: Sumsub ($2–$3/check), Jumio ($3–$5), iDenfy ($1.50–$3). Sumsub already integrated — path of least resistance. Request production pricing from Sumsub. |
| 2.12 | Fund administrator | Dennis + law firm | Weeks 8–14 | $10K–$20K | $3K–$8K/mo | Needed for: NAV calculation, unit registry, tax reporting. Evaluate: Apex Group (digital assets fund admin), Citco, Vistra. Request proposals. |
| 2.13 | Market maker | Dennis | Weeks 12–20 | $20K–$50K retainer | Variable | Whitepaper names Wintermute, GSR, Keyrock. Not needed until Tranche 2. Begin introductions now. |
| 2.14 | Securitize Markets listing | Dennis | Weeks 14–20 | $25K–$75K | $5K–$15K/mo | SEC-registered ATS for secondary trading. Requires: legal opinion, token review, compliance docs. Begin application after IM complete. |
| 2.15 | Chainlink oracle (NAV) | Dennis / dev | Weeks 10–16 | $5K–$15K | $500–$2K/mo | Whitepaper specifies Chainlink for on-chain NAV. Current build uses direct contract calls. Evaluate: Chainlink Functions (custom data feed) vs. push oracle. Request Chainlink partnership meeting. |

### Board & Team

| # | Item | Who | When | Cost | Next Action |
|---|------|-----|------|------|-------------|
| 2.16 | Chair recruitment | Dennis | Weeks 1–12 | Board fees TBD | Whitepaper: Aboriginal & First Nations Housing Leader. Critical for credibility with NT/WA programs. Begin outreach to Aboriginal Housing organisations: AHURI, NAAJA, APO NT, AMSANT. |
| 2.17 | Second Responsible Manager | Dennis | Weeks 4–8 | $80K–$120K salary or board appointment | Required for AFSL. Need: RG 105 compliant, financial services experience. Can be a director appointment. |
| 2.18 | Compliance officer | Dennis | Weeks 8–14 | $100K–$140K salary | Required for AFSL conditions. Can be part-time/consultant initially ($2K–$4K/mo). |
| 2.19 | Fund accountant | Dennis | Weeks 10–16 | $80K–$120K salary or outsource | NAV calculation, distribution reconciliation, quarterly accounts. Can be outsourced to fund admin (2.12) initially. |

### Insurance

| # | Item | Who | When | Cost (annual) | Next Action |
|---|------|-----|------|---------------|-------------|
| 2.20 | Professional indemnity (PI) | Insurance broker | Weeks 8–12 | $15K–$40K | Required for AFSL. Must cover: investment management, trustee duties. Request quotes from Berkshire Hathaway Specialty, AIG, QBE. |
| 2.21 | Directors & officers (D&O) | Insurance broker | Weeks 8–12 | $10K–$25K | Standard for fund trustees. Bundle with PI. |
| 2.22 | Cyber insurance | Insurance broker | Weeks 10–14 | $8K–$20K | Covers: smart contract exploits, platform breaches, data loss. Specialist: Coalition, At-Bay. |
| 2.23 | Crime / fidelity bond | Insurance broker | Weeks 12–16 | $5K–$15K | Covers: internal fraud, misappropriation. Standard for funds. |

---

## Section 3: Platform Build Dependencies

The platform build (Modules 0–6) is code-complete. These items depend on specific modules being finished before they can proceed.

### Depends on Module 4 (Smart Contracts) — COMPLETE

| Item | Dependency | Status |
|------|-----------|--------|
| Smart contract audit (1.4) | Needs finalised contract code | **Ready to engage.** 32 tests passing. 3 custom contracts + T-REX config. |
| Gas optimisation review | Audit firm may recommend | Ready if audit requests it |

### Depends on Module 5 (Integration) — COMPLETE

| Item | Dependency | Status |
|------|-----------|--------|
| Chainlink oracle integration (2.15) | NAV publication flow must work end-to-end | **Ready.** Current flow uses direct contract call; Chainlink adds decentralised price feed on top. |
| T-REX full deployment (mainnet) | Identity Registry + compliance modules configured | **Sepolia working.** Mainnet deployment after audit. |
| Labrys architecture review | Full platform for review | **Ready.** If engaging Labrys, they can review the complete codebase now. |

### Depends on Module 6 (Security & Ops) — COMPLETE

| Item | Dependency | Status |
|------|-----------|--------|
| Penetration test | Complete app for testing | **Ready to engage.** Recommend: Bishop Fox, Synack, or CyberCX (Australian). $15K–$40K. |
| Operational readiness sign-off | Runbooks, monitoring, emergency procedures | **Runbooks written.** Need: real Gnosis Safe (not test), production Supabase project, production Vercel deployment. |
| KYC production switch | Platform KYC flow working | **Ready.** Switch Sumsub from sandbox to production. |

### Dependency Chain (Critical Path)

```
Entities formed (1.2)
  → Trust Deed complete
    → AFSL application lodged (1.1)
      → AFSL granted (6-12 months)
        → Tranche 2 launch

Smart contract audit (1.4)
  → Remediation complete
    → Mainnet deployment
      → Tranche 2 launch

IM complete (1.3)
  → Tranche 1 seed raise
    → Fund platform build (already done)
      → Tranche 2 launch
```

---

## Section 4: Pre-Mainnet Checklist

Every item must be YES before deploying contracts to Ethereum mainnet and accepting real funds.

### Legal & Regulatory
- [ ] Trustee entity (F2K Housing Trustee Pty Ltd) incorporated
- [ ] Investment Manager entity (F2K Housing Management Pty Ltd) incorporated
- [ ] Trust Deed executed
- [ ] Investment Management Agreement executed
- [ ] AFSL application lodged (grant not required for Tranche 1 if s708 only)
- [ ] AUSTRAC DCE registration complete
- [ ] AML/CTF program documented and operational
- [ ] Information Memorandum finalised and approved by legal
- [ ] Privacy policy published on investor portal
- [ ] Terms of service published on investor portal
- [ ] Subscription agreement template approved by legal
- [ ] Legal opinion on token classification (security token under Corporations Act)

### Smart Contracts
- [ ] Tier-1 security audit completed with no critical/high findings unresolved
- [ ] Audit remediation verified by auditor (re-review)
- [ ] All contracts deployed to mainnet with verified source on Etherscan
- [ ] Gnosis Safe (3-of-5) deployed on mainnet with real signers
- [ ] All contract admin roles transferred to Gnosis Safe
- [ ] Deployer private key admin access revoked from all contracts
- [ ] T-REX Identity Registry configured (country allow: AU)
- [ ] T-REX Compliance modules configured and tested
- [ ] ERC-3643 transfer restrictions verified (unverified wallet blocked)
- [ ] Contract addresses documented and published
- [ ] Emergency pause tested on mainnet (token.pause via Safe)
- [ ] Emergency freeze tested on mainnet (freezePartialTokens via Safe)

### Platform
- [ ] Production Supabase project provisioned (separate from dev)
- [ ] Production environment variables configured on Vercel
- [ ] Production domains configured (investor portal + admin console)
- [ ] SSL certificates active on production domains
- [ ] Supabase RLS policies verified on production (run test-rls.ts)
- [ ] DB smoke test passes on production (run smoke-test.ts)
- [ ] KYC provider (Sumsub) switched to production mode
- [ ] KYC webhook endpoint configured for production URL
- [ ] KYC webhook HMAC verification working in production
- [ ] Rate limiting active on all API endpoints
- [ ] CSP headers verified on production
- [ ] CORS restricted to production domains only
- [ ] Zod validation on all API request bodies
- [ ] Error pages (404, 500) display correctly
- [ ] All audit log entries verified (every admin action logged)
- [ ] Email templates configured (confirmation, password reset)

### Custody & Operations
- [ ] Digital asset custodian selected and onboarded
- [ ] Custodian insurance verified
- [ ] Treasury wallet (Gnosis Safe) funded with initial USDC for operations
- [ ] USDC contract address verified (mainnet Circle USDC, not testnet)
- [ ] Fund administrator appointed (or internal process documented)
- [ ] NAV calculation methodology documented
- [ ] Distribution calculation verified against test data
- [ ] Operational runbooks reviewed by at least 2 team members
- [ ] Monitoring alerts configured (Vercel, Supabase, on-chain)
- [ ] Incident response plan documented
- [ ] Backup & recovery procedures tested

### Insurance
- [ ] Professional indemnity insurance active
- [ ] D&O insurance active

### Testing
- [ ] Hardhat tests: all passing (currently 32/32)
- [ ] DB smoke test: all passing (currently 28/28)
- [ ] RLS test: all passing (currently 15/15)
- [ ] End-to-end manual test completed on staging (all 17 steps from Module 6)
- [ ] Penetration test completed with no critical findings unresolved
- [ ] Browser testing completed on Chrome, Firefox, Safari, mobile

---

## Section 5: Pre-Tranche-2 Checklist

Everything that must be complete before opening Tranche 2 ($600M raise) to wholesale investors.

### All of Section 4 (Pre-Mainnet), plus:

### Legal & Regulatory
- [ ] AFSL granted by ASIC
- [ ] Or: ASIC no-action letter / interim authorisation in place
- [ ] Information Memorandum updated for Tranche 2 (if amended since Tranche 1)
- [ ] Convertible note conversion mechanics tested and executed for Tranche 1 holders
- [ ] Tranche 1 investors' tokens minted at discount (20–30%) with 12-month lock-up enforced on-chain
- [ ] Legal opinion on secondary market structure (ATS + permissioned DEX)

### Fund Operations
- [ ] Fund administrator fully operational
- [ ] NAV calculation process tested with real data (at least 4 weekly cycles)
- [ ] Distribution process tested with real funds (at least 1 quarterly cycle)
- [ ] Redemption process tested (30-day notice, burn mechanics)
- [ ] Concentration limit smart contract enforcement verified (no single asset class >40% NAV)
- [ ] Liquidity waterfall operational (5–10% NAV in stablecoins)

### Secondary Market
- [ ] Securitize Markets listing approved and operational
- [ ] Or: alternative ATS selected and operational
- [ ] Permissioned DEX pool deployed (Uniswap V3 F2K-HT/USDC, whitelisted wallets only)
- [ ] Market maker appointed and quoting around NAV
- [ ] DEX pool seeded with initial liquidity ($20M–$40M per whitepaper)

### Multi-Asset Staking
- [ ] Cash/stablecoin on-ramp working (1:1, instant)
- [ ] Fiat on-ramp working (bank transfer → USDC conversion → mint)
- [ ] Contributions Committee formed for non-crypto asset staking
- [ ] Independent valuation process established for real assets
- [ ] Haircut schedule implemented per whitepaper Section 8
- [ ] SPV structure established for real property transfers
- [ ] Legal assignment templates for promissory notes and mortgages

### Board & Governance
- [ ] Chair appointed (Aboriginal & First Nations Housing Leader)
- [ ] Minimum 4 directors appointed (per whitepaper Section 13)
- [ ] Aboriginal Advisory Sub-Committee formed
- [ ] Audit & Risk Sub-Committee formed
- [ ] Manufacturer Accreditation Panel established
- [ ] At least 1 state delivery hub operational (WA/NT most likely)

### Pipeline
- [ ] At least 2 manufacturer pre-qualification agreements signed
- [ ] At least 1 letter of intent from a CHP or state housing authority
- [ ] Registered on at least 1 state procurement panel (WA DHW target)

---

## Section 6: Budget Summary

All costs are for Tranche 1 ($1M seed) period. Ranges reflect uncertainty — verify flagged items.

| Category | Low | High | Notes |
|----------|-----|------|-------|
| **Legal & Entity** | | | |
| AFSL preparation + lodgement | $80K | $150K | Hamilton Locke or equivalent |
| Entity formation + Trust Deed + IMA | $40K | $80K | Package with AFSL firm |
| AUSTRAC registration + AML/CTF | $25K | $45K | |
| Information Memorandum | $30K | $60K | |
| Convertible note + subscription agreements | $16K | $30K | |
| Privacy policy + ToS | $5K | $10K | |
| Ongoing legal retainer (6 months) | $15K | $30K | |
| **Legal subtotal** | **$211K** | **$405K** | |
| | | | |
| **Smart Contract Audit** | | | |
| Tier-1 audit (3 contracts + T-REX config) | $60K | $150K | Trail of Bits / Sigma Prime |
| Remediation + re-review | $10K | $25K | |
| **Audit subtotal** | **$70K** | **$175K** | |
| | | | |
| **Platform & Hosting** | | | |
| Vercel Pro (2 apps, 6 months) | $1.2K | $2.4K | $20/mo × 2 × 6 |
| Supabase Pro (production, 6 months) | $1.5K | $3K | $25/mo base + usage |
| Alchemy (RPC, 6 months) | $0.6K | $1.2K | Growth plan |
| Domain + SSL | $0.2K | $0.5K | |
| **Platform subtotal** | **$3.5K** | **$7.1K** | |
| | | | |
| **Vendor Setup** | | | |
| Digital asset custody (setup + 6 months) | $17K | $45K | Fireblocks or BitGo |
| KYC production (Sumsub, est. 200 checks) | $0.4K | $1K | $2–$5/check |
| Chainlink oracle integration | $5K | $15K | |
| **Vendor subtotal** | **$22.4K** | **$61K** | |
| | | | |
| **Insurance** | | | |
| Professional indemnity | $15K | $40K | Annual |
| D&O | $10K | $25K | Annual |
| Cyber | $8K | $20K | Annual |
| **Insurance subtotal** | **$33K** | **$85K** | |
| | | | |
| **Security Testing** | | | |
| Penetration test | $15K | $40K | CyberCX or Bishop Fox |
| **Security subtotal** | **$15K** | **$40K** | |
| | | | |
| **Team & Operations (6 months)** | | | |
| Dennis (founder, no salary in seed) | $0 | $0 | Sweat equity |
| Compliance consultant (part-time) | $12K | $24K | $2K–$4K/mo |
| Travel + manufacturer engagement | $15K | $30K | |
| Government relations / conferences | $5K | $15K | prefabAUS, CHIA, AHURI |
| Office / coworking | $6K | $12K | |
| **Operations subtotal** | **$38K** | **$81K** | |
| | | | |
| **Contingency (15%)** | **$59K** | **$128K** | |
| | | | |
| **TOTAL** | **$452K** | **$982K** | |

The whitepaper estimated $470K–$925K. This budget aligns closely. The $1M seed provides adequate runway with contingency.

**Key risk:** Legal costs are the largest variable. A complex AFSL application could push toward the high end. Lock in a fixed-fee engagement where possible.

---

## Section 7: Timeline

```
MONTH 1 (Mar 2026)          MONTH 2 (Apr)              MONTH 3 (May)
─────────────────────────   ─────────────────────────   ─────────────────────────
■■■■ Entity formation       ■■■■ Trust Deed complete    ■■■■ AFSL lodged
■■■■ Law firm engaged       ■■■■ AUSTRAC application    ■■■■ IM draft v1
■■■■ Audit firm engaged     ■■■■ AML/CTF program       ■■ Convertible note ready
■■ Chair search begins      ■■■■ Audit execution        ■■■■ Audit execution
■■ Custody vendor eval      ■■ KYC prod switch          ■■ Audit remediation
■■ Pen test engagement      ■■ Pen test execution       ■■ Pen test remediation
                            ■■ 2nd RM recruitment       ■■ Insurance quotes

MONTH 4 (Jun)               MONTH 5 (Jul)              MONTH 6 (Aug)
─────────────────────────   ─────────────────────────   ─────────────────────────
■■■■ IM finalised           ■■ Mainnet deployment       ■■■■ TRANCHE 1 SEED RAISE
■■ Audit remediation done   ■■■■ Production deploy      ■■■■ Seed investors onboard
■■ Fund admin selected      ■■ End-to-end mainnet test  ■■ Tranche 1 tokens minted
■■ Chainlink integration    ■■ Securitize application   ■■ Pipeline LOIs signed
■■ Insurance bound          ■■ Board appointments       ■■ State panel registration
■■ Compliance arrangements  ■■ First NAV publication    ■■ Manufacturer pre-qual

MONTH 7-12 (Sep 2026 – Feb 2027)
─────────────────────────────────
■■■■ AFSL under review (ASIC)
■■■■ Tranche 1 deployed — platform operational
■■■■ Weekly NAV cycles running
■■■■ First quarterly distribution
■■■■ Manufacturer network: 3-5 accredited
■■■■ WA DHW panel registration
■■■■ Board: 4+ directors appointed
■■■■ Securitize listing approved
■■■■ Market maker engaged
■■■■ Prepare for TRANCHE 2 LAUNCH (target: Month 12-14)

MONTH 13-18 (Mar – Aug 2027)
─────────────────────────────
■■■■ AFSL granted (expected)
■■■■ TRANCHE 2 LAUNCH ($600M target)
■■■■ DEX pool seeded
■■■■ Multi-state hub activation
■■■■ First housing contract awarded
```

**Critical dates:**
- **30 June 2026:** ASIC no-action position expires. AFSL must be lodged before this.
- **Month 6 (Aug 2026):** Tranche 1 seed raise target.
- **Month 12–14 (Feb–Apr 2027):** Tranche 2 launch target (subject to AFSL).

---

## Section 8: Risk Register

| # | Risk | Likelihood | Impact | L×I | Mitigation | Owner |
|---|------|-----------|--------|-----|------------|-------|
| 1 | **AFSL delayed beyond 12 months** — ASIC review takes longer than expected, blocks Tranche 2 | Medium | High | **High** | Lodge early (Month 3). Engage ASIC liaison. Have interim arrangement plan (authorised rep of existing AFSL holder). | Law firm + Dennis |
| 2 | **Tranche 1 seed raise fails** — cannot attract $1M from strategic stakeholders | Medium | High | **High** | Start investor conversations now. Lead with pipeline alignment (manufacturers, CHPs). Minimum viable raise: $500K (cut contingency + defer some vendors). | Dennis |
| 3 | **Smart contract exploit post-audit** — vulnerability discovered after mainnet deployment | Low | Critical | **High** | Tier-1 audit, emergency pause mechanism, bug bounty program, Tenderly monitoring, insurance. Gnosis Safe can upgrade contracts. | Audit firm + Dennis |
| 4 | **Government policy change** — new government reduces housing commitments or modular mandates | Low | High | **Medium** | Diversify across 6 states + federal. Bipartisan support for housing. Tier 1 pipeline (remote/cyclone) is structurally mandated regardless of politics. | Dennis |
| 5 | **Key person risk** — Dennis incapacitated or exits | Medium | High | **High** | Recruit co-founder or COO within 6 months. Document all operational knowledge. Board appointments provide continuity. | Dennis |
| 6 | **Stablecoin de-peg** — USDC loses peg or Circle faces regulatory action | Low | High | **Medium** | Monitor Circle regulatory status. Contingency: support USDT or AUD fiat alternative. Liquidity waterfall includes fiat tier. | Dennis + fund admin |
| 7 | **No manufacturer engagement** — manufacturers don't invest in Tranche 1 or partner | Medium | Medium | **Medium** | Begin outreach immediately. Attend prefabAUS conferences. Offer tangible pipeline (government LOIs). Backup: raise from non-manufacturer investors. | Dennis |
| 8 | **Regulatory change** — Digital Assets Framework Bill changes token classification | Medium | Medium | **Medium** | Structure designed forward-compatible per whitepaper. Law firm monitoring. Whitepaper explicitly addresses this. | Law firm |
| 9 | **Platform security breach** — investor data or funds compromised | Low | Critical | **Medium** | Pen test, RLS verification, rate limiting, CSP, custody insurance, incident response plan, cyber insurance. | Dennis + security vendor |
| 10 | **Securitize listing rejected** — ATS won't list F2K-HT | Low | Medium | **Low** | Alternative: tZERO, INX, or initially operate with direct fund redemption only. Secondary market is a convenience, not a requirement. | Dennis |

---

## Gaps Identified (Whitepaper vs. Build)

### In whitepaper but NOT in current platform build:

1. **Chainlink oracle for NAV** — Whitepaper Section 6 specifies Chainlink. Current build uses direct contract calls. **Action:** Integrate in Month 4–5 before mainnet.

2. **Multi-asset staking haircuts** — Whitepaper Section 8 has detailed haircut schedule (BTC/ETH 10–15%, property 30–45%, etc.). Current build has asset staking but no haircut enforcement in smart contracts. **Action:** Add haircut logic to staking flow before Tranche 2.

3. **Concentration limits (smart contract enforced)** — Whitepaper Section 8: "No single asset class >40% NAV. No single real asset >5% NAV." Current build has DB-level concentration checks but not on-chain enforcement. **Action:** Add on-chain checks before Tranche 2.

4. **Token burn on redemption** — Whitepaper Section 9: "Smart contract burns tokens" on redemption. Not implemented in current contracts. **Action:** Add burn mechanism before Tranche 2.

5. **Securitize Markets / DEX pool** — Whitepaper Section 9: regulated ATS + permissioned DEX. Not in current build scope. **Action:** Tranche 2 workstream (Month 12+).

6. **Contributions Committee** — Whitepaper Section 8: committee approval for non-crypto/fiat staking. Current build has admin approval but no formal committee workflow. **Action:** Can be operational process layered on existing admin console.

7. **SPV structure for real property** — Whitepaper Section 8: "Legal assignment to SPV trust" for property and mortgage staking. No SPV entity in current plan. **Action:** Legal workstream, needed before accepting real property stakes.

### In Labrys proposal scope but built in-house:

**Note:** No Labrys proposal file was found in the project. Based on whitepaper Section 12 budget ($80K–$180K for "Token design, ERC-3643 smart contracts, oracle, audit"), the original plan may have included professional smart contract development. The following items were built in-house and carry higher risk without professional review:

1. **ERC-3643 deployment configuration** — T-REX suite configuration (Identity Registry, Compliance modules, Trusted Issuers). **Recommendation:** Include in audit scope explicitly.

2. **Smart contract architecture** — Custom contracts follow standard patterns (AccessControl, ReentrancyGuard, SafeERC20) but have not been professionally reviewed. **Recommendation:** Audit is mandatory before mainnet. Currently scheduled.

3. **Platform security model** — Rate limiting, CSP, RLS policies designed in-house. **Recommendation:** Penetration test will validate. Currently scheduled.
