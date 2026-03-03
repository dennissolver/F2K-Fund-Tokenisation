# Weekly NAV Publication

## Prerequisites
- Fund admin has calculated NAV from off-chain systems
- Admin console access with `fund_manager` or `super_admin` role

## Steps

1. **Submit NAV Record**
   - Log in to Admin Console → NAV Management
   - Click "Create NAV Record"
   - Enter: NAV per token, Total NAV, Total supply, Calculation date
   - Submit → record created with status `draft`

2. **Approve NAV**
   - A *different* admin logs in (dual-control)
   - Review the submitted values
   - Click "Approve" → status changes to `approved`

3. **Publish On-Chain**
   - Click "Publish to Blockchain"
   - If using Gnosis Safe: confirm multisig transaction in Safe app
   - If using single wallet (dev): confirm in admin console
   - Wait for transaction confirmation

4. **Verify**
   - Check admin console: NAV record shows `published` status with tx hash
   - Click Etherscan link → verify `NavPublished` event
   - Check investor portal → dashboard shows updated NAV
   - Check investor portal → fund overview shows new NAV per token

## Troubleshooting

| Issue | Resolution |
|-------|-----------|
| Transaction failed | Check deployer wallet has ETH for gas |
| NAV not showing in portal | Verify status is `published` in DB |
| Wrong values published | Cannot undo on-chain; publish corrected NAV |
