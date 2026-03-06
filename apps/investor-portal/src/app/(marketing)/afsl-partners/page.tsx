import AFSLPartnerForm from "@/components/AFSLPartnerForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AFSL Partners — F2K Housing Token | Factory to Key",
  description:
    "F2K is seeking an AFSL licence holder to host our tokenised housing fund as a Corporate Authorised Representative. Submit your expression of interest.",
};

export default function AFSLPartnersPage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="bg-deep-blue text-off-white py-20 px-4">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            AFSL Partnership
          </p>
          <h1 className="font-playfair text-[clamp(2.5rem,5vw,4rem)] font-black leading-tight mb-6">
            Host Australia&apos;s First
            <br />
            Tokenised Housing Fund
          </h1>
          <p className="text-lg text-off-white/70 leading-relaxed font-archivo max-w-[750px]">
            F2K is seeking an established AFSL licence holder to host our $600M
            tokenised housing fund under a Corporate Authorised Representative
            arrangement. This is a unique opportunity to partner with a
            first-mover in blockchain-native fund management for Australian
            housing.
          </p>
        </div>
      </section>

      {/* ===== THE OPPORTUNITY ===== */}
      <section className="py-20 px-4 bg-off-white">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            The Opportunity
          </p>
          <h2 className="font-playfair text-[2.4rem] font-black text-deep-blue leading-tight mb-6">
            Why Partner with F2K?
          </h2>
          <p className="text-lg text-slate leading-relaxed font-archivo mb-10">
            The F2K Housing Token is a fully built, tokenised Managed Investment
            Scheme targeting wholesale investors. The platform, smart contracts,
            and operational infrastructure are complete. What we need is an AFSL
            partner to provide the regulatory licence while we apply for our own.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[
              {
                stat: "$600M",
                label: "Target Fund Size",
                desc: "A substantial AUM opportunity growing through phased capital raises",
              },
              {
                stat: "Wholesale Only",
                label: "s708 Investors",
                desc: "No retail clients — lower compliance burden, higher ticket sizes",
              },
              {
                stat: "AI-Native",
                label: "Operations",
                desc: "Platform handles NAV calculation, distributions, KYC, and audit logging automatically",
              },
              {
                stat: "ERC-3643",
                label: "Security Token",
                desc: "Institutional-grade permissioned token standard with on-chain compliance enforcement",
              },
              {
                stat: "Interim",
                label: "Arrangement",
                desc: "F2K will apply for its own AFSL in parallel — this is a 12-18 month partnership while our application is reviewed",
              },
              {
                stat: "$70B+",
                label: "Addressable Market",
                desc: "Government social housing programs across all Australian states and territories",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white p-6 border border-black/5"
              >
                <p className="font-playfair text-2xl font-bold text-ember mb-1">
                  {item.stat}
                </p>
                <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-slate/60 mb-2">
                  {item.label}
                </p>
                <p className="text-sm text-slate leading-relaxed font-archivo">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHAT WE NEED ===== */}
      <section className="py-20 px-4 bg-warm-grey">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Requirements
          </p>
          <h2 className="font-playfair text-[2.4rem] font-black text-deep-blue leading-tight mb-10">
            What We Need from an AFSL Partner
          </h2>

          <div className="space-y-6">
            <div className="bg-white p-8 border border-black/5 relative">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-ember" />
              <h3 className="font-archivo font-bold text-deep-blue text-lg mb-4 mt-1">
                Required AFSL Authorisations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    auth: "Operate a registered managed investment scheme",
                    why: "Core authorisation — F2K is structured as a MIS under Chapter 5C",
                  },
                  {
                    auth: "Deal in a financial product",
                    why: "Issue and redeem F2K-HT tokens (MIS interests)",
                  },
                  {
                    auth: "Provide general advice to wholesale clients",
                    why: "Fund marketing and investor communications",
                  },
                  {
                    auth: "Provide custodial or depository service",
                    why: "Or confirmed arrangement with a third-party custodian",
                  },
                ].map((item) => (
                  <div key={item.auth} className="border border-black/5 p-4">
                    <p className="font-archivo font-semibold text-deep-blue text-sm mb-1">
                      {item.auth}
                    </p>
                    <p className="font-archivo text-xs text-slate/70">
                      {item.why}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 border border-black/5 relative">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-brass" />
              <h3 className="font-archivo font-bold text-deep-blue text-lg mb-4 mt-1">
                Preferred Capabilities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Experience hosting emerging fund managers as CARs",
                  "Familiarity with digital assets or tokenised securities",
                  "Existing compliance monitoring infrastructure",
                  "Wholesale-only fund experience (s708)",
                  "Capacity to support a fund targeting $600M AUM",
                  "Willingness to partner on a novel fund structure (ERC-3643 security tokens, on-chain NAV, USDC distributions)",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 text-sm font-archivo text-slate"
                  >
                    <span className="text-brass mt-0.5 shrink-0">&rarr;</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHAT F2K PROVIDES ===== */}
      <section className="py-20 px-4 bg-off-white">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            What You Get
          </p>
          <h2 className="font-playfair text-[2.4rem] font-black text-deep-blue leading-tight mb-10">
            F2K Provides the Infrastructure
          </h2>
          <p className="text-lg text-slate leading-relaxed font-archivo mb-10">
            This is not a bare startup looking for a licence. The entire
            platform is built and tested. Your role is regulatory oversight and
            compliance monitoring &mdash; F2K handles everything else.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Complete Technology Platform",
                desc: "Investor portal, admin console, smart contracts (32 tests passing), KYC integration, Gnosis Safe treasury — all built and deployed on Sepolia testnet.",
              },
              {
                title: "Operational Runbooks",
                desc: "Documented procedures for investor onboarding, weekly NAV publication, quarterly distributions, emergency pause, wallet freeze, and failed transaction recovery.",
              },
              {
                title: "Smart Contract Audit (Planned)",
                desc: "Tier-1 audit by Trail of Bits, OpenZeppelin, or Sigma Prime scheduled before mainnet deployment. 3 custom contracts + T-REX configuration.",
              },
              {
                title: "AI-Native Operations",
                desc: "AI handles NAV calculation, compliance monitoring, distribution computation, and reporting. Human intervention required only for approvals and sign-offs.",
              },
              {
                title: "Fund Administration",
                desc: "F2K will appoint a third-party fund administrator (Apex Group / Citco) for independent NAV calculation, unit registry, and tax reporting.",
              },
              {
                title: "Distribution Network",
                desc: "Introducer channel structure established with financial advisers, mortgage brokers, and institutional placement agents. Entry fee model funds all distribution costs.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white p-6 border border-black/5"
              >
                <h3 className="font-archivo font-bold text-deep-blue text-sm uppercase tracking-wide mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate leading-relaxed font-archivo">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ARRANGEMENT STRUCTURE ===== */}
      <section className="py-20 px-4 bg-deep-blue text-off-white">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-brass mb-4">
            Partnership Model
          </p>
          <h2 className="font-playfair text-[2.4rem] font-black text-off-white leading-tight mb-10">
            How the CAR Arrangement Works
          </h2>

          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "CAR Agreement Signed",
                desc: "F2K becomes a Corporate Authorised Representative under your AFSL. You notify ASIC. Operational within weeks.",
              },
              {
                step: "2",
                title: "Compliance Monitoring",
                desc: "You provide ongoing compliance oversight — monitoring F2K's operations against your licence conditions. F2K provides regular reporting via the admin console.",
              },
              {
                step: "3",
                title: "F2K Operates the Fund",
                desc: "F2K manages all fund operations: investor onboarding, KYC, subscription processing, NAV publication, distributions, and investor communications.",
              },
              {
                step: "4",
                title: "Own AFSL Application in Parallel",
                desc: "F2K lodges its own AFSL application with ASIC. The CAR arrangement continues until the own licence is granted (typically 10-14 months).",
              },
              {
                step: "5",
                title: "Transition to Own Licence",
                desc: "Once F2K's own AFSL is granted, the CAR arrangement terminates. Clean transition with no disruption to investors.",
              },
            ].map((item, i) => (
              <div key={item.step} className="flex gap-4 items-start">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-10 h-10 rounded-full bg-ember text-white font-playfair text-sm font-bold flex items-center justify-center">
                    {item.step}
                  </div>
                  {i < 4 && (
                    <div className="w-0.5 h-8 bg-off-white/10 mt-1" />
                  )}
                </div>
                <div className="pb-2">
                  <h3 className="font-archivo font-bold text-off-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-off-white/60 leading-relaxed font-archivo">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 border border-brass/30 bg-brass/10 p-6">
            <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-brass mb-2">
              Revenue for AFSL Partner
            </p>
            <p className="text-sm text-off-white/70 leading-relaxed font-archivo">
              AFSL partners typically charge an annual hosting fee ($30K-$80K)
              plus a basis-point share of AUM for compliance monitoring. We are
              open to creative fee structures that align incentives &mdash;
              including AUM-linked fees that grow with the fund. Tell us what
              works for your business model.
            </p>
          </div>
        </div>
      </section>

      {/* ===== SELECTION CRITERIA ===== */}
      <section className="py-20 px-4 bg-warm-grey">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Selection Process
          </p>
          <h2 className="font-playfair text-[2.4rem] font-black text-deep-blue leading-tight mb-6">
            How We Will Evaluate Partners
          </h2>
          <p className="text-lg text-slate leading-relaxed font-archivo mb-10">
            We will assess all expressions of interest against the following
            criteria. The strongest candidates will be invited to present their
            proposal to the F2K leadership team.
          </p>

          <div className="bg-white border border-black/5 overflow-hidden">
            <table className="w-full">
              <thead className="bg-deep-blue text-off-white">
                <tr>
                  <th className="px-6 py-3 text-left font-archivo text-sm font-semibold">
                    Criterion
                  </th>
                  <th className="px-6 py-3 text-left font-archivo text-sm font-semibold">
                    Weight
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {[
                  {
                    criterion:
                      "AFSL authorisations match F2K requirements (operate MIS, deal, general advice)",
                    weight: "Essential",
                  },
                  {
                    criterion:
                      "Track record hosting emerging fund managers as CARs",
                    weight: "High",
                  },
                  {
                    criterion:
                      "Digital assets / tokenised securities familiarity",
                    weight: "High",
                  },
                  {
                    criterion:
                      "Compliance monitoring infrastructure and responsiveness",
                    weight: "High",
                  },
                  {
                    criterion: "Fee competitiveness and alignment of incentives",
                    weight: "Medium",
                  },
                  {
                    criterion:
                      "Capacity to support growing AUM ($1M seed to $600M target)",
                    weight: "Medium",
                  },
                  {
                    criterion:
                      "Speed to onboard (weeks, not months)",
                    weight: "Medium",
                  },
                  {
                    criterion:
                      "Willingness to support novel structure (blockchain MIS, USDC, on-chain NAV)",
                    weight: "High",
                  },
                ].map((row) => (
                  <tr key={row.criterion}>
                    <td className="px-6 py-4 font-archivo text-sm text-slate">
                      {row.criterion}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-ibm-mono text-[0.6rem] tracking-wider uppercase px-2 py-0.5 ${
                          row.weight === "Essential"
                            ? "bg-ember text-white"
                            : row.weight === "High"
                              ? "bg-brass/20 text-deep-blue"
                              : "bg-warm-grey text-slate"
                        }`}
                      >
                        {row.weight}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== FORM ===== */}
      <section id="apply" className="py-20 px-4 bg-off-white">
        <div className="max-w-[700px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Expression of Interest
          </p>
          <h2 className="font-playfair text-[2.8rem] font-black text-deep-blue leading-tight mb-4">
            Submit Your Proposal
          </h2>
          <p className="text-lg text-slate leading-relaxed font-archivo mb-8">
            If your firm holds an AFSL with the required authorisations and has
            the capacity to host a tokenised housing fund, we want to hear from
            you. Complete the form below and we will be in touch within 5
            business days.
          </p>
          <AFSLPartnerForm />
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-ember text-white py-16 px-4 text-center">
        <div className="max-w-[700px] mx-auto">
          <h2 className="font-playfair text-[clamp(2rem,4vw,3rem)] font-black leading-tight mb-4">
            Be Part of a First.
          </h2>
          <p className="text-lg text-white/85 leading-relaxed font-archivo mb-8">
            Tokenised managed investment schemes are the future of Australian
            fund management. Partner with F2K and be the AFSL that made it
            happen.
          </p>
          <a
            href="#apply"
            className="bg-white text-ember hover:bg-off-white px-8 py-3 font-archivo font-semibold transition-colors inline-block"
          >
            Submit Expression of Interest
          </a>
        </div>
      </section>
    </>
  );
}
