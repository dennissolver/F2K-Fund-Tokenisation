# Emergency Token Pause

## When to Use
- Security exploit detected
- Regulatory order received
- Critical bug discovered in token contract

## Steps

1. **Identify the emergency**
   - Document: what happened, when, who reported it
   - Assess: scope of impact, urgency

2. **Propose Pause Transaction**
   - Go to app.safe.global → select F2K Safe
   - New Transaction → Transaction Builder
   - Contract: F2K-HT Token address
   - Function: `pause()`
   - Submit proposal

3. **Collect Signatures**
   - Notify all 5 signers immediately
   - Need 3-of-5 signatures
   - Each signer reviews and confirms in Safe

4. **Execute**
   - Once 3 signatures collected → Execute
   - All token transfers are now halted
   - Verify on Etherscan: `Paused` event emitted

5. **Investigate & Remediate**
   - Root cause analysis
   - Develop fix if needed
   - Coordinate with Labrys if contract upgrade needed

6. **Resume Operations**
   - Safe → propose `unpause()` transaction
   - Collect 3-of-5 signatures
   - Execute → transfers resume
   - Verify: test transfer works

## Emergency Contacts

| Role | Action |
|------|--------|
| Fund Manager | Initiate pause proposal |
| Compliance | Review regulatory implications |
| Technical Lead | Root cause analysis |
| Labrys | Contract-level support |
