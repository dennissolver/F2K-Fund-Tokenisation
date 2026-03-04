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
          The complete technical and financial specification for the F2K Housing
          Token — a regulated ERC-3643 security token representing units in a
          Managed Investment Scheme backed by Australian residential property.
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
              desc: "Net Asset Value calculated weekly from independently appraised real assets. Token price directly reflects per-unit NAV. Transparent methodology.",
            },
            {
              title: "Distribution Model",
              desc: "Quarterly USDC distributions to all token holders, calculated pro-rata. Fund income sourced from housing project revenues and asset appreciation.",
            },
            {
              title: "Staking Process",
              desc: "Contribute qualifying assets (property, bonds, cash) to the fund. Independent appraisal determines contribution value. Tokens minted proportionally.",
            },
            {
              title: "Security Architecture",
              desc: "Gnosis Safe multisig treasury. KYC/AML via Sumsub. On-chain allowlisting. Smart contract audited. Role-based access controls throughout.",
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
