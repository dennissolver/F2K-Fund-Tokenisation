# Quarterly Distribution

## Prerequisites
- Quarterly USDC amount determined by fund management
- Distribution contract has USDC approved or admin wallet funded
- All investor wallets are on the allowlist

## Steps

1. **Create Distribution**
   - Admin Console → Distributions → "Create Distribution"
   - Enter: distribution date, total USDC amount
   - System auto-calculates pro-rata shares based on token holdings

2. **Review Payment Preview**
   - Verify each investor's share percentage and USDC amount
   - Confirm total matches expected distribution amount

3. **Approve Distribution**
   - Different admin reviews → "Approve"
   - Status changes to `approved`

4. **Execute On-Chain**
   - Click "Execute On-Chain"
   - System will:
     a. Approve USDC spend on distribution contract
     b. Call `distribute(recipients[], amounts[])`
   - If using Gnosis Safe: approve multisig transaction
   - Wait for confirmation

5. **Verify Completion**
   - Admin Console: all payments show `confirmed` with tx hashes
   - Check recipient wallets on Etherscan for USDC balance increase
   - Distribution status shows `completed`

6. **Generate Report**
   - Admin Console → Reports → Distribution Report
   - Download CSV for trustee records

## Troubleshooting

| Issue | Resolution |
|-------|-----------|
| Insufficient USDC | Fund admin wallet or Safe with USDC before executing |
| Gas too high | Wait for lower gas or increase gas limit |
| Partial failure | Check which payments went through; retry remaining |
