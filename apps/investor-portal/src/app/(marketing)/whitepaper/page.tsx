import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "F2K Housing Token Whitepaper — Factory to Key",
  description:
    "Complete technical and financial specification of the F2K Housing Token, fund structure, and tokenisation mechanics.",
};

export default function WhitepaperPage() {
  return (
    <div className="py-20 px-4 bg-off-white">
      <div className="max-w-[900px] mx-auto">
        <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
          Whitepaper
        </p>
        <h1 className="font-playfair text-[2.8rem] font-black text-deep-blue leading-tight mb-6">
          F2K Housing Token Whitepaper
        </h1>
        <p className="text-lg text-slate leading-relaxed mb-10 font-archivo max-w-[700px]">
          The F2K Housing Token is a regulated ERC-3643 security token
          representing units in a Managed Investment Scheme. The fund finances
          the design and construction of government and workforce housing,
          delivers tenanted assets under long-term leases, then sells each
          stabilised, income-producing entity to a REIT or institutional
          investor — recycling capital into the next project.
        </p>

        {/* Key sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {[
            {
              title: "Fund Structure",
              desc: "Managed Investment Scheme under ASIC regulation. Wholesale investors only (s708). Independent trustee, auditor, and compliance framework.",
            },
            {
              title: "Token Mechanics",
              desc: "ERC-3643 (T-REX) permissioned tokens on Ethereum. On-chain identity verification. Transfer restrictions enforced at the smart contract level.",
            },
            {
              title: "NAV & Pricing",
              desc: "Net Asset Value calculated weekly from independently appraised SPV equity positions, accrued integration fee receivables, and lease-backed asset valuations. Token price directly reflects per-unit NAV.",
            },
            {
              title: "Distribution Model",
              desc: "Quarterly USDC distributions follow the fund waterfall: stabilised asset sale proceeds → repay senior construction debt → integration fee income (12% GDV) → fund income pool → management fee (1.5%) → preferred return (8%) → performance fee (20% above hurdle) → pro-rata distribution to token holders.",
            },
            {
              title: "Subscription & Entry",
              desc: "Subscribe with USDC or stake hard assets (property, crypto, promissory notes, mortgage notes, art, cash). AI valuation engine assesses each asset with risk-appropriate haircuts (0-45%). Contributions Committee approves. Tokens minted at current NAV per unit.",
            },
            {
              title: "Security Architecture",
              desc: "Gnosis Safe multisig treasury. KYC/AML via ONCHAINID on-chain identity. On-chain allowlisting. Smart contract audited. Role-based access controls throughout.",
            },
          ].map((section) => (
            <div
              key={section.title}
              className="bg-white p-6 border border-black/5"
            >
              <h3 className="font-archivo font-bold text-deep-blue mb-2">
                {section.title}
              </h3>
              <p className="text-sm text-slate leading-relaxed font-archivo">
                {section.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Fund Operations */}
        <div className="mb-12">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Fund Operations
          </p>
          <h2 className="font-playfair text-[2rem] font-black text-deep-blue leading-tight mb-6">
            Build → Stabilise → Sell → Recycle
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 border border-black/5 hover:border-ember transition-colors">
              <h3 className="font-archivo font-bold text-deep-blue mb-2">
                Capital Deployment
              </h3>
              <p className="text-sm text-slate leading-relaxed font-archivo">
                F2K pays for all construction works upfront the moment a
                government lease is signed — no progress claims, no construction
                finance risk for the tenant. Each project sits in a ring-fenced
                SPV. ~40% cash equity from token investors plus a hard asset
                collateral pool enables access to institutional construction
                debt, deploying $2.50-$3.00 of housing per $1 of investor
                equity.
              </p>
            </div>
            <div className="bg-white p-6 border border-black/5 hover:border-ember transition-colors">
              <h3 className="font-archivo font-bold text-deep-blue mb-2">
                Revenue Model
              </h3>
              <p className="text-sm text-slate leading-relaxed font-archivo">
                F2K earns a 12% of GDV integration fee during build. Once
                housing is delivered and tenants are in place under 10-year
                take-or-pay leases, the stabilised, income-producing entity is
                sold to a REIT or institutional long-hold investor at a yield
                premium over development cost. The spread between build cost and
                sale price is the fund&apos;s primary return.
              </p>
            </div>
            <div className="bg-white p-6 border border-black/5 hover:border-ember transition-colors">
              <h3 className="font-archivo font-bold text-deep-blue mb-2">
                Capital Recycling & Liquidity
              </h3>
              <p className="text-sm text-slate leading-relaxed font-archivo">
                Each stabilised asset sale returns capital to the fund —
                available for distribution or redeployment into the next
                project. This recycling means the fund can run multiple projects
                concurrently without raising new equity each time. Quarterly
                redemption windows and transferable tokens provide investor
                liquidity.
              </p>
            </div>
          </div>
        </div>

        {/* Download CTA */}
        <div className="bg-deep-blue text-off-white p-8 md:p-12 text-center">
          <h2 className="font-playfair text-2xl font-bold mb-4">
            Download the Full Whitepaper
          </h2>
          <p className="text-off-white/70 font-archivo mb-6 max-w-[500px] mx-auto">
            Get the complete V3 whitepaper with full technical specifications,
            financial projections, and legal framework documentation.
          </p>
          <a
            href="/docs/F2K-Housing-Token-Whitepaper-V3.docx"
            download
            className="inline-block bg-ember hover:bg-ember/90 text-white px-8 py-3 font-archivo font-semibold transition-colors"
          >
            Download Whitepaper (.docx)
          </a>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate font-archivo mb-4">
            Ready to invest in Australia&apos;s housing future?
          </p>
          <a
            href="/invest"
            className="inline-block bg-ember hover:bg-ember/90 text-white px-8 py-3 font-archivo font-semibold transition-colors"
          >
            Apply to Invest
          </a>
        </div>
      </div>
    </div>
  );
}
