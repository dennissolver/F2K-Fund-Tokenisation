import RegisterInterestForm from "@/components/RegisterInterestForm";

export default function GovernmentPage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="bg-deep-blue text-off-white min-h-[60vh] flex items-center justify-center relative overflow-hidden px-4 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_85%,rgba(184,66,15,0.12)_0%,transparent_50%),radial-gradient(ellipse_at_85%_15%,rgba(200,168,78,0.08)_0%,transparent_50%)]" />
        <div className="relative z-10 max-w-[900px] text-center">
          <p className="font-ibm-mono text-[0.75rem] tracking-[0.5em] uppercase text-ember mb-8">
            Government &amp; Employer Tenants
          </p>
          <h1 className="font-playfair text-[clamp(2.8rem,7vw,5rem)] font-black leading-[1] mb-6">
            Zero Capital Outlay.
            <br />
            <em className="text-brass">Housing When You Need It.</em>
          </h1>
          <p className="font-archivo text-lg text-off-white/80 max-w-[700px] mx-auto leading-relaxed">
            New modular housing delivered under 10-year operating leases. No capital
            procurement. No construction risk. From factory to key handover in 14-16 weeks.
          </p>
        </div>
      </section>

      {/* ===== THE PROBLEM ===== */}
      <section className="py-20 px-4 bg-off-white">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            The Problem
          </p>
          <h2 className="font-playfair text-[2.8rem] font-black text-deep-blue leading-tight mb-8">
            Your Staff Need Housing. Yesterday.
          </h2>
          <div className="space-y-4 font-archivo text-slate leading-relaxed">
            <p>
              Regional staff — teachers, nurses, police, mine workers — can&apos;t find
              housing. Vacancy rates below 1% across regional Australia make recruitment
              and retention nearly impossible.
            </p>
            <p>
              Capital procurement is slow, complex, and politically fraught. Budget cycles
              don&apos;t align with housing urgency. Traditional construction takes 12-18
              months and faces labour shortages, cost overruns, and supply chain delays.
            </p>
            <p>
              Remote and Aboriginal communities face even greater challenges — extreme costs,
              logistical complexity, and the need for culturally appropriate design.
            </p>
          </div>
        </div>
      </section>

      {/* ===== THE SOLUTION ===== */}
      <section className="py-20 px-4 bg-warm-grey">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            The Solution
          </p>
          <h2 className="font-playfair text-[2.8rem] font-black text-deep-blue leading-tight mb-8">
            Operating Lease, Not Capital Procurement
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 border border-black/5">
              <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-red-500 mb-3">
                Traditional Procurement
              </p>
              <ul className="space-y-3 font-archivo text-sm text-slate">
                <li className="flex gap-2"><span className="text-red-400 shrink-0">x</span> Capital budget approval required</li>
                <li className="flex gap-2"><span className="text-red-400 shrink-0">x</span> 12-18 month construction timeline</li>
                <li className="flex gap-2"><span className="text-red-400 shrink-0">x</span> Construction risk on your balance sheet</li>
                <li className="flex gap-2"><span className="text-red-400 shrink-0">x</span> Builder insolvency exposure</li>
                <li className="flex gap-2"><span className="text-red-400 shrink-0">x</span> Ongoing maintenance responsibility</li>
              </ul>
            </div>
            <div className="bg-white p-8 border border-ember/30">
              <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-ember mb-3">
                F2K Operating Lease
              </p>
              <ul className="space-y-3 font-archivo text-sm text-slate">
                <li className="flex gap-2"><span className="text-ember shrink-0">&#10003;</span> Operating lease — no capital outlay</li>
                <li className="flex gap-2"><span className="text-ember shrink-0">&#10003;</span> 14-16 week factory-to-key delivery</li>
                <li className="flex gap-2"><span className="text-ember shrink-0">&#10003;</span> Zero construction risk for you</li>
                <li className="flex gap-2"><span className="text-ember shrink-0">&#10003;</span> NCC-compliant, new-build quality</li>
                <li className="flex gap-2"><span className="text-ember shrink-0">&#10003;</span> Maintenance included in lease terms</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 px-4 bg-off-white">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            How It Works
          </p>
          <h2 className="font-playfair text-[2.8rem] font-black text-deep-blue leading-tight mb-8">
            Four Steps to Housing
          </h2>

          <div className="space-y-0">
            {[
              { step: "1", title: "Identify Your Need", desc: "Tell us how many dwellings, where, and when. We assess feasibility and match the right modular solution to your requirements." },
              { step: "2", title: "F2K Designs & Delivers", desc: "We select the best-fit manufacturer, manage NCC compliance, coordinate logistics, and deliver housing from factory to site in 14-16 weeks." },
              { step: "3", title: "Sign the Lease", desc: "You sign a 10-year take-or-pay operating lease. No capital outlay. Housing appears as an operating expense, not a capital liability." },
              { step: "4", title: "Housing Maintained", desc: "Ongoing maintenance and lifecycle management is handled as part of the lease arrangement. Your staff have housing. You focus on service delivery." },
            ].map((item, i) => (
              <div key={item.step} className="flex gap-4 items-start">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-12 h-12 rounded-full bg-deep-blue text-brass font-playfair text-lg font-bold flex items-center justify-center">
                    {item.step}
                  </div>
                  {i < 3 && <div className="w-0.5 h-8 bg-warm-grey mt-1" />}
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

      {/* ===== USE CASES ===== */}
      <section className="bg-deep-blue text-off-white py-20 px-4">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-brass mb-4">
            Use Cases
          </p>
          <h2 className="font-playfair text-[2.8rem] font-black text-off-white leading-tight mb-8">
            Who This Is For
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Government Regional Staff",
                text: "Housing for teachers, nurses, police, and public servants posted to regional and remote communities. State and territory departments commit to 10-year leases.",
              },
              {
                title: "Employer Workforces",
                text: "Housing for mining, agriculture, and infrastructure workforces in areas where private rental supply is inadequate. Employers guarantee occupancy.",
              },
              {
                title: "Aboriginal Communities",
                text: "Culturally appropriate housing for remote Aboriginal communities. Designed in consultation with community, built in factory, delivered to site. Cyclone and bushfire rated.",
              },
              {
                title: "Emergency & Disaster",
                text: "Rapid-deployment housing for disaster recovery and emergency accommodation. Factory-built modules can be delivered within weeks, not months.",
              },
            ].map((card) => (
              <div key={card.title} className="border border-off-white/10 p-8">
                <h3 className="font-archivo text-sm font-bold text-brass uppercase tracking-wide mb-3">
                  {card.title}
                </h3>
                <p className="text-sm text-off-white/70 leading-relaxed font-archivo">{card.text}</p>
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
          <RegisterInterestForm type="government" />
        </div>
      </section>
    </>
  );
}
