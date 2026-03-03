# Emergency Wallet Freeze

## When to Use
- Compromised investor wallet detected
- Suspicious transfer activity
- Compliance requirement to freeze specific wallet

## Steps

1. **Identify Compromised Wallet**
   - Document: wallet address, reason for freeze
   - Check: current token balance, recent transactions

2. **Freeze Wallet**
   - Go to app.safe.global → select F2K Safe
   - New Transaction → Transaction Builder
   - Contract: F2K-HT Token address
   - Function: `setAddressFrozen(walletAddress, true)`
   - Submit proposal

3. **Collect Signatures**
   - Need 3-of-5 signatures
   - Each signer reviews the freeze request

4. **Execute**
   - Wallet can no longer send or receive F2K-HT tokens
   - Verify on Etherscan

5. **Investigate**
   - Contact investor if legitimate
   - Review transaction history
   - Coordinate with compliance

6. **Unfreeze (When Resolved)**
   - Safe → propose `setAddressFrozen(walletAddress, false)`
   - Collect signatures → execute
   - Notify investor

## Alternative: Partial Freeze
- Use `freezePartialTokens(walletAddress, amount)` to freeze specific token amount
- Investor can still transfer unfrozen tokens
