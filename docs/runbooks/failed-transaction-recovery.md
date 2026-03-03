# Failed Transaction Recovery

## Diagnosing Failed Transactions

1. **Find the failed transaction**
   - Admin Console → check for error status or missing tx_hash
   - Etherscan → search by wallet address → find failed tx
   - Note the revert reason

2. **Common Causes & Fixes**

| Cause | Revert Message | Fix |
|-------|---------------|-----|
| Insufficient gas | "out of gas" | Retry with higher gas limit |
| Nonce conflict | "nonce too low" | Wait for pending txs to clear, or replace |
| Contract paused | "Pausable: paused" | Unpause token first |
| Insufficient USDC | "ERC20: insufficient balance" | Fund wallet with USDC |
| Insufficient allowance | "ERC20: insufficient allowance" | Re-approve USDC spend |
| Not on allowlist | "Identity not found" | Register identity first |
| Below minimum | "Below minimum" | Increase subscription amount |
| Already processed | "Already processed" | Subscription was already handled |
| Access denied | "AccessControl: unauthorized" | Use correct role account or Safe |

## Recovery Steps

### Failed Subscription
1. Check investor's USDC balance and allowance
2. If USDC was deducted but subscription not recorded:
   - Check SubscriptionReceived events on-chain
   - Manually create subscription record in Supabase with tx_hash
3. If USDC was not deducted: investor can retry

### Failed Distribution
1. Check which payments went through (PaymentSent events)
2. For payments that succeeded: update DB to "confirmed"
3. For remaining: create new distribution with only unpaid recipients
4. Retry execution

### Failed NAV Publication
1. NAV is still "approved" in DB
2. Check gas/balance → fix underlying issue
3. Retry "Publish On-Chain"

### Failed Token Mint
1. Check if tokens were actually minted (Transfer event)
2. If minted: update subscription to "minted" manually
3. If not: check agent role permissions → retry mint

## Prevention
- Always check gas balance before batch operations
- Use gas estimation before submitting transactions
- Monitor Safe nonce for sequential operations
