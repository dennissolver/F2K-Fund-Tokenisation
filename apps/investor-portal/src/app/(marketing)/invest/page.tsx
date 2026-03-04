import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invest — F2K Housing Token | Factory to Key",
  description:
    "Learn how to invest in the F2K Housing Token. Eligibility, process, returns, and fund structure explained for wholesale investors.",
};

export default function InvestPage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="bg-deep-blue text-off-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_80%,rgba(184,66,15,0.1)_0%,transparent_50%)]" />
        <div className="relative z-10 max-w-[900px] mx-auto text-center">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-brass mb-6">
            Investment Overview
          </p>
          <h1 className="font-playfair text-[clamp(2.5rem,6vw,4.5rem)] font-black leading-[1] mb-6">
            Invest in Australia&apos;s
            <br />
            <em className="text-brass">Housing Future</em>
          </h1>
          <p className="font-archivo text-lg text-off-white/70 max-w-[600px] mx-auto leading-relaxed">
            The F2K Housing Token is a regulated security token backed by real
            Australian residential property — with returns driven by integration
            fees, leveraged development profits, and long-term government
            leases. Here&apos;s everything you need to know before you apply.
          </p>
        </div>
      </section>

      {/* ===== WHO CAN INVEST ===== */}
      <section className="py-20 px-4 bg-off-white">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Eligibility
          </p>
          <h2 className="font-playfair text-[2.4rem] font-black text-deep-blue leading-tight mb-6">
            Who Can Invest?
          </h2>
          <p className="text-lg text-slate leading-relaxed mb-8 font-archivo">
            F2K Housing Token is available exclusively to{" "}
            <strong className="text-[#0B0B0B]">wholesale investors</strong>{" "}
            under Section 708 of the Corporations Act 2001 (Cth). This is a
            legal requirement — not a preference.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 border border-black/5 relative">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-ember" />
              <h3 className="font-archivo font-bold text-deep-blue mb-3 mt-2">
                Net Assets Test
              </h3>
              <p className="text-3xl font-playfair font-bold text-ember mb-2">
                $2.5M+
              </p>
              <p className="text-sm text-slate leading-relaxed font-archivo">
                You (or the entity you control) hold net assets of at least{" "}
                <strong>$2.5 million</strong>. This includes property, shares,
                superannuation, and other assets minus liabilities.
              </p>
              <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-brass mt-4">
                Wholesale Investor
              </p>
            </div>

            <div className="bg-white p-6 border border-black/5 relative">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-brass" />
              <h3 className="font-archivo font-bold text-deep-blue mb-3 mt-2">
                Income Test
              </h3>
              <p className="text-3xl font-playfair font-bold text-brass mb-2">
                $250K+/yr
              </p>
              <p className="text-sm text-slate leading-relaxed font-archivo">
                Your gross income has been at least{" "}
                <strong>$250,000 per year</strong> for each of the last two
                financial years.
              </p>
              <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-brass mt-4">
                Sophisticated Investor
              </p>
            </div>

            <div className="bg-white p-6 border border-black/5 relative">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-deep-blue" />
              <h3 className="font-archivo font-bold text-deep-blue mb-3 mt-2">
                Entity Test
              </h3>
              <p className="text-3xl font-playfair font-bold text-deep-blue mb-2">
                Company / Trust
              </p>
              <p className="text-sm text-slate leading-relaxed font-archivo">
                You are investing through a company, trust, or SMSF that meets
                the net assets or income thresholds above.
              </p>
              <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-brass mt-4">
                Wholesale Investor
              </p>
            </div>
          </div>

          <blockquote className="border-l-4 border-ember pl-8 py-4">
            <p className="font-playfair text-lg italic text-deep-blue leading-relaxed">
              You must meet at least one of these criteria. You will
              self-certify during registration and provide supporting
              documentation during KYC verification.
            </p>
          </blockquote>
        </div>
      </section>

      {/* ===== WHAT YOU GET ===== */}
      <section className="py-20 px-4 bg-warm-grey">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            The Token
          </p>
          <h2 className="font-playfair text-[2.4rem] font-black text-deep-blue leading-tight mb-6">
            What You Get
          </h2>

          <div className="bg-off-white p-8 md:p-10 border border-black/5 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <p className="text-2xl font-playfair font-bold text-ember">
                  F2K-HT
                </p>
                <p className="text-xs text-slate font-ibm-mono tracking-wider uppercase mt-1">
                  Token Symbol
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-playfair font-bold text-ember">
                  ERC-3643
                </p>
                <p className="text-xs text-slate font-ibm-mono tracking-wider uppercase mt-1">
                  Token Standard
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-playfair font-bold text-ember">
                  8-12%
                </p>
                <p className="text-xs text-slate font-ibm-mono tracking-wider uppercase mt-1">
                  Target Yield
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-playfair font-bold text-ember">
                  Quarterly
                </p>
                <p className="text-xs text-slate font-ibm-mono tracking-wider uppercase mt-1">
                  Distributions
                </p>
              </div>
            </div>

            <p className="text-slate leading-relaxed font-archivo mb-4">
              Each F2K Housing Token represents a unit in a{" "}
              <strong className="text-[#0B0B0B]">
                Managed Investment Scheme
              </strong>{" "}
              backed by Australian residential property. Tokens are issued on
              Ethereum using the{" "}
              <strong className="text-[#0B0B0B]">
                ERC-3643 (T-REX) standard
              </strong>{" "}
              — the institutional-grade permissioned token with on-chain identity
              verification and transfer restrictions. Only KYC-verified,
              allowlisted wallets can hold or transfer tokens.
            </p>
            <p className="text-slate leading-relaxed font-archivo">
              The 8-12% target yield is generated from three sources: a 12% of
              GDV integration fee earned on every project F2K delivers,
              development profit on completed housing, and rental income from
              properties held under long-term government leases. Because each
              project uses construction finance (60-70% senior debt), every $1
              of investor equity funds $2.50-$3.00 of housing — amplifying the
              revenue base without recourse to the wider fund.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-off-white p-6 border border-black/5">
              <h3 className="font-archivo font-bold text-deep-blue mb-2">
                NAV-Linked Pricing
              </h3>
              <p className="text-sm text-slate leading-relaxed font-archivo">
                Token price is directly linked to the fund&apos;s Net Asset
                Value, calculated weekly from independently appraised real
                assets. Transparent methodology, no hidden markups.
              </p>
            </div>
            <div className="bg-off-white p-6 border border-black/5">
              <h3 className="font-archivo font-bold text-deep-blue mb-2">
                Quarterly USDC Distributions
              </h3>
              <p className="text-sm text-slate leading-relaxed font-archivo">
                Fund income flows back to token holders as USDC distributions
                every quarter, calculated pro-rata from your token holdings.
                Paid directly to your connected wallet.
              </p>
            </div>
            <div className="bg-off-white p-6 border border-black/5">
              <h3 className="font-archivo font-bold text-deep-blue mb-2">
                Real Asset Backing
              </h3>
              <p className="text-sm text-slate leading-relaxed font-archivo">
                Every token is backed by tangible assets in the fund — primarily
                Australian residential property, with diversification across
                bonds and other asset classes per concentration limits.
              </p>
            </div>
            <div className="bg-off-white p-6 border border-black/5">
              <h3 className="font-archivo font-bold text-deep-blue mb-2">
                On-Chain Compliance
              </h3>
              <p className="text-sm text-slate leading-relaxed font-archivo">
                Identity verification enforced at the smart contract level. Only
                allowlisted wallets can hold tokens. Gnosis Safe 3-of-5 multisig
                treasury. Quarterly audited accounts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FUND ECONOMICS ===== */}
      <section className="py-20 px-4 bg-off-white">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Fund Economics
          </p>
          <h2 className="font-playfair text-[2.4rem] font-black text-deep-blue leading-tight mb-8">
            Fees & Parameters
          </h2>

          <div className="bg-white border border-black/5 overflow-hidden">
            <table className="w-full">
              <tbody className="divide-y divide-black/5">
                <tr>
                  <td className="px-6 py-4 font-archivo font-semibold text-deep-blue">
                    Minimum Investment
                  </td>
                  <td className="px-6 py-4 text-right font-ibm-mono text-ember font-semibold">
                    $10,000 USDC
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-archivo font-semibold text-deep-blue">
                    Preferred Return
                  </td>
                  <td className="px-6 py-4 text-right font-ibm-mono text-ember font-semibold">
                    8% p.a.
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-archivo font-semibold text-deep-blue">
                    Management Fee
                  </td>
                  <td className="px-6 py-4 text-right font-ibm-mono text-slate">
                    1.5% p.a.
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-archivo font-semibold text-deep-blue">
                    Performance Fee
                  </td>
                  <td className="px-6 py-4 text-right font-ibm-mono text-slate">
                    20% above hurdle
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-archivo font-semibold text-deep-blue">
                    NAV Calculation
                  </td>
                  <td className="px-6 py-4 text-right font-ibm-mono text-slate">
                    Weekly
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-archivo font-semibold text-deep-blue">
                    Distributions
                  </td>
                  <td className="px-6 py-4 text-right font-ibm-mono text-slate">
                    Quarterly (USDC)
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-archivo font-semibold text-deep-blue">
                    Target Fund Size
                  </td>
                  <td className="px-6 py-4 text-right font-ibm-mono text-slate">
                    $600M
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-slate mt-6 font-archivo leading-relaxed mb-10">
            All fees are deducted from fund income before distributions.
            Performance fee applies only to returns above the 8% hurdle rate.
            Full fee structure detailed in the{" "}
            <a
              href="/whitepaper"
              className="text-ember hover:underline font-semibold"
            >
              Whitepaper
            </a>
            .
          </p>

          {/* Leverage Multiplier */}
          <div className="bg-warm-grey border-l-4 border-ember p-8 mb-10">
            <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-3">
              Leverage Multiplier
            </p>
            <p className="font-playfair text-[3rem] font-black text-deep-blue leading-none mb-1">
              $2.50–$3.00
            </p>
            <p className="font-archivo text-slate mb-6">
              of housing built per $1 of investor equity
            </p>
            <div className="bg-off-white p-6 border border-black/5">
              <p className="font-archivo font-semibold text-deep-blue mb-3">
                Worked Example
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-archivo text-sm text-slate">
                <div>
                  <p className="text-xs font-ibm-mono tracking-wider uppercase text-slate/60 mb-1">
                    Project Value
                  </p>
                  <p className="font-semibold text-deep-blue">$10,000,000</p>
                </div>
                <div>
                  <p className="text-xs font-ibm-mono tracking-wider uppercase text-slate/60 mb-1">
                    Fund Equity (35%)
                  </p>
                  <p className="font-semibold text-deep-blue">$3,500,000</p>
                </div>
                <div>
                  <p className="text-xs font-ibm-mono tracking-wider uppercase text-slate/60 mb-1">
                    Senior Debt (65%)
                  </p>
                  <p className="font-semibold text-deep-blue">$6,500,000</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-black/5">
                <p className="font-archivo text-sm text-slate">
                  <strong className="text-deep-blue">Integration fee (12% GDV):</strong>{" "}
                  $1,200,000 earned by fund on $3.5M equity deployed
                </p>
              </div>
            </div>
            <p className="text-xs text-slate/60 font-archivo mt-4 italic">
              Illustrative only. Not a forecast. Actual leverage ratios vary by
              project and lender.
            </p>
          </div>

          {/* Revenue Waterfall */}
          <div className="mb-10">
            <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
              Revenue Waterfall
            </p>
            <h3 className="font-playfair text-xl font-bold text-deep-blue mb-6">
              How Project Revenue Flows to You
            </h3>
            <div className="space-y-0">
              {[
                {
                  level: "1",
                  label: "Gross Project Revenue",
                  detail: "Sale proceeds or lease income from completed housing",
                  bg: "bg-deep-blue",
                  text: "text-off-white",
                },
                {
                  level: "2",
                  label: "Repay Senior Construction Debt",
                  detail: "Priority repayment to construction lender",
                  bg: "bg-deep-blue/80",
                  text: "text-off-white",
                },
                {
                  level: "3",
                  label: "Integration Fee Income",
                  detail: "12% of GDV earned by F2K as project integrator",
                  bg: "bg-ember",
                  text: "text-white",
                },
                {
                  level: "4",
                  label: "Fund Income Pool",
                  detail:
                    "Management fee (1.5%) → Preferred return (8%) → Performance fee (20% above hurdle)",
                  bg: "bg-brass/20",
                  text: "text-deep-blue",
                },
                {
                  level: "5",
                  label: "Quarterly Distribution to Token Holders",
                  detail: "Pro-rata USDC to your connected wallet",
                  bg: "bg-off-white",
                  text: "text-deep-blue",
                },
              ].map((step, i) => (
                <div key={step.level} className="flex items-stretch">
                  <div className="flex flex-col items-center shrink-0 mr-4">
                    <div className="w-10 h-10 rounded-full bg-deep-blue text-brass font-playfair text-sm font-bold flex items-center justify-center">
                      {step.level}
                    </div>
                    {i < 4 && <div className="w-0.5 flex-1 bg-warm-grey" />}
                  </div>
                  <div
                    className={`${step.bg} ${step.text} p-4 mb-2 flex-1 border border-black/5`}
                  >
                    <p className="font-archivo font-semibold text-sm">
                      {step.label}
                    </p>
                    <p className="text-xs opacity-80 font-archivo mt-1">
                      {step.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sell vs Hold */}
          <blockquote className="border-l-4 border-ember pl-8 py-4">
            <p className="font-playfair text-lg italic text-deep-blue leading-relaxed">
              Completed developments are either sold en-bloc to institutional
              buyers or held under long-term government leases — providing the
              fund with a blend of capital gains and recurring rental income.
            </p>
          </blockquote>
        </div>
      </section>

      {/* ===== TWO PATHS TO INVEST ===== */}
      <section className="py-20 px-4 bg-warm-grey">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Investment Methods
          </p>
          <h2 className="font-playfair text-[2.4rem] font-black text-deep-blue leading-tight mb-8">
            Two Ways to Participate
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-off-white p-8 border border-black/5 relative">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-ember" />
              <span className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-ember block mb-3 mt-1">
                Path A
              </span>
              <h3 className="font-playfair text-2xl font-bold text-deep-blue mb-4">
                Subscribe with USDC
              </h3>
              <p className="text-sm text-slate leading-relaxed font-archivo mb-6">
                Send USDC from your verified wallet directly to the fund
                treasury. Tokens are minted at the current NAV per token after
                admin confirmation. Simple, fast, fully on-chain.
              </p>
              <ol className="space-y-3 font-archivo text-sm text-slate">
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-deep-blue text-brass text-xs font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span>Enter USDC amount (min $10,000)</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-deep-blue text-brass text-xs font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span>Approve USDC spending to the subscription contract</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-deep-blue text-brass text-xs font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span>Confirm subscription transaction</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-deep-blue text-brass text-xs font-bold flex items-center justify-center shrink-0">
                    4
                  </span>
                  <span>
                    F2K-HT tokens minted to your wallet after verification
                  </span>
                </li>
              </ol>
            </div>

            <div className="bg-off-white p-8 border border-black/5 relative">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-brass" />
              <span className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-brass block mb-3 mt-1">
                Path B
              </span>
              <h3 className="font-playfair text-2xl font-bold text-deep-blue mb-4">
                Stake Real Assets
              </h3>
              <p className="text-sm text-slate leading-relaxed font-archivo mb-6">
                Contribute qualifying assets — property, bonds, art, or cash —
                to the fund. Each asset is independently appraised and tokens are
                minted based on the collateral value at current NAV.
              </p>
              <ol className="space-y-3 font-archivo text-sm text-slate">
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-deep-blue text-brass text-xs font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span>Select asset class and declare value</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-deep-blue text-brass text-xs font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span>Upload supporting documents and appraisals</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-deep-blue text-brass text-xs font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span>F2K team reviews, appraises, and registers lien</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-deep-blue text-brass text-xs font-bold flex items-center justify-center shrink-0">
                    4
                  </span>
                  <span>
                    F2K-HT tokens minted based on LTV ratio and appraised value
                  </span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ===== THE PROCESS ===== */}
      <section className="py-20 px-4 bg-off-white">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Your Journey
          </p>
          <h2 className="font-playfair text-[2.4rem] font-black text-deep-blue leading-tight mb-10">
            From Application to Tokens
          </h2>

          <div className="space-y-0">
            {[
              {
                step: "01",
                title: "Create Account",
                desc: "Register with your email. You'll self-certify your wholesale investor status as part of signup.",
                time: "2 minutes",
              },
              {
                step: "02",
                title: "Verify Eligibility",
                desc: "Confirm your s708 qualification — net assets of $2.5M+ or income of $250K+/yr. Provide your full legal name and entity details if investing through a company or trust.",
                time: "5 minutes",
              },
              {
                step: "03",
                title: "Complete KYC",
                desc: "Identity verification through our KYC provider (Sumsub). Upload government-issued ID and proof of address. Verified within 24 hours.",
                time: "10 minutes",
              },
              {
                step: "04",
                title: "Connect Wallet",
                desc: "Connect your Ethereum wallet (MetaMask, WalletConnect, etc.) and sign a message to verify ownership. This wallet will be allowlisted to hold F2K-HT tokens.",
                time: "2 minutes",
              },
              {
                step: "05",
                title: "Invest",
                desc: "Choose your path — subscribe with USDC or stake real assets. Your tokens are minted after admin verification and sent directly to your connected wallet.",
                time: "Varies",
              },
            ].map((item, i) => (
              <div key={item.step} className="flex gap-6 items-start">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-12 h-12 rounded-full bg-deep-blue text-brass font-playfair text-lg font-bold flex items-center justify-center">
                    {item.step}
                  </div>
                  {i < 4 && (
                    <div className="w-0.5 h-12 bg-warm-grey mt-1" />
                  )}
                </div>
                <div className="pb-6">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-archivo font-bold text-deep-blue">
                      {item.title}
                    </h3>
                    <span className="font-ibm-mono text-[0.6rem] tracking-wider text-slate/60">
                      ~{item.time}
                    </span>
                  </div>
                  <p className="text-sm text-slate leading-relaxed font-archivo">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECURITY ===== */}
      <section className="bg-deep-blue text-off-white py-16 px-4">
        <div className="max-w-[900px] mx-auto">
          <h2 className="font-playfair text-2xl font-bold mb-6 text-center">
            Security & Safeguards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 font-archivo text-sm">
            {[
              {
                label: "Token Standard",
                value: "ERC-3643 (T-REX)",
              },
              {
                label: "Treasury",
                value: "Gnosis Safe 3-of-5 Multisig",
              },
              {
                label: "KYC/AML",
                value: "Sumsub Verification",
              },
              {
                label: "Audit",
                value: "Quarterly Audited Accounts",
              },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-brass font-ibm-mono text-xs uppercase tracking-wider mb-1">
                  {item.label}
                </p>
                <p className="text-off-white/80">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="bg-ember text-white py-20 px-4 text-center">
        <div className="max-w-[600px] mx-auto">
          <h2 className="font-playfair text-[clamp(2rem,4vw,3rem)] font-black leading-tight mb-4">
            Ready to Apply?
          </h2>
          <p className="text-lg text-white/85 leading-relaxed font-archivo mb-8">
            Registration takes less than 20 minutes. You&apos;ll need to confirm
            your wholesale investor status, complete identity verification, and
            connect an Ethereum wallet.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/register"
              className="bg-white text-ember hover:bg-off-white px-8 py-3 font-archivo font-semibold transition-colors"
            >
              Create Account
            </a>
            <a
              href="/whitepaper"
              className="border-2 border-white text-white hover:bg-white hover:text-ember px-8 py-3 font-archivo font-semibold transition-colors"
            >
              Read the Whitepaper
            </a>
          </div>
          <p className="text-white/50 text-xs font-ibm-mono tracking-wider mt-6">
            Wholesale investors only (s708 Corporations Act) &middot; Min
            $10,000 USDC
          </p>
        </div>
      </section>
    </>
  );
}
