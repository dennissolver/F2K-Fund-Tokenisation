# F2K Housing Token Platform

Tokenised Australian housing fund. Wholesale investors subscribe in USDC, receive ERC-3643 security tokens (F2K-HT) representing units in a regulated MIS.

## Stack

- **Frontend:** Next.js 14 (App Router, Server Components), TypeScript, Tailwind, shadcn/ui
- **Backend/DB:** Supabase (Postgres, Auth, RLS, Realtime)
- **Blockchain:** Solidity, Hardhat, ethers.js/viem, wagmi, RainbowKit
- **Token standard:** ERC-3643 (T-REX) — deployed from Tokeny's open-source contracts
- **Hosting:** Vercel
- **KYC:** Sumsub (sandbox for dev)
- **Chain:** Ethereum Sepolia testnet (dev), Ethereum mainnet (production)

## Structure

```
f2k-platform/
├── CLAUDE.md                    # This file
├── docs/                        # Architecture, specs, task files
│   ├── architecture.md          # System design + data flow
│   ├── database-schema.sql      # Supabase migration source of truth
│   └── tasks/                   # Per-module task specs (Claude Code reads these)
│       ├── 01-foundation.md
│       ├── 02-investor-portal.md
│       ├── 03-admin-console.md
│       ├── 04-smart-contracts.md
│       ├── 05-integration.md
│       └── 06-security-ops.md
├── apps/
│   ├── investor-portal/         # Next.js — investor-facing app
│   └── admin-console/           # Next.js — F2K ops team app
├── packages/
│   ├── contracts/               # Hardhat project — Solidity smart contracts
│   ├── shared/                  # Shared types, utils, contract ABIs
│   └── db/                      # Supabase client, types, migrations
└── turbo.json                   # Turborepo config
```

## Commands

```bash
# Install
pnpm install

# Dev (all apps)
pnpm dev

# Dev (single app)
pnpm --filter investor-portal dev
pnpm --filter admin-console dev

# Build
pnpm build

# Typecheck
pnpm typecheck

# Lint
pnpm lint

# Smart contracts
cd packages/contracts
npx hardhat compile
npx hardhat test
npx hardhat test --grep "distribution"    # run specific tests

# Database
pnpm --filter db generate                  # generate types from Supabase
pnpm --filter db push                      # push migrations
```

## Rules

- IMPORTANT: Always read the relevant task file in `docs/tasks/` before starting work on a module
- TypeScript strict mode everywhere. No `any` types.
- Use `viem` for blockchain interaction in the apps, `ethers.js` only in Hardhat scripts
- All Supabase tables MUST have RLS policies. No exceptions.
- Every admin action creates an audit log entry
- Smart contracts: every public function has a corresponding Hardhat test
- Use pnpm, not npm or yarn
- Prefer server components. Use `"use client"` only when hooks/interactivity needed.
- All environment variables in `.env.local` (gitignored). Use `.env.example` as template.

## Task Workflow

Each module has a task file in `docs/tasks/`. These contain:
1. Exact files to create with expected structure
2. Database tables/columns needed
3. Acceptance criteria (what "done" looks like)
4. Verification commands to run

**Work through modules in order (01→06). Each depends on the previous.**

## Key Domain Context

- F2K-HT = the token. ERC-3643 permissioned security token.
- NAV = Net Asset Value per token. Published weekly.
- Distributions = quarterly USDC payments to all token holders pro-rata.
- Wholesale investor = Australian s708 exemption (net assets >$2.5M or income >$250K).
- Multisig = Gnosis Safe 3-of-5 for trustee admin actions.
- Allowlist = only verified wallets can hold/transfer tokens (enforced on-chain by ERC-3643).
