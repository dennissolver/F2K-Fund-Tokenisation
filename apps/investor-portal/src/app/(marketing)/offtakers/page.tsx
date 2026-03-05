import RegisterInterestForm from "@/components/RegisterInterestForm";

export default function OfftakersPage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="bg-deep-blue text-off-white min-h-[60vh] flex items-center justify-center relative overflow-hidden px-4 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_85%,rgba(184,66,15,0.12)_0%,transparent_50%),radial-gradient(ellipse_at_85%_15%,rgba(200,168,78,0.08)_0%,transparent_50%)]" />
        <div className="relative z-10 max-w-[900px] text-center">
          <p className="font-ibm-mono text-[0.75rem] tracking-[0.5em] uppercase text-ember mb-8">
            Stabilised Asset Acquisition
          </p>
          <h1 className="font-playfair text-[clamp(2.8rem,7vw,5rem)] font-black leading-[1] mb-6">
            Lease-Backed Assets.
            <br />
            <em className="text-brass">National Pipeline.</em>
          </h1>
          <p className="font-archivo text-lg text-off-white/80 max-w-[700px] mx-auto leading-relaxed">
            Acquire newly built, tenanted housing with 10-year government and employer
            leases already in place. Predictable income from day one, with no construction
            legacy.
          </p>
        </div>
      </section>

      {/* ===== THE ASSET ===== */}
      <section className="py-20 px-4 bg-off-white">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            The Asset
          </p>
          <h2 className="font-playfair text-[2.8rem] font-black text-deep-blue leading-tight mb-8">
            What You&apos;re Buying
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "New-Build Modular", text: "Factory-built to NCC standards. No construction defects, no remediation risk. Consistent quality across every dwelling." },
              { title: "10-Year Take-or-Pay", text: "Government departments and employers commit to 10-year leases with take-or-pay provisions. Income certainty regardless of vacancy." },
              { title: "Government/Employer Covenant", text: "Lease counterparties are state governments, federal agencies, and large employers — institutional-grade credit quality." },
              { title: "Clean SPV Transfer", text: "You acquire the SPV entity with the asset and lease already in place. No construction legacy, no development risk, no residual liability." },
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

      {/* ===== DEAL MECHANICS ===== */}
      <section className="py-20 px-4 bg-warm-grey">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Deal Mechanics
          </p>
          <h2 className="font-playfair text-[2.8rem] font-black text-deep-blue leading-tight mb-8">
            Build → Stabilise → Transfer
          </h2>

          <div className="space-y-0">
            {[
              { step: "1", title: "F2K Builds & Leases", desc: "The F2K Housing Fund finances construction through a ring-fenced SPV. Housing is delivered and leased to government or employer tenants under 10-year take-or-pay agreements." },
              { step: "2", title: "Asset Stabilised", desc: "Once leases are operational and income is flowing, the asset is classified as stabilised — a tenanted, income-producing entity ready for institutional ownership." },
              { step: "3", title: "SPV Sold to You", desc: "The SPV is transferred as a clean entity. You acquire the asset, the lease, and the income stream. No construction history. No development risk. Clean title." },
            ].map((item, i) => (
              <div key={item.step} className="flex gap-4 items-start">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-12 h-12 rounded-full bg-deep-blue text-brass font-playfair text-lg font-bold flex items-center justify-center">
                    {item.step}
                  </div>
                  {i < 2 && <div className="w-0.5 h-8 bg-black/10 mt-1" />}
                </div>
                <div className="pb-4">
                  <h3 className="font-archivo font-bold text-deep-blue mb-1">{item.title}</h3>
                  <p className="text-sm text-slate leading-relaxed font-archivo">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BUYER PROFILES ===== */}
      <section className="py-20 px-4 bg-off-white">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Buyer Profiles
          </p>
          <h2 className="font-playfair text-[2.8rem] font-black text-deep-blue leading-tight mb-8">
            Who Buys Stabilised Assets
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "REITs", text: "Listed and unlisted real estate investment trusts seeking yield-backed residential assets with long-term lease security." },
              { title: "Community Housing Providers", text: "CHPs acquiring social and affordable housing stock with government-backed lease income to support their portfolios." },
              { title: "Private Fund Managers", text: "Private real estate funds seeking core-plus residential exposure with predictable, government-backed income." },
              { title: "Superannuation Funds", text: "Australian super funds looking for inflation-linked, long-duration residential assets aligned with ESG mandates." },
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

      {/* ===== REGISTER ===== */}
      <section className="py-20 px-4 bg-off-white">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Get In Touch
          </p>
          <h2 className="font-playfair text-[2.8rem] font-black text-deep-blue leading-tight mb-8">
            Register Your Interest
          </h2>
          <RegisterInterestForm type="offtaker" />
        </div>
      </section>
    </>
  );
}
