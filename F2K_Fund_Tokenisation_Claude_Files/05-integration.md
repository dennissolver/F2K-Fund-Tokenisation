# Module 5: Blockchain Integration

## Goal
Connect the web apps (Modules 2-3) to the smart contracts (Module 4). End-to-end flow on Sepolia.

## Dependencies
- Modules 1-4 complete
- Contracts deployed on Sepolia with addresses in `packages/contracts/deployments.json`

## Setup

### Export ABIs to shared package
Create `packages/shared/src/abis/` with JSON ABI files:
- `F2KToken.json` (from T-REX compilation)
- `F2KNavAttestation.json`
- `F2KDistribution.json`
- `F2KSubscription.json`
- `USDC.json` (standard ERC-20 ABI)

Create `packages/shared/src/contracts.ts`:
```typescript
import { sepolia } from "viem/chains";
import deployments from "../../contracts/deployments.json";

export const CONTRACTS = {
  token: { address: deployments.sepolia.token as `0x${string}`, abi: ... },
  navAttestation: { address: deployments.sepolia.navAttestation as `0x${string}`, abi: ... },
  distribution: { address: deployments.sepolia.distribution as `0x${string}`, abi: ... },
  subscription: { address: deployments.sepolia.subscription as `0x${string}`, abi: ... },
  usdc: { address: "0x..." as `0x${string}`, abi: ... }, // Sepolia USDC
} as const;

export const CHAIN = sepolia;
```

## Integration Points

### 5.1 Subscription Flow (Investor Portal)

Update `/subscribe` page:

**Current (mock):** Creates DB record only.
**New (real):**
1. Investor enters USDC amount
2. Frontend calls `usdc.approve(subscriptionContract, amount)` via wagmi `useWriteContract`
3. Wait for approval tx confirmation
4. Frontend calls `subscription.subscribe(amount)` via wagmi `useWriteContract`
5. Wait for subscription tx confirmation
6. Store tx_hash in `subscriptions` table via API route
7. Show success with Etherscan link

Create `apps/investor-portal/src/components/SubscribeFlow.tsx`:
```typescript
// Step 1: Input amount
// Step 2: Approve USDC (useWriteContract + useWaitForTransactionReceipt)
// Step 3: Subscribe (useWriteContract + useWaitForTransactionReceipt)
// Step 4: Confirm — store tx_hash, update subscription status
// Handle: insufficient balance, approval failure, subscription failure
```

### 5.2 Token Balance (Investor Dashboard)

Update dashboard to read on-chain balance:
```typescript
// useReadContract to call token.balanceOf(walletAddress)
// Compare with Supabase balance — show on-chain as source of truth
// Display: X F2K-HT tokens
```

### 5.3 NAV On-Chain Publication (Admin Console)

Update NAV workflow — add "Publish On-Chain" step after approval:

1. Admin approves NAV in admin console (existing flow)
2. New button: "Publish to Blockchain"
3. This calls an API route that:
   - Constructs the `publishNav()` transaction
   - Sends it via the admin/publisher wallet (server-side with viem)
   - OR: generates a Safe transaction for multisig approval
4. Store `on_chain_tx_hash` in `nav_records` table
5. Investor portal reads current NAV from contract via `useReadContract`

For MVP: use a single publisher wallet (server-side). In production: Gnosis Safe multisig.

Create `apps/admin-console/src/app/api/nav/[id]/publish/route.ts`:
```typescript
// 1. Verify admin auth + role
// 2. Fetch nav_record from DB
// 3. Create wallet client with viem (using DEPLOYER_PRIVATE_KEY)
// 4. Call navAttestation.publishNav(navPerToken, totalNav, totalSupply)
// 5. Wait for tx confirmation
// 6. Update nav_records.on_chain_tx_hash and nav_records.published_at
// 7. Audit log entry
```

### 5.4 Distribution Execution (Admin Console)

Update distribution workflow — "Execute" triggers on-chain:

1. Admin creates and approves distribution (existing flow)
2. New "Execute On-Chain" button:
3. API route:
   - Fetch all `distribution_payments` for this distribution
   - Construct arrays: `recipients[]` and `amounts[]`
   - Approve USDC spend: `usdc.approve(distributionContract, totalAmount)`
   - Call `distribution.distribute(recipients, amounts)`
   - Store tx hashes in `distribution_payments` table
4. Update statuses to 'confirmed' on tx confirmation

Create `apps/admin-console/src/app/api/distributions/[id]/execute/route.ts`:
```typescript
// 1. Verify admin auth + role
// 2. Fetch distribution + payments from DB
// 3. Build recipients[] and amounts[] arrays
// 4. Create wallet client with viem
// 5. Approve USDC spend on distribution contract
// 6. Call distribute(recipients, amounts)
// 7. Wait for confirmation
// 8. Update all payment statuses + store tx hashes
// 9. Audit log
```

### 5.5 Allowlist → Identity Registry (Admin Console)

When admin approves a wallet on the allowlist:
1. Existing: update `allowlist` table status
2. New: register wallet in the T-REX IdentityRegistry on-chain
   - Create ONCHAINID identity for the wallet (or use simplified approach: just register in identity registry)
   - This enables the wallet to receive F2K-HT tokens (transfers will pass compliance check)
3. Store `on_chain_tx_hash` in allowlist record

Create `apps/admin-console/src/app/api/allowlist/[id]/route.ts` (update PATCH handler):
```typescript
// On approve:
// 1. Update DB status
// 2. Call identityRegistry.registerIdentity(walletAddress, identity, country)
// 3. Store tx hash
// 4. Audit log
```

### 5.6 Token Minting (Admin Console)

When admin confirms subscription and mints:
1. Existing: update subscription status in DB
2. New: call T-REX token `mint(investorWallet, amount)` as Token Agent
3. Call subscription contract `markProcessed(subId)`
4. Store mint tx hash

### 5.7 Event Indexing

Create `packages/shared/src/indexer.ts` — background process or API route:
```typescript
// Listen for contract events:
// - Token: Transfer events → update token_holdings in Supabase
// - NavAttestation: NavPublished → update nav_records
// - Distribution: PaymentSent → update distribution_payments
// - Subscription: SubscriptionReceived → update subscriptions
//
// For MVP: poll events on each page load or via API route
// For production: use Alchemy webhooks or Tenderly
```

## Packages to Add
```bash
# In apps/admin-console (for server-side blockchain calls)
pnpm add viem
```

## Acceptance Criteria
- [ ] Investor can subscribe with testnet USDC via portal → tokens appear in wallet
- [ ] Dashboard shows on-chain token balance
- [ ] NAV "Publish On-Chain" writes to contract, readable from portal
- [ ] Distribution "Execute" sends USDC to all holders, tx hashes stored
- [ ] Allowlist approve registers wallet in identity registry
- [ ] Unverified wallet cannot receive F2K-HT tokens (T-REX compliance blocks transfer)
- [ ] All on-chain tx hashes stored in Supabase and shown in admin console
- [ ] All on-chain actions have audit log entries
- [ ] Etherscan Sepolia links work for all tx hashes

## Verification
```bash
pnpm build            # both apps build
pnpm typecheck        # passes

# End-to-end manual test:
# 1. Register investor via portal
# 2. Approve KYC via admin console
# 3. Approve wallet on allowlist → verify identity registry updated
# 4. Investor subscribes with Sepolia USDC → verify USDC reaches treasury
# 5. Admin confirms + mints → verify F2K-HT in investor wallet
# 6. Admin publishes NAV → verify on-chain, visible in portal
# 7. Admin executes distribution → verify USDC in investor wallet
# 8. Check all audit logs present
```
