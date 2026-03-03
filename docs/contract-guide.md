# Contract Interaction Guide

## Deployed Contracts

Contract addresses are stored in `packages/contracts/deployments.json` and configured via environment variables.

| Contract | Env Variable | Purpose |
|----------|-------------|---------|
| F2KSubscription | `NEXT_PUBLIC_SUBSCRIPTION_ADDRESS` | USDC subscription intake |
| F2KNavAttestation | `NEXT_PUBLIC_NAV_ADDRESS` | On-chain NAV records |
| F2KDistribution | `NEXT_PUBLIC_DISTRIBUTION_ADDRESS` | USDC distributions |
| USDC | `NEXT_PUBLIC_USDC_ADDRESS` | Stablecoin (Sepolia testnet) |
| F2K-HT Token | `NEXT_PUBLIC_TOKEN_ADDRESS` | ERC-3643 security token |

## ABI Locations

All ABIs are in `packages/shared/src/abis/`:
- `F2KSubscription.ts`
- `F2KNavAttestation.ts`
- `F2KDistribution.ts`
- `ERC20.ts`

## Key Functions

### F2KSubscription

```solidity
// Investor calls (after USDC approve):
subscribe(uint256 amount)

// Admin calls:
markProcessed(uint256 subId)
setTreasury(address _treasury)
setMinSubscription(uint256 _min)

// View:
subscriptions(uint256) → (investor, amount, timestamp, processed)
subscriptionCount() → uint256
getInvestorSubscriptions(address) → uint256[]
```

### F2KNavAttestation

```solidity
// Publisher calls:
publishNav(uint256 navPerToken, uint256 totalNav, uint256 totalSupply)

// View:
currentNav() → (navPerToken, totalNav, totalSupply, timestamp, publisher)
getNavAt(uint256 index) → NavRecord
getNavHistory() → NavRecord[]
historyLength() → uint256
```

### F2KDistribution

```solidity
// Distributor calls (after USDC approve):
distribute(address[] recipients, uint256[] amounts)

// View:
distributionCount() → uint256
```

## Interacting via Etherscan

1. Go to `https://sepolia.etherscan.io/address/<contract_address>`
2. Click "Contract" → "Read Contract" for view functions
3. Click "Write Contract" → connect wallet → call functions

## Interacting via Gnosis Safe

1. Go to `https://app.safe.global`
2. Select the F2K Safe on Sepolia
3. New Transaction → Transaction Builder
4. Enter contract address and ABI
5. Select function and fill parameters
6. Submit → collect 3-of-5 signatures → execute

## Interacting via Code (viem)

```typescript
import { createPublicClient, createWalletClient, http } from "viem";
import { sepolia } from "viem/chains";
import { CONTRACTS } from "@f2k/shared/contracts";

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http("https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY"),
});

// Read current NAV
const nav = await publicClient.readContract({
  ...CONTRACTS.navAttestation,
  functionName: "currentNav",
});

// Write (requires wallet)
const walletClient = createWalletClient({ ... });
await walletClient.writeContract({
  ...CONTRACTS.subscription,
  functionName: "markProcessed",
  args: [0n],
});
```

## Deploying Contracts

```bash
cd packages/contracts

# Set DEPLOYER_PRIVATE_KEY in .env.local
# Optionally set USDC_ADDRESS for existing USDC

npx hardhat run scripts/deploy.ts --network sepolia
```

This will deploy all contracts and save addresses to `deployments.json`.
