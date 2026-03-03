# F2K Housing Token Platform

Tokenised Australian housing fund built on Ethereum. Wholesale investors (s708 exemption) subscribe in USDC and receive ERC-3643 security tokens (F2K-HT) representing units in a regulated Managed Investment Scheme. The platform handles the full lifecycle: investor onboarding with KYC, USDC subscription and token minting, weekly NAV publication, and quarterly USDC distributions.

Built as a monorepo with two Next.js apps (investor portal + admin console), Solidity smart contracts, and Supabase for data/auth. All admin operations go through a Gnosis Safe 3-of-5 multisig. Currently deployed on Ethereum Sepolia testnet.

## Quick Start

### Prerequisites
- Node.js 20+
- pnpm 10+
- Git

### Setup

```bash
# Clone and install
git clone https://github.com/dennissolver/F2K-Fund-Tokenisation.git
cd F2K-Fund-Tokenisation
pnpm install

# Configure environment
cp .env.example .env.local
# Fill in Supabase keys, Alchemy API key, WalletConnect project ID

# Run development servers
pnpm dev
# Investor Portal: http://localhost:3000
# Admin Console:   http://localhost:3001

# Build
pnpm build

# Run smart contract tests
cd packages/contracts
npx hardhat test
```

## Project Structure

```
├── apps/
│   ├── investor-portal/    # Investor-facing Next.js app
│   └── admin-console/      # Fund operations Next.js app
├── packages/
│   ├── contracts/           # Hardhat — Solidity smart contracts
│   ├── shared/              # Types, ABIs, contract config, validation
│   └── db/                  # Supabase client factories, migrations
├── docs/
│   ├── architecture.md      # System design + data flows
│   ├── contract-guide.md    # Contract interaction reference
│   ├── monitoring.md        # Monitoring & alerts setup
│   └── runbooks/            # Operational procedures
└── turbo.json               # Turborepo config
```

## Documentation

- [Architecture](docs/architecture.md) — system diagram, data flows, security model
- [Contract Guide](docs/contract-guide.md) — addresses, ABIs, key functions, examples
- [Monitoring](docs/monitoring.md) — Vercel, Supabase, blockchain alerting
- **Runbooks**: [NAV Publication](docs/runbooks/weekly-nav-publication.md) | [Distribution](docs/runbooks/quarterly-distribution.md) | [Onboarding](docs/runbooks/investor-onboarding.md) | [Emergency Pause](docs/runbooks/emergency-token-pause.md) | [Wallet Freeze](docs/runbooks/emergency-wallet-freeze.md) | [Failed Tx Recovery](docs/runbooks/failed-transaction-recovery.md)

## Smart Contracts

| Contract | Description |
|----------|-------------|
| F2KSubscription | Accepts USDC subscriptions, forwards to treasury |
| F2KNavAttestation | On-chain NAV records with history |
| F2KDistribution | Pro-rata USDC distribution to token holders |
| MockUSDC | Test ERC-20 token (6 decimals) |

32 tests passing across all contracts.

## Tech Stack

Next.js 14 | TypeScript | Tailwind CSS | Supabase | Solidity | Hardhat | wagmi | viem | RainbowKit | Turborepo | Vercel
