import IntroducerInterestForm from "@/components/IntroducerInterestForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Introducers — F2K Housing Token | Factory to Key",
  description:
    "Become an authorised introducer for the F2K Housing Token. Commission structure, channel types, and application for financial advisers, brokers, and institutional placement agents.",
};

export default function IntroducersPage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="bg-deep-blue text-off-white py-20 px-4">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Distribution Partners
          </p>
          <h1 className="font-playfair text-[clamp(2.5rem,5vw,4rem)] font-black leading-tight mb-6">
            Introduce Investors to F2K
          </h1>
          <p className="text-lg text-off-white/70 leading-relaxed font-archivo max-w-[750px]">
            F2K is building a distribution network of financial advisers,
            brokers, and institutional placement agents to connect wholesale
            investors with Australia&apos;s tokenised housing fund. Earn
            upfront and trailing commissions funded entirely from the entry fee
            &mdash; not from investor capital or fund returns.
          </p>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 px-4 bg-off-white">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            The Model
          </p>
          <h2 className="font-playfair text-[2.4rem] font-black text-deep-blue leading-tight mb-6">
            Entry Fee Funded. Zero Impact on Investors.
          </h2>
          <p className="text-lg text-slate leading-relaxed font-archivo mb-10">
            Every subscription carries an entry fee of up to 3%. Introducer
            commissions are paid from this fee. The investor&apos;s tokens are
            minted based on the net amount after the entry fee. The fund NAV,
            management fee, and investor returns are completely untouched.
          </p>

          {/* Flow diagram */}
          <div className="bg-white border border-black/5 p-8 mb-10">
            <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-6">
              Subscription Flow — Introduced Investor
            </p>
            <div className="space-y-4 font-archivo text-sm">
              {[
                {
                  label: "Investor subscribes",
                  value: "$1,000,000 USDC",
                  color: "bg-deep-blue text-off-white",
                },
                {
                  label: "Entry fee (3%)",
                  value: "$30,000",
                  color: "bg-ember text-white",
                },
                {
                  label: "Introducer commission (up to 2%)",
                  value: "Up to $20,000",
                  color: "bg-brass/20 text-deep-blue",
                },
                {
                  label: "F2K retains (1%+)",
                  value: "$10,000+",
                  color: "bg-warm-grey text-deep-blue",
                },
                {
                  label: "Net invested in fund (tokens minted on this amount)",
                  value: "$970,000",
                  color: "bg-deep-blue text-off-white",
                },
              ].map((row, i) => (
                <div key={i} className="flex items-stretch gap-3">
                  <div className="w-6 flex flex-col items-center shrink-0 pt-3">
                    <div className="w-2 h-2 rounded-full bg-ember" />
                    {i < 4 && <div className="w-0.5 flex-1 bg-warm-grey mt-1" />}
                  </div>
                  <div
                    className={`${row.color} px-5 py-3 flex-1 flex items-center justify-between`}
                  >
                    <span>{row.label}</span>
                    <span className="font-ibm-mono font-semibold">
                      {row.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate/60 font-archivo mt-4 italic">
              Direct subscriptions without an introducer may have the entry fee
              reduced or waived entirely.
            </p>
          </div>
        </div>
      </section>

      {/* ===== COMMISSION TIERS ===== */}
      <section className="py-20 px-4 bg-warm-grey">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Commission Structure
          </p>
          <h2 className="font-playfair text-[2.4rem] font-black text-deep-blue leading-tight mb-10">
            Four Channels. Clear Terms.
          </h2>

          <div className="space-y-6">
            {/* Tier 1 */}
            <div className="bg-white p-8 border border-black/5 relative">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-ember" />
              <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                <div>
                  <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-ember mb-1">
                    Tier 1 — Primary Channel
                  </p>
                  <h3 className="font-playfair text-xl font-bold text-deep-blue">
                    Financial Advisers &amp; Wealth Managers
                  </h3>
                </div>
                <span className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-ember border border-ember/30 px-3 py-1">
                  AFSL Required
                </span>
              </div>
              <p className="text-sm text-slate leading-relaxed font-archivo mb-6">
                Licensed advisers with wholesale client books. Can provide
                personal advice on suitability. The primary distribution channel
                for F2K &mdash; highest volume, most credible, deepest client
                relationships.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-black/5 p-4 text-center">
                  <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-slate/60 mb-1">
                    Upfront Commission
                  </p>
                  <p className="font-playfair text-2xl font-bold text-ember">
                    1.0 – 2.0%
                  </p>
                  <p className="text-xs text-slate/60 font-archivo mt-1">
                    of subscription amount
                  </p>
                </div>
                <div className="border border-black/5 p-4 text-center">
                  <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-slate/60 mb-1">
                    Trailing Commission
                  </p>
                  <p className="font-playfair text-2xl font-bold text-brass">
                    0.30 – 0.50%
                  </p>
                  <p className="text-xs text-slate/60 font-archivo mt-1">
                    p.a. of FUM, paid quarterly
                  </p>
                </div>
                <div className="border border-black/5 p-4 text-center">
                  <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-slate/60 mb-1">
                    Volume Bonus
                  </p>
                  <p className="font-playfair text-2xl font-bold text-deep-blue">
                    +0.25%
                  </p>
                  <p className="text-xs text-slate/60 font-archivo mt-1">
                    upfront at &gt;$5M aggregate / year
                  </p>
                </div>
              </div>
            </div>

            {/* Tier 2 */}
            <div className="bg-white p-8 border border-black/5 relative">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-brass" />
              <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                <div>
                  <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-brass mb-1">
                    Tier 2 — Referral Channel
                  </p>
                  <h3 className="font-playfair text-xl font-bold text-deep-blue">
                    Mortgage Brokers &amp; Property Advisers
                  </h3>
                </div>
                <span className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-brass border border-brass/30 px-3 py-1">
                  Mere Referral
                </span>
              </div>
              <p className="text-sm text-slate leading-relaxed font-archivo mb-6">
                Introduction only &mdash; the referrer provides the
                investor&apos;s name and contact details, and F2K handles all
                advice, onboarding, and KYC. Structured under s766B(5) of the
                Corporations Act as a mere referral to avoid triggering AFSL
                requirements for the referrer.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-black/5 p-4 text-center">
                  <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-slate/60 mb-1">
                    Referral Fee
                  </p>
                  <p className="font-playfair text-2xl font-bold text-ember">
                    0.50 – 1.0%
                  </p>
                  <p className="text-xs text-slate/60 font-archivo mt-1">
                    one-off, paid on settlement
                  </p>
                </div>
                <div className="border border-black/5 p-4 text-center">
                  <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-slate/60 mb-1">
                    Trailing Commission
                  </p>
                  <p className="font-playfair text-2xl font-bold text-brass">
                    0.15 – 0.25%
                  </p>
                  <p className="text-xs text-slate/60 font-archivo mt-1">
                    p.a. of FUM, paid quarterly
                  </p>
                </div>
              </div>
            </div>

            {/* Tier 3 */}
            <div className="bg-white p-8 border border-black/5 relative">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-deep-blue" />
              <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                <div>
                  <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-deep-blue mb-1">
                    Tier 3 — Institutional Channel
                  </p>
                  <h3 className="font-playfair text-xl font-bold text-deep-blue">
                    Placement Agents, Family Offices &amp; Fund-of-Funds
                  </h3>
                </div>
                <span className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-deep-blue border border-deep-blue/30 px-3 py-1">
                  Negotiated
                </span>
              </div>
              <p className="text-sm text-slate leading-relaxed font-archivo mb-6">
                Institutional capital at scale ($5M+ per investor). These
                relationships bring larger ticket sizes and ongoing deal flow.
                Terms are negotiated per mandate and may include co-investment
                rights and performance participation.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-black/5 p-4 text-center">
                  <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-slate/60 mb-1">
                    Placement Fee
                  </p>
                  <p className="font-playfair text-2xl font-bold text-ember">
                    1.5 – 3.0%
                  </p>
                  <p className="text-xs text-slate/60 font-archivo mt-1">
                    of capital raised, negotiated
                  </p>
                </div>
                <div className="border border-black/5 p-4 text-center">
                  <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-slate/60 mb-1">
                    Trailing Share
                  </p>
                  <p className="font-playfair text-2xl font-bold text-brass">
                    0.20 – 0.40%
                  </p>
                  <p className="text-xs text-slate/60 font-archivo mt-1">
                    p.a. of FUM, paid quarterly
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-archivo text-slate">
                <div className="border border-black/5 p-3">
                  <span className="text-ember font-semibold">
                    Co-invest rights:
                  </span>{" "}
                  early NAV access and priority allocation for the
                  introducer&apos;s own capital
                </div>
                <div className="border border-black/5 p-3">
                  <span className="text-ember font-semibold">
                    Performance share:
                  </span>{" "}
                  5-10% of performance fee for mandates introducing &gt;$20M
                </div>
              </div>
            </div>

            {/* Tier 4 */}
            <div className="bg-white p-8 border border-black/5 relative">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-forest" />
              <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                <div>
                  <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-forest mb-1">
                    Tier 4 — Strategic Partners
                  </p>
                  <h3 className="font-playfair text-xl font-bold text-deep-blue">
                    Manufacturers, CHPs &amp; Government Referrals
                  </h3>
                </div>
                <span className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-forest border border-forest/30 px-3 py-1">
                  Non-Cash
                </span>
              </div>
              <p className="text-sm text-slate leading-relaxed font-archivo mb-6">
                Strategic partners who refer investors from within their own
                networks. Incentives are non-cash &mdash; these partners want
                pipeline access, preferential terms, and co-investment priority
                rather than commission payments.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-forest/10 bg-forest/[0.02] p-4 text-center">
                  <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-slate/60 mb-1">
                    Referral Credit
                  </p>
                  <p className="font-archivo font-semibold text-deep-blue text-sm">
                    0.50% subscription discount
                  </p>
                  <p className="text-xs text-slate/60 font-archivo mt-1">
                    applied to the referred investor
                  </p>
                </div>
                <div className="border border-forest/10 bg-forest/[0.02] p-4 text-center">
                  <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-slate/60 mb-1">
                    Co-Investment Priority
                  </p>
                  <p className="font-archivo font-semibold text-deep-blue text-sm">
                    Early access
                  </p>
                  <p className="text-xs text-slate/60 font-archivo mt-1">
                    priority allocation in oversubscribed tranches
                  </p>
                </div>
                <div className="border border-forest/10 bg-forest/[0.02] p-4 text-center">
                  <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-slate/60 mb-1">
                    Fee Reduction
                  </p>
                  <p className="font-archivo font-semibold text-deep-blue text-sm">
                    Reduced management fee
                  </p>
                  <p className="text-xs text-slate/60 font-archivo mt-1">
                    for partners who invest and refer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COMPLIANCE ===== */}
      <section className="py-20 px-4 bg-off-white">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Compliance &amp; Terms
          </p>
          <h2 className="font-playfair text-[2.4rem] font-black text-deep-blue leading-tight mb-10">
            How We Work Together
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {[
              {
                title: "AFSL Verification",
                desc: "Tier 1 and Tier 3 introducers must hold an AFSL or be an authorised representative. We verify before onboarding.",
              },
              {
                title: "Mere Referral Safe Harbour",
                desc: "Tier 2 referrers must not provide financial advice. The referral agreement limits scope to name and contact details only. F2K handles all advice and onboarding.",
              },
              {
                title: "Full Disclosure",
                desc: "All introducer commissions are disclosed to investors in the Information Memorandum and subscription agreement. Transparency is non-negotiable.",
              },
              {
                title: "Written Agreements",
                desc: "Every introducer signs a distribution agreement with the fee schedule, obligations, compliance requirements, and termination provisions.",
              },
              {
                title: "Clawback Clause",
                desc: "If an introduced investor redeems within 12 months of subscription, the upfront commission is clawed back pro-rata. This aligns introducer incentives with investor retention.",
              },
              {
                title: "AML/CTF Responsibility",
                desc: "Introducers are not responsible for KYC or AML checks. F2K handles all investor verification, identity checks, and sanctions screening directly.",
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

          <div className="bg-deep-blue text-off-white p-8">
            <h3 className="font-playfair text-xl font-bold mb-4">
              Regulatory Position
            </h3>
            <p className="text-sm text-off-white/70 leading-relaxed font-archivo mb-4">
              F2K Housing Token is offered exclusively to wholesale investors
              under Section 708 of the Corporations Act 2001. The FOFA
              conflicted remuneration ban{" "}
              <strong className="text-off-white">
                does not apply to wholesale clients
              </strong>
              , allowing full flexibility on introducer commission structures.
            </p>
            <p className="text-sm text-off-white/70 leading-relaxed font-archivo">
              All commissions are funded from the entry fee charged on each
              subscription. No introducer fees are taken from investor capital,
              fund NAV, or ongoing management fees. The investor&apos;s
              exposure is the entry fee only &mdash; fully disclosed before
              subscription.
            </p>
          </div>
        </div>
      </section>

      {/* ===== WHAT YOU GET ===== */}
      <section className="py-20 px-4 bg-warm-grey">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Introducer Benefits
          </p>
          <h2 className="font-playfair text-[2.4rem] font-black text-deep-blue leading-tight mb-10">
            What You Get as an Introducer
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Referral Dashboard",
                desc: "Track your referred investors, AUM under your book, pending commissions, and payment history in real-time.",
              },
              {
                title: "On-Chain Transparency",
                desc: "Token balances are on-chain. Trail commissions auto-calculate quarterly from verified holdings. No disputes over attribution.",
              },
              {
                title: "Marketing Collateral",
                desc: "Co-branded materials, fund fact sheets, and presentation decks tailored for your client conversations.",
              },
              {
                title: "Quarterly Reporting",
                desc: "Fund performance reports, NAV history, and distribution summaries formatted for your compliance files.",
              },
              {
                title: "Dedicated Support",
                desc: "Direct access to the F2K distribution team for investor queries, onboarding support, and pipeline planning.",
              },
              {
                title: "Product Training",
                desc: "CPD-eligible training on tokenised securities, ERC-3643, and the F2K fund structure for your advisory team.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white p-6 border border-black/5"
              >
                <h3 className="font-archivo font-bold text-deep-blue text-sm mb-2">
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

      {/* ===== FORM ===== */}
      <section id="apply" className="py-20 px-4 bg-off-white">
        <div className="max-w-[700px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Become an Introducer
          </p>
          <h2 className="font-playfair text-[2.8rem] font-black text-deep-blue leading-tight mb-4">
            Apply Now
          </h2>
          <p className="text-lg text-slate leading-relaxed font-archivo mb-8">
            Complete the form below to register your interest as an F2K
            introducer. We will review your application and be in touch within 5
            business days to discuss terms and onboarding.
          </p>
          <IntroducerInterestForm />
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-ember text-white py-16 px-4 text-center">
        <div className="max-w-[700px] mx-auto">
          <h2 className="font-playfair text-[clamp(2rem,4vw,3rem)] font-black leading-tight mb-4">
            The Housing Pipeline Is Real.
            <br />
            The Fund Is Ready.
          </h2>
          <p className="text-lg text-white/85 leading-relaxed font-archivo mb-8">
            $400M fund. $70B+ addressable market. Government-backed leases.
            Tokenised for transparency. Your wholesale clients need exposure to
            real assets with contracted income &mdash; this is it.
          </p>
          <a
            href="#apply"
            className="bg-white text-ember hover:bg-off-white px-8 py-3 font-archivo font-semibold transition-colors inline-block"
          >
            Apply to Become an Introducer
          </a>
        </div>
      </section>
    </>
  );
}
