export default function PlatformPage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="bg-deep-blue text-off-white py-24 px-4">
        <div className="max-w-[900px] mx-auto text-center">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Under the Hood
          </p>
          <h1 className="font-playfair text-[clamp(2.4rem,6vw,4.5rem)] font-black leading-[1.05] mb-6">
            The F2K Platform
          </h1>
          <p className="font-archivo text-lg text-off-white/80 max-w-[700px] mx-auto leading-relaxed">
            Purpose-built infrastructure for tokenised fund management —
            on-chain compliance, AI-assisted operations, and transparent
            investor reporting from subscription to distribution.
          </p>
        </div>
      </section>

      {/* ===== ARCHITECTURE OVERVIEW ===== */}
      <section className="py-20 px-4 bg-off-white">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Architecture
          </p>
          <h2 className="font-playfair text-[2.4rem] font-black text-deep-blue leading-tight mb-6">
            Three Layers, One Platform
          </h2>
          <p className="text-lg text-slate leading-relaxed mb-10 font-archivo">
            The platform separates investor-facing, administrative, and
            blockchain layers — each independently secured, all working
            together.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Investor Portal",
                subtitle: "Public-facing",
                items: [
                  "Onboarding & KYC verification",
                  "Wallet connection (MetaMask, WalletConnect)",
                  "USDC subscription flow",
                  "Asset staking (property, bonds, cash, art)",
                  "Portfolio dashboard & statements",
                  "Distribution history",
                ],
              },
              {
                title: "Admin Console",
                subtitle: "Fund operations",
                items: [
                  "Live AUM dashboard & fundraise tracker",
                  "KYC review & allowlist management",
                  "Subscription confirmation & token minting",
                  "AI-assisted asset appraisal",
                  "NAV management (submit → approve → publish)",
                  "SPV & distribution management",
                ],
              },
              {
                title: "Smart Contracts",
                subtitle: "On-chain (Ethereum)",
                items: [
                  "ERC-3643 security token (F2K-HT)",
                  "On-chain identity registry & allowlist",
                  "NAV attestation contract",
                  "Subscription contract (USDC → tokens)",
                  "Distribution contract (USDC pro-rata)",
                  "Gnosis Safe multisig treasury (3-of-5)",
                ],
              },
            ].map((layer) => (
              <div
                key={layer.title}
                className="bg-white p-8 border border-black/5"
              >
                <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-ember mb-1">
                  {layer.subtitle}
                </p>
                <h3 className="font-archivo font-bold text-deep-blue text-lg mb-4">
                  {layer.title}
                </h3>
                <ul className="space-y-2">
                  {layer.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-slate font-archivo flex items-start gap-2"
                    >
                      <span className="text-ember mt-0.5 shrink-0">+</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INVESTOR JOURNEY ===== */}
      <section className="py-20 px-4 bg-warm-grey">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Investor Journey
          </p>
          <h2 className="font-playfair text-[2.4rem] font-black text-deep-blue leading-tight mb-10">
            From Registration to Distribution
          </h2>

          <div className="space-y-0">
            {[
              {
                step: "1",
                title: "Register & Verify Identity",
                desc: "Create an account, complete KYC verification via Sumsub (wholesale investor status confirmed), and connect your Ethereum wallet.",
                detail: "On-chain: wallet added to ERC-3643 identity registry",
              },
              {
                step: "2",
                title: "Subscribe with USDC or Stake Assets",
                desc: "Send USDC directly, or stake qualifying assets (property, bonds, cash, art). Asset stakes are independently appraised by the Contributions Committee with AI-assisted valuation.",
                detail: "Minimum: $10,000 USDC or equivalent asset value",
              },
              {
                step: "3",
                title: "Tokens Minted to Your Wallet",
                desc: "Once your subscription is confirmed (or asset stake approved + lien registered), F2K-HT tokens are minted directly to your verified wallet at the current NAV per token.",
                detail: "On-chain: ERC-3643 mint with compliance check",
              },
              {
                step: "4",
                title: "NAV Published Weekly",
                desc: "The fund's Net Asset Value is calculated weekly, approved by a second administrator, and published on-chain via the NAV attestation contract. Your token value updates accordingly.",
                detail: "On-chain: NAV attestation with dual-approval",
              },
              {
                step: "5",
                title: "Quarterly Distributions",
                desc: "As stabilised assets are sold, proceeds flow through the fund waterfall. USDC distributions are calculated pro-rata based on your token balance at snapshot and sent directly to your wallet.",
                detail: "On-chain: USDC distribution via smart contract",
              },
            ].map((item, i) => (
              <div key={item.step} className="flex gap-4 items-start">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-12 h-12 rounded-full bg-deep-blue text-brass font-playfair text-lg font-bold flex items-center justify-center">
                    {item.step}
                  </div>
                  {i < 4 && <div className="w-0.5 h-8 bg-black/10 mt-1" />}
                </div>
                <div className="pb-4">
                  <h3 className="font-archivo font-bold text-deep-blue mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate leading-relaxed font-archivo">
                    {item.desc}
                  </p>
                  <p className="text-xs text-ember font-ibm-mono mt-2">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== AI-POWERED OPERATIONS ===== */}
      <section className="py-20 px-4 bg-off-white">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            AI-Powered Operations
          </p>
          <h2 className="font-playfair text-[2.4rem] font-black text-deep-blue leading-tight mb-6">
            Machine Intelligence, Human Decisions
          </h2>
          <p className="text-lg text-slate leading-relaxed mb-10 font-archivo">
            The platform uses Claude AI to assist — never replace — the
            Contributions Committee in asset valuation. Every AI suggestion
            is advisory, audited, and requires human approval.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "AI Asset Appraisal",
                desc: "When an investor stakes a non-crypto asset, Claude analyses the asset class, declared value, description, and uploaded documents to suggest an appraised value, recommend an LTV ratio, and flag risks.",
                badge: "Advisory only",
              },
              {
                title: "AI Revaluation",
                desc: "For approved stakes, the AI periodically assesses whether current appraised values remain appropriate — factoring in time elapsed, market conditions, and document freshness.",
                badge: "Quarterly review",
              },
              {
                title: "Document Checklist",
                desc: "The AI cross-checks uploaded supporting documents against requirements for each asset class (bank statements, valuations, title searches, insurance certificates) and flags what's missing.",
                badge: "Automated",
              },
              {
                title: "Confidence Scoring",
                desc: "Every AI appraisal includes a confidence level (high/medium/low) based on document completeness, asset class complexity, and data quality — helping the committee prioritise reviews.",
                badge: "Transparent",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-white p-8 border border-black/5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-archivo font-bold text-deep-blue">
                    {card.title}
                  </h3>
                  <span className="text-[0.6rem] font-ibm-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                    {card.badge}
                  </span>
                </div>
                <p className="text-sm text-slate leading-relaxed font-archivo">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECURITY MODEL ===== */}
      <section className="py-20 px-4 bg-deep-blue text-off-white">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-brass mb-4">
            Security Model
          </p>
          <h2 className="font-playfair text-[2.4rem] font-black text-off-white leading-tight mb-10">
            Defence in Depth
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "On-Chain Compliance",
                items: [
                  "ERC-3643 enforces transfer restrictions at the token level",
                  "Only allowlisted wallets can hold or transfer F2K-HT",
                  "Identity registry links wallets to verified investors",
                  "Token transfers blocked if compliance checks fail",
                ],
              },
              {
                title: "Fund Controls",
                items: [
                  "Concentration limits: no asset class >40% of fund NAV",
                  "Single asset cap: no individual asset >5% of fund NAV",
                  "Minimum 25% in Tier 1-2 assets (cash + bonds)",
                  "Hard enforcement at token minting (no override)",
                ],
              },
              {
                title: "Access Security",
                items: [
                  "Role-based admin permissions (super_admin, fund_manager, compliance, read_only)",
                  "Row-Level Security on all database tables",
                  "Service role key for admin (bypasses RLS), anon key for investors (respects RLS)",
                  "Rate limiting on all API endpoints",
                ],
              },
              {
                title: "Operational Security",
                items: [
                  "Gnosis Safe 3-of-5 multisig for all treasury operations",
                  "Dual-approval for NAV publication (submitter != approver)",
                  "Complete audit trail of every admin action",
                  "CSP headers, X-Frame-Options, referrer policy enforced",
                ],
              },
            ].map((card) => (
              <div
                key={card.title}
                className="border border-off-white/10 p-6"
              >
                <h3 className="font-archivo font-bold text-brass uppercase tracking-wider text-sm mb-4">
                  {card.title}
                </h3>
                <ul className="space-y-2">
                  {card.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-off-white/70 font-archivo flex items-start gap-2"
                    >
                      <span className="text-brass mt-0.5 shrink-0">+</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TECH STACK ===== */}
      <section className="py-20 px-4 bg-off-white">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Technology Stack
          </p>
          <h2 className="font-playfair text-[2.4rem] font-black text-deep-blue leading-tight mb-10">
            Built for Institutional Grade
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { category: "Frontend", tech: "Next.js 14, TypeScript, Tailwind" },
              { category: "Backend", tech: "Supabase (Postgres, Auth, RLS, Realtime)" },
              { category: "Blockchain", tech: "Solidity, Hardhat, viem, wagmi" },
              { category: "Token Standard", tech: "ERC-3643 (T-REX) by Tokeny" },
              { category: "AI", tech: "Claude Sonnet (Anthropic)" },
              { category: "KYC", tech: "Sumsub" },
              { category: "Hosting", tech: "Vercel (Edge, Sydney region)" },
              { category: "Chain", tech: "Ethereum (Sepolia testnet → Mainnet)" },
            ].map((item) => (
              <div key={item.category} className="bg-white p-4 border border-black/5">
                <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-ember mb-1">
                  {item.category}
                </p>
                <p className="text-sm text-deep-blue font-archivo font-semibold">
                  {item.tech}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ADMIN WORKFLOW ===== */}
      <section className="py-20 px-4 bg-warm-grey">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Fund Administration
          </p>
          <h2 className="font-playfair text-[2.4rem] font-black text-deep-blue leading-tight mb-6">
            What the Admin Console Does
          </h2>
          <p className="text-lg text-slate leading-relaxed mb-10 font-archivo">
            The admin console gives fund managers complete operational
            control — from investor onboarding through to token minting
            and USDC distributions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Dashboard", desc: "Live AUM, token supply, NAV, pipeline metrics, $600M fundraise tracker" },
              { name: "Investors", desc: "Full investor register with KYC status, wallet, subscription history" },
              { name: "Allowlist", desc: "Approve/deny wallets for on-chain identity registry" },
              { name: "Subscriptions", desc: "Confirm USDC payments and mint tokens to investor wallets" },
              { name: "Asset Stakes", desc: "Review stakes with AI appraisal, approve, register liens, mint" },
              { name: "Token Balances", desc: "Per-investor holdings, % of supply, USD value at current NAV" },
              { name: "SPV Management", desc: "Create and manage project-level Special Purpose Vehicles" },
              { name: "NAV Management", desc: "Submit, dual-approve, and publish NAV on-chain weekly" },
              { name: "Distributions", desc: "Create quarterly USDC distributions, approve, execute on-chain" },
              { name: "Reports", desc: "Export CSV: investor register, holdings, distributions, audit trail" },
              { name: "Audit Log", desc: "Every admin action logged with actor, timestamp, and details" },
              { name: "Settings", desc: "Admin user management (add/edit/remove), fund parameters" },
            ].map((item) => (
              <div key={item.name} className="bg-off-white p-4 border border-black/5">
                <h4 className="font-archivo font-bold text-deep-blue text-sm mb-1">
                  {item.name}
                </h4>
                <p className="text-xs text-slate leading-relaxed font-archivo">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-ember text-white py-16 px-4 text-center">
        <div className="max-w-[600px] mx-auto">
          <h2 className="font-playfair text-[clamp(2rem,4vw,3rem)] font-black leading-tight mb-4">
            Built for Transparency.
            <br />
            Built for Scale.
          </h2>
          <p className="text-base text-white/85 leading-relaxed font-archivo mb-8">
            The platform is live on Ethereum Sepolia testnet. Smart contract
            audit and mainnet deployment are on the roadmap.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/invest"
              className="bg-white text-ember hover:bg-off-white px-8 py-3 font-archivo font-semibold transition-colors"
            >
              Apply to Invest
            </a>
            <a
              href="/documents"
              className="border-2 border-white text-white hover:bg-white hover:text-ember px-8 py-3 font-archivo font-semibold transition-colors"
            >
              Read the Whitepaper
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
