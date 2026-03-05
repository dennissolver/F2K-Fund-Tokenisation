# Contributions Committee — Asset Stake Review

## Purpose
The Contributions Committee assesses non-crypto asset contributions (cash, bonds, art, property) from investors seeking to receive F2K-HT tokens against the collateral value of their staked assets, rather than via direct USDC subscription.

## Committee Composition
- Minimum 2 members required for quorum
- At least one `fund_manager` or `super_admin`
- For property and art (Tier 3–4): recommend an external valuer on the committee
- Committee members must not have a conflict of interest with the contributing investor

## Prerequisites
- Stake submitted by investor (status: `submitted`)
- Investor has passed KYC and is on the allowlist
- Supporting documents uploaded to `stake-documents` storage bucket
- Asset class is enabled in the platform

## Review Process

### 1. Receive Submission
- Admin Console → **Stakes** → filter by status `submitted`
- Click the stake to open the detail view
- Review: investor name, asset class, declared value, description, supporting documents

### 2. Verify Documentation
Each asset class requires specific documents:

| Asset Class | Required Documents | Verification |
|------------|-------------------|--------------|
| **Cash** (Tier 1) | Bank statement (< 30 days) | Confirm account holder matches investor entity, balance ≥ declared value |
| **Bonds** (Tier 2) | Bond certificate or CHESS statement | Confirm holder, face value, maturity date, issuer credit rating |
| **Art** (Tier 3) | Independent valuation (< 12 months), provenance certificate, insurance certificate | Confirm valuer is accredited, provenance is clean, insurance covers declared value |
| **Property** (Tier 4) | Independent valuation (< 6 months), title search, council rates notice | Confirm valuer is API-certified, no caveats/encumbrances on title, rates current |

### 3. Set Appraised Value
- If the declared value is supported by documentation → use declared value
- If documentation shows a different value → use the documented/appraised value
- For property/art: always use the independent valuation, not the investor's declared value
- Enter the appraised value in the review form

### 4. Confirm LTV Ratio
Default LTV ratios per asset class:

| Asset Class | Default LTV | Typical Override Range |
|------------|-------------|----------------------|
| Cash | 95% | 90–95% |
| Bonds | 85% | 75–90% (depends on issuer rating) |
| Art | 50% | 30–60% (depends on liquidity) |
| Property | 70% | 50–75% (depends on location/type) |

- Override the LTV only with documented justification (e.g., lower credit rating bond → 75%)
- LTV overrides are recorded in the audit log

### 5. Check Concentration Limits
The platform automatically checks concentration limits on approval:
- No single asset class > 40% of total fund NAV
- No single real asset > 5% of total fund NAV
- Minimum 25% of staked value in Tier 1+2 assets (cash + bonds)

If a concentration limit is breached:
- The API returns the specific violations and current exposure
- The committee may override with `force: true` (soft block at approval stage)
- **At minting, concentration limits are a hard block with no override**
- Document the override rationale in review notes

### 6. Approve or Reject
- **Approve**: Admin Console → stake detail → enter appraised value, optional LTV override, review notes → click **Approve**
- **Reject**: Click **Reject** → enter rejection reason in review notes
- Both actions require `manage_stakes` permission (`fund_manager` or `super_admin`)

### 7. Register Lien (Approved Stakes Only)
- After approval, register a lien or charge over the asset:
  - Cash: bank acknowledgement letter or controlled money account reference
  - Bonds: custodian holding confirmation
  - Art: storage facility receipt + insurance assignment
  - Property: caveat or registered mortgage reference
- Admin Console → stake detail → click **Register Lien** → enter lien reference number
- Status changes to `lien_registered`

### 8. Mint Tokens
- After lien registration, click **Mint Tokens**
- System calculates: `tokens = collateral_value / nav_per_token`
- Hard concentration limit check runs (no override possible)
- Creates synthetic subscription with `source = 'asset_stake'`
- Mints tokens on-chain to investor's wallet
- Status changes to `tokens_minted`

## Escalation Criteria
Escalate to the full board (or Audit & Risk Sub-Committee) if:
- Single stake > $500K collateral value
- LTV override requested outside typical range
- Concentration override required
- Asset provenance is uncertain
- Investor has multiple stakes totalling > $1M

## Ongoing Obligations
- **Quarterly revaluation**: Tier 3–4 assets (art, property) must be revalued annually; update appraised values
- **Lien monitoring**: Verify liens remain registered; investigate if title searches show changes
- **Default process**: If an asset loses value below the collateral threshold, the committee must recommend action (margin call, partial burn, or unwinding the stake)

## Troubleshooting

| Issue | Resolution |
|-------|-----------|
| Concentration limit blocks approval | Check current exposure in error response; consider rejecting or reducing appraised value |
| Concentration limit blocks minting | Cannot override at mint; must wait for other stakes to unwind or fund NAV to increase |
| Documents expired | Reject stake; investor must resubmit with current documentation |
| Investor wallet not on allowlist | Complete allowlist flow before attempting token mint |
| On-chain mint fails | Check deployer wallet has ETH for gas; check token contract is not paused |
