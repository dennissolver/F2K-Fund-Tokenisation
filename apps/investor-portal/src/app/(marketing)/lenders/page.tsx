import RegisterInterestForm from "@/components/RegisterInterestForm";

export default function LendersPage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="bg-deep-blue text-off-white min-h-[60vh] flex items-center justify-center relative overflow-hidden px-4 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_85%,rgba(184,66,15,0.12)_0%,transparent_50%),radial-gradient(ellipse_at_85%_15%,rgba(200,168,78,0.08)_0%,transparent_50%)]" />
        <div className="relative z-10 max-w-[900px] text-center">
          <p className="font-ibm-mono text-[0.75rem] tracking-[0.5em] uppercase text-ember mb-8">
            Construction Finance
          </p>
          <h1 className="font-playfair text-[clamp(2.8rem,7vw,5rem)] font-black leading-[1] mb-6">
            Senior Debt,
            <br />
            <em className="text-brass">Ring-Fenced Risk.</em>
          </h1>
          <p className="font-archivo text-lg text-off-white/80 max-w-[700px] mx-auto leading-relaxed">
            Provide construction finance to purpose-built SPVs with pre-committed
            10-year government and employer leases. Fund equity sits subordinated
            below your senior position.
          </p>
        </div>
      </section>

      {/* ===== THE OPPORTUNITY ===== */}
      <section className="py-20 px-4 bg-off-white">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            The Opportunity
          </p>
          <h2 className="font-playfair text-[2.8rem] font-black text-deep-blue leading-tight mb-8">
            A Growing National Pipeline
          </h2>
          <div className="space-y-4 font-archivo text-slate leading-relaxed">
            <p>
              Australia&apos;s housing crisis is driving billions in committed government
              and employer spending. F2K connects this demand with private capital through
              ring-fenced SPV structures, each backed by pre-committed 10-year take-or-pay leases.
            </p>
            <p>
              As an experienced construction lender, you benefit from a pipeline of
              repeat, standardised transactions — modular housing delivered in 14-16 weeks,
              with an experienced integrator managing the build and fund equity absorbing
              first-loss risk.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {[
              { stat: "14-16wk", label: "Factory to key delivery" },
              { stat: "10yr", label: "Pre-committed lease terms" },
              { stat: "30-40%", label: "Fund equity (first-loss)" },
              { stat: "12%", label: "Integrator fee (GDV)" },
            ].map((item) => (
              <div key={item.label} className="bg-white p-6 border border-black/5">
                <p className="text-3xl font-bold text-brass font-playfair">{item.stat}</p>
                <p className="text-sm text-slate font-archivo mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DEAL STRUCTURE ===== */}
      <section className="py-20 px-4 bg-warm-grey">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Deal Structure
          </p>
          <h2 className="font-playfair text-[2.8rem] font-black text-deep-blue leading-tight mb-8">
            Capital Stack
          </h2>

          <div className="bg-deep-blue text-off-white p-8">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between font-archivo text-sm mb-2">
                  <span className="text-brass font-semibold uppercase tracking-wide">
                    Senior Construction Debt — Your Position
                  </span>
                  <span className="text-brass font-bold">60-70%</span>
                </div>
                <div className="w-full bg-off-white/10 h-6">
                  <div className="bg-brass h-6 flex items-center pl-3" style={{ width: "65%" }}>
                    <span className="text-[#0B0B0B] font-archivo text-xs font-semibold">SENIOR</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between font-archivo text-sm mb-2">
                  <span className="text-off-white/70">Fund Equity — Subordinated</span>
                  <span className="text-ember font-bold">30-40%</span>
                </div>
                <div className="w-full bg-off-white/10 h-6">
                  <div className="bg-ember/70 h-6 flex items-center pl-3" style={{ width: "35%" }}>
                    <span className="text-white font-archivo text-xs font-semibold">EQUITY</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-off-white/50 font-archivo text-sm mt-6">
              Every $1 of fund equity supports $2.50–$3.00 of total project value.
              Your senior debt is repaid first from asset sale proceeds.
            </p>
          </div>
        </div>
      </section>

      {/* ===== RISK MITIGANTS ===== */}
      <section className="py-20 px-4 bg-off-white">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Risk Mitigants
          </p>
          <h2 className="font-playfair text-[2.8rem] font-black text-deep-blue leading-tight mb-8">
            Six Layers of Protection
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "SPV Ring-Fencing",
                text: "Each project sits in a separate SPV. No cross-collateralisation. Your exposure is project-specific, not fund-wide.",
              },
              {
                title: "Pre-Committed Leases",
                text: "Government departments and employers sign 10-year take-or-pay leases before construction begins. Income certainty from day one.",
              },
              {
                title: "Fund Equity First-Loss",
                text: "30-40% fund equity sits below your senior debt. This cushion absorbs cost overruns or value shortfalls before your position is affected.",
              },
              {
                title: "Integrator Alignment",
                text: "F2K earns its 12% fee only on successful delivery. The integrator's revenue is directly tied to project completion.",
              },
              {
                title: "Fixed-Price Modular",
                text: "Factory-built housing with fixed-price contracts reduces construction risk, weather delays, and labour shortages typical of site-built projects.",
              },
              {
                title: "REIT Exit Pathway",
                text: "Stabilised, lease-backed assets are sold to institutional investors. Senior debt is repaid first from sale proceeds.",
              },
            ].map((card) => (
              <div key={card.title} className="bg-white p-8 border border-black/5 hover:border-ember transition-colors">
                <h3 className="font-archivo text-sm font-bold text-deep-blue uppercase tracking-wide mb-3">
                  {card.title}
                </h3>
                <p className="text-sm text-slate leading-relaxed font-archivo">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EXIT PATH ===== */}
      <section className="bg-deep-blue text-off-white py-20 px-4">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-brass mb-4">
            Exit Path
          </p>
          <h2 className="font-playfair text-[2.8rem] font-black text-off-white leading-tight mb-8">
            Build → Stabilise → Sell → Repay
          </h2>

          <div className="space-y-0">
            {[
              { step: "1", title: "Construction (14-16 weeks)", desc: "Modular housing delivered from factory to site. Fixed-price, fixed-timeline." },
              { step: "2", title: "Lease Stabilisation", desc: "Government or employer tenants move in under pre-committed 10-year leases." },
              { step: "3", title: "REIT Sale", desc: "Stabilised, income-producing SPV is sold to a REIT or institutional long-hold investor." },
              { step: "4", title: "Senior Debt Repaid First", desc: "Sale proceeds flow through the waterfall. Senior construction debt is repaid in priority before any equity distributions." },
            ].map((item, i) => (
              <div key={item.step} className="flex gap-4 items-start">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-12 h-12 rounded-full bg-brass text-[#0B0B0B] font-playfair text-lg font-bold flex items-center justify-center">
                    {item.step}
                  </div>
                  {i < 3 && <div className="w-0.5 h-8 bg-off-white/20 mt-1" />}
                </div>
                <div className="pb-4">
                  <h3 className="font-archivo font-bold text-off-white mb-1">{item.title}</h3>
                  <p className="text-sm text-off-white/70 leading-relaxed font-archivo">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== REGISTER ===== */}
      <section className="py-20 px-4 bg-off-white">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Get In Touch
          </p>
          <h2 className="font-playfair text-[2.8rem] font-black text-deep-blue leading-tight mb-8">
            Register Your Interest
          </h2>
          <RegisterInterestForm type="lender" />
        </div>
      </section>
    </>
  );
}
