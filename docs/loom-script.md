# F2K Housing Token - Loom Video Script

**Estimated duration:** 8-10 minutes
**Audience:** Potential investors, partners, and stakeholders
**Tone:** Professional but approachable. Confident, not salesy.

---

## PART 1: What is F2K Housing Token? (0:00 - 4:00)

### Opening (0:00 - 0:30)

> "Hey everyone, I'm Dennis — and today I want to walk you through F2K Housing Token: what it is, how the fund works, and then I'll give you a live tour of our admin dashboard so you can see the operational infrastructure behind it."

### The Problem (0:30 - 1:15)

> "Australia has a housing shortage of over 150,000 homes. Traditional construction is slow, expensive, and labour-intensive. Modular and manufactured housing can deliver homes 30-50% faster and 20-30% cheaper — but manufacturers need capital to scale their production facilities, equipment, and working capital."
>
> "At the same time, investors looking for exposure to Australian housing have limited options — direct property ownership, REITs, or mortgage-backed securities. None of these directly finance the manufacturing supply chain where the real productivity gains are happening."

### The Solution (1:15 - 2:15)

> "F2K Housing Token bridges that gap. We're a tokenised Australian housing fund — a regulated Managed Investment Scheme — that accepts USDC subscriptions from wholesale investors and issues ERC-3643 security tokens called F2K-HT."
>
> "Each token represents a pro-rata unit in the fund's net asset value. Think of it like a traditional managed fund, but with blockchain infrastructure powering the operations — on-chain NAV publication, automated distributions, and a permissioned security token that enforces compliance at the smart contract level."
>
> "The fund deploys capital into modular housing manufacturers, construction financing, and asset-backed lending — aligned with government housing programs across Western Australia, New South Wales, and the Northern Territory."

### How Returns Work (2:15 - 3:00)

> "Returns are generated through interest on manufacturer loans, margin on asset valuations, equity upside from successful partnerships, and government-backed contract flows. We target 8-12% annual returns."
>
> "NAV is published weekly — on-chain, fully transparent. Distributions go out quarterly as USDC directly to investor wallets, pro-rata based on token holdings. No intermediary banks, no settlement delays."

### The Investor Journey (3:00 - 4:00)

> "For investors, the process is straightforward. You register on our portal, complete a wholesale investor eligibility check, go through KYC via Sumsub, connect your Ethereum wallet, and once approved, you can subscribe with USDC."
>
> "Behind the scenes, our compliance team reviews your KYC, adds your wallet to the on-chain allowlist — which is enforced by the ERC-3643 standard — and once your subscription is confirmed, we mint F2K-HT tokens directly to your wallet."
>
> "Only verified wallets can hold or transfer these tokens. That's not just a policy — it's enforced at the smart contract level. No unaccredited buyer can ever acquire them."

---

## PART 2: Admin Dashboard Walkthrough (4:00 - 9:00)

### Transition (4:00 - 4:15)

> "Now let me show you the operational side — our admin console. This is what the fund management team uses day-to-day to run the fund."

### Dashboard Overview (4:15 - 5:00)

**[Screen: Admin Console Dashboard]**

> "This is the main dashboard. At the top you can see our key metrics — total AUM, qualified asset stakes value, the latest published NAV per token, and active investor count."
>
> "Below that we have operational alerts — pending KYC applications, pending subscriptions awaiting confirmation, stakes under review, and allowlist entries waiting for approval. Everything the team needs at a glance to know what requires action today."
>
> "And down here, the recent audit log entries — every admin action is logged with a timestamp, the actor, and exactly what was done. Full compliance trail."

### Investor Management (5:00 - 5:45)

**[Screen: Investors page]**

> "The Investors page shows every registered investor — their name, email, wallet address, KYC status, and investor type. You can click into any investor to see their full profile, KYC history, and holdings."

**[Screen: Registrations page]**

> "We also have a Registrations of Interest page where we track inbound leads — lenders, government entities, offtakers — and filter them by type and status. This feeds our pipeline."

### Subscription & Token Minting Flow (5:45 - 6:30)

**[Screen: Subscriptions page]**

> "This is where the magic happens. When an investor subscribes with USDC, it shows up here as a pending subscription. You can see the USDC amount, the calculated token price, and how many tokens will be minted."
>
> "The workflow is two-step: first, we confirm that the USDC has been received in our treasury. Then we mint the tokens. Each step is a separate action with a separate button — dual control built in."
>
> "Pending subscriptions are highlighted in yellow so nothing gets missed."

### Allowlist Management (6:30 - 7:00)

**[Screen: Allowlist page]**

> "Before any tokens can be minted, the investor's wallet must be on our allowlist. This page shows all wallet entries with their status — pending, approved, denied, or revoked."
>
> "When we approve a wallet here, it gets registered on-chain in the ERC-3643 Identity Registry. That's what allows the smart contract to enforce transfer restrictions — only allowlisted wallets can hold F2K-HT tokens."

### NAV Management (7:00 - 7:30)

**[Screen: NAV Management page]**

> "Every week, we publish the fund's Net Asset Value. The form takes three inputs — NAV per token, total NAV, and total supply. Once submitted, it goes into draft status."
>
> "A second admin must approve it — dual control again — and then it gets published on-chain via our NAV Attestation smart contract. The full history is visible here with timestamps and on-chain transaction hashes."

### Distributions (7:30 - 7:50)

**[Screen: Distributions page]**

> "Quarterly distributions are managed here. The system calculates pro-rata shares based on each investor's token holdings. A separate admin reviews and approves, and then we execute on-chain — USDC goes directly to every investor's wallet in a single transaction."

### Asset Stakes & SPVs (7:50 - 8:20)

**[Screen: Asset Stakes page, then SPVs page]**

> "Asset Stakes is where manufacturers and investors submit collateral — property, equipment, or other assets — for valuation and tokenisation. Each stake goes through review, appraisal, lien registration, and finally token minting. The status pipeline is fully tracked."
>
> "We also manage SPVs — Special Purpose Vehicles — which are the legal holding entities for fund assets. You can create, edit, and track each SPV's target allocation and current NAV."

### Asset Classes & Concentration Risk (8:20 - 8:45)

**[Screen: Asset Classes page]**

> "This page is critical for risk management. We configure each asset class — residential property, commercial, equipment, BTC — with its own LTV ratio, minimum value, and appraisal requirements."
>
> "Below that is the concentration risk dashboard, showing value distribution across asset classes and flagging any breaches — for example, if any single class exceeds 40% of the portfolio, or if a single asset exceeds 5%."

### Reports, Audit Log & Settings (8:45 - 9:15)

**[Screen: Quick flash of Reports, Audit Log, Settings pages]**

> "Rounding it out — the Reports page lets you download CSV exports for compliance: investor register, holdings snapshot, distribution reports, and full audit trail."
>
> "The Audit Log is a read-only view of every action taken in the system — immutable, timestamped, with the actor and full details."
>
> "And Settings is where we manage admin users and their roles — super admin, fund manager, compliance officer, or read-only access."

---

## PART 3: Closing (9:15 - 9:45)

> "So that's F2K Housing Token — a regulated, tokenised housing fund with institutional-grade operational infrastructure. Every action is auditable, every token transfer is compliant, and every NAV publication is verified on-chain."
>
> "We're currently on Ethereum Sepolia testnet with 32 passing smart contract tests and full RLS security policies across the database. Next steps are the smart contract audit, mainnet deployment, and our Tranche 1 seed raise."
>
> "If you're interested in learning more — whether as an investor, a manufacturer partner, or a government stakeholder — reach out. Thanks for watching."

---

## Production Notes

- **Screen recordings needed:** Admin console dashboard, each page mentioned above (pre-populated with realistic demo data)
- **Suggested setup:** Split between talking-head (Part 1) and screen share (Part 2), with picture-in-picture during the dashboard walkthrough
- **Demo data:** Ensure the Sepolia testnet has sample investors, subscriptions, NAV records, and at least one distribution so the pages look populated
- **Pace:** Don't rush the subscription/minting flow — that's the core "aha moment" for investors
- **Key message to land:** This isn't a whitepaper concept — it's a working platform with real smart contracts, real compliance infrastructure, and a clear path to mainnet
