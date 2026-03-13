export default function StructurePage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="bg-deep-blue text-off-white py-20 px-4">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Corporate Structure
          </p>
          <h1 className="font-playfair text-[clamp(2.5rem,5vw,4rem)] font-black leading-tight mb-6">
            Entity &amp; Governance Framework
          </h1>
          <p className="text-lg text-off-white/70 leading-relaxed font-archivo max-w-[750px]">
            F2K operates through a regulated multi-entity structure that
            separates asset custody, investment management, and platform
            operations &mdash; with ring-fenced SPVs isolating project-level
            risk.
          </p>
        </div>
      </section>

      {/* ===== LEADERSHIP ===== */}
      <section className="py-20 px-4 bg-off-white">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Founding Leadership
          </p>
          <h2 className="font-playfair text-[2.8rem] font-black text-deep-blue leading-tight mb-10">
            The Team Building F2K
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {[
              {
                name: "Dennis McMahon",
                title: "National Programme Director",
                entities: [
                  "Director &amp; Responsible Manager — F2K Housing Trustee",
                  "Director — F2K Housing Management (Investment Manager)",
                  "Director — F2K Operating",
                ],
                desc: "Leads the national programme across both the Development Division and Social Housing Division. Responsible Manager #1 under the AFSL. Ultimate delivery accountability across the entire national portfolio.",
              },
              {
                name: "Uwe Jacobs",
                title: "Finance Director",
                entities: [
                  "Director — F2K Housing Trustee",
                  "Director — F2K Housing Management (Investment Manager)",
                  "Director — F2K Operating",
                ],
                desc: "Oversees all financial operations across the fund and operating entities. Government payment terms, multi-manufacturer payment coordination, grant modelling, project margin tracking, and foreign exchange management for Asian manufacturer payments.",
              },
            ].map((person) => (
              <div
                key={person.name}
                className="bg-white p-8 border border-black/5 relative"
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-ember" />
                <div className="w-16 h-16 rounded-full bg-deep-blue text-brass font-playfair text-xl font-bold flex items-center justify-center mb-4">
                  {person.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="font-archivo font-bold text-deep-blue text-lg">
                  {person.name}
                </h3>
                <p className="font-ibm-mono text-[0.65rem] tracking-wider uppercase text-ember mb-3">
                  {person.title}
                </p>
                <p className="text-sm text-slate leading-relaxed font-archivo mb-4">
                  {person.desc}
                </p>
                <div className="border-t border-black/5 pt-3">
                  <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-slate/60 mb-2">
                    Entity Roles
                  </p>
                  <ul className="space-y-1">
                    {person.entities.map((e) => (
                      <li
                        key={e}
                        className="text-xs text-slate/80 font-archivo"
                        dangerouslySetInnerHTML={{
                          __html: `<span class="text-ember mr-1">&rarr;</span> ${e}`,
                        }}
                      />
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ENTITY HIERARCHY ===== */}
      <section className="py-20 px-4 bg-warm-grey">
        <div className="max-w-[1000px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Legal Entities
          </p>
          <h2 className="font-playfair text-[2.8rem] font-black text-deep-blue leading-tight mb-4">
            Four Entities. Separated by Design.
          </h2>
          <p className="text-lg text-slate leading-relaxed mb-12 font-archivo max-w-[750px]">
            The entity that holds assets is separate from the entity making
            investment decisions, which is separate from the entity running the
            technology. Each project sits in its own SPV so one bad project
            cannot sink the fund.
          </p>

          {/* Entity cards */}
          <div className="space-y-6">
            {/* Board */}
            <div className="bg-deep-blue text-off-white p-8">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                <div>
                  <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-brass mb-1">
                    Governance
                  </p>
                  <h3 className="font-playfair text-xl font-bold">
                    Board of Directors
                  </h3>
                </div>
                <span className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-brass border border-brass/30 px-3 py-1">
                  Shared Across All Entities
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm font-archivo">
                {[
                  {
                    role: "Chair",
                    desc: "Oversight of all F2K fund structures and entities",
                    status: "Recruiting",
                  },
                  {
                    role: "Executive Director",
                    desc: "Dennis McMahon — National Programme Director",
                    status: "Active",
                  },
                  {
                    role: "Executive Director",
                    desc: "Uwe Jacobs — Finance Director",
                    status: "Active",
                  },
                  {
                    role: "Independent Director",
                    desc: "Financial Services / AFSL experience",
                    status: "Recruiting",
                  },
                  {
                    role: "Independent Director",
                    desc: "Construction / Manufacturing",
                    status: "Recruiting",
                  },
                ].map((d, i) => (
                  <div
                    key={i}
                    className="border border-off-white/10 p-4 flex flex-col"
                  >
                    <p className="text-brass font-semibold text-xs uppercase tracking-wide mb-1">
                      {d.role}
                    </p>
                    <p className="text-off-white/70 text-xs leading-relaxed flex-1">
                      {d.desc}
                    </p>
                    <span
                      className={`mt-2 inline-block text-[0.6rem] font-ibm-mono uppercase tracking-wider ${
                        d.status === "Active"
                          ? "text-green-400"
                          : "text-ember"
                      }`}
                    >
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-archivo text-off-white/50">
                <div className="border border-off-white/5 p-3">
                  Aboriginal Advisory Sub-Committee
                </div>
                <div className="border border-off-white/5 p-3">
                  Audit &amp; Risk Sub-Committee
                </div>
              </div>
            </div>

            {/* Trustee */}
            <div className="bg-white p-8 border border-black/5 relative">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-ember" />
              <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                <div>
                  <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-ember mb-1">
                    Peak Entity — Fill First
                  </p>
                  <h3 className="font-playfair text-xl font-bold text-deep-blue">
                    F2K Housing Trustee Pty Ltd
                  </h3>
                </div>
                <span className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-ember border border-ember/30 px-3 py-1">
                  AFSL Holder
                </span>
              </div>
              <p className="text-sm text-slate leading-relaxed font-archivo mb-6">
                Holds all fund assets on behalf of unit holders. Legal owner of
                everything in the fund. Fiduciary duty to investors. Governed by
                Trust Deed. The AFSL application is lodged through this entity.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    role: "Director & RM #1",
                    person: "Dennis McMahon",
                    status: "Active",
                  },
                  {
                    role: "Director",
                    person: "Uwe Jacobs",
                    status: "Active",
                  },
                  {
                    role: "Responsible Manager #2",
                    person: "AFSL-experienced — regulatory requirement",
                    status: "Recruiting",
                  },
                  {
                    role: "Compliance Officer",
                    person: "AML/CTF, AFSL conditions (PT consultant initially)",
                    status: "Recruiting",
                  },
                  {
                    role: "Fund Administrator",
                    person: "Outsource to Apex Group / Citco",
                    status: "Vendor Selection",
                  },
                  {
                    role: "Fund Accountant",
                    person: "Outsource initially — AI handles 80% of NAV calc",
                    status: "AI-Assisted",
                  },
                ].map((r, i) => (
                  <div
                    key={i}
                    className="border border-black/5 p-4 flex items-start justify-between gap-3"
                  >
                    <div>
                      <p className="font-archivo font-semibold text-deep-blue text-sm">
                        {r.role}
                      </p>
                      <p className="font-archivo text-xs text-slate/70 mt-0.5">
                        {r.person}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 text-[0.6rem] font-ibm-mono uppercase tracking-wider ${
                        r.status === "Active"
                          ? "text-green-600"
                          : r.status === "Recruiting"
                            ? "text-ember"
                            : "text-brass"
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Investment Manager */}
            <div className="bg-white p-8 border border-black/5 relative">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-brass" />
              <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                <div>
                  <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-brass mb-1">
                    Fill Second
                  </p>
                  <h3 className="font-playfair text-xl font-bold text-deep-blue">
                    F2K Housing Management Pty Ltd
                  </h3>
                </div>
                <span className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-brass border border-brass/30 px-3 py-1">
                  Investment Manager
                </span>
              </div>
              <p className="text-sm text-slate leading-relaxed font-archivo mb-6">
                Makes all investment decisions &mdash; which manufacturers to
                finance, asset allocation, risk management. Appointed by Trustee
                under Investment Management Agreement (IMA). Earns management
                fee + performance fee.
              </p>

              {/* Two divisions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Development */}
                <div className="border border-black/5 p-6">
                  <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-brass mb-2">
                    Development Division
                  </p>
                  <p className="text-xs text-slate font-archivo mb-4">
                    Existing V1.0 portfolio — WA, TAS, QLD commercial &amp;
                    residential projects.
                  </p>
                  <div className="space-y-2">
                    {[
                      "Dennis McMahon — National Programme Director",
                      "Uwe Jacobs — Finance Director",
                      "State PD — WA (existing)",
                      "State PD — TAS (existing)",
                      "State PD — QLD (existing)",
                      "Project Managers x 5-7",
                      "Site Supervisors x 6-8",
                    ].map((r) => (
                      <p
                        key={r}
                        className="text-xs font-archivo text-slate/80 border-b border-black/5 pb-1"
                      >
                        <span className="text-brass mr-1">&rarr;</span> {r}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Social Housing */}
                <div className="border border-ember/20 bg-ember/[0.02] p-6">
                  <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-ember mb-2">
                    Social Housing Division — New
                  </p>
                  <p className="text-xs text-slate font-archivo mb-4">
                    National Central Integrator — government social housing
                    delivery across all states. $70B+ addressable market.
                  </p>
                  <div className="space-y-2">
                    {[
                      {
                        role: "Head of Social Housing",
                        status: "Recruiting",
                        salary: "$220-260k",
                      },
                      {
                        role: "Manufacturer Relations Manager",
                        status: "Recruiting",
                        salary: "$150-180k",
                      },
                      {
                        role: "Compliance & QA Manager",
                        status: "Recruiting",
                        salary: "$140-170k",
                      },
                      {
                        role: "Government Procurement Manager",
                        status: "Year 2",
                        salary: "$130-160k",
                      },
                    ].map((r) => (
                      <div
                        key={r.role}
                        className="flex items-center justify-between text-xs font-archivo border-b border-ember/10 pb-1"
                      >
                        <span className="text-deep-blue font-semibold">
                          <span className="text-ember mr-1">&rarr;</span>{" "}
                          {r.role}
                        </span>
                        <span
                          className={`font-ibm-mono text-[0.55rem] uppercase tracking-wider ${
                            r.status === "Recruiting"
                              ? "text-ember"
                              : "text-slate/50"
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Entity */}
            <div className="bg-white p-8 border border-black/5 relative">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-forest" />
              <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                <div>
                  <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-forest mb-1">
                    Fill Third — AI-Native
                  </p>
                  <h3 className="font-playfair text-xl font-bold text-deep-blue">
                    F2K Operating Pty Ltd
                  </h3>
                </div>
                <span className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-forest border border-forest/30 px-3 py-1">
                  Platform &amp; Technology
                </span>
              </div>
              <p className="text-sm text-slate leading-relaxed font-archivo mb-6">
                Runs the tokenisation platform, KYC onboarding, admin console
                operations, and vendor management. Operational liability
                ring-fenced from fund assets. Designed AI-native &mdash; the
                platform self-operates for fund administration, compliance
                monitoring, NAV calculation, and reporting.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    role: "Director",
                    person: "Dennis McMahon",
                    status: "Active",
                  },
                  {
                    role: "Director",
                    person: "Uwe Jacobs",
                    status: "Active",
                  },
                  {
                    role: "Platform Operations Manager",
                    person: "When investor count >200",
                    status: "Year 2",
                  },
                ].map((r, i) => (
                  <div
                    key={i}
                    className="border border-black/5 p-4 flex items-start justify-between gap-3"
                  >
                    <div>
                      <p className="font-archivo font-semibold text-deep-blue text-sm">
                        {r.role}
                      </p>
                      <p className="font-archivo text-xs text-slate/70 mt-0.5">
                        {r.person}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 text-[0.6rem] font-ibm-mono uppercase tracking-wider ${
                        r.status === "Active"
                          ? "text-green-600"
                          : "text-slate/50"
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  "Investor Portal",
                  "Admin Console",
                  "Smart Contracts (ERC-3643)",
                  "Gnosis Safe Treasury",
                ].map((item) => (
                  <div
                    key={item}
                    className="border border-forest/10 bg-forest/[0.02] p-3 text-xs font-archivo text-slate text-center"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* SPVs */}
            <div className="bg-white p-8 border border-black/5 relative">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-slate/30" />
              <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                <div>
                  <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-slate/60 mb-1">
                    Created Per Project
                  </p>
                  <h3 className="font-playfair text-xl font-bold text-deep-blue">
                    Project SPVs (Special Purpose Vehicles)
                  </h3>
                </div>
              </div>
              <p className="text-sm text-slate leading-relaxed font-archivo mb-6">
                Each project sits in a ring-fenced Pty Ltd or Unit Trust.
                Directors: Dennis + 1 Independent. No dedicated staff &mdash;
                managed by the Investment Manager with Site Supervisors assigned
                from the state pool. Cost recovered from project management fees
                (10-15% of construction value).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    name: "F2K WA Modular Housing SPV No. 1",
                    assets:
                      "Manufacturer loan, property lien, equipment lease",
                  },
                  {
                    name: "F2K NT Aboriginal Housing SPV No. 2",
                    assets:
                      "Government contract, land lease, manufacturer note",
                  },
                  {
                    name: "SPV N...",
                    assets: "Created as projects are won",
                  },
                ].map((spv) => (
                  <div
                    key={spv.name}
                    className="border border-black/5 p-4 border-dashed"
                  >
                    <p className="font-archivo font-semibold text-deep-blue text-sm mb-1">
                      {spv.name}
                    </p>
                    <p className="font-archivo text-xs text-slate/60">
                      {spv.assets}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHY THIS STRUCTURE ===== */}
      <section className="py-20 px-4 bg-off-white">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Design Principles
          </p>
          <h2 className="font-playfair text-[2.8rem] font-black text-deep-blue leading-tight mb-10">
            Separation of Concerns
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                entity: "Trustee",
                purpose: "Holds assets, fiduciary duty",
                protection:
                  "Regulated under Corporations Act; AFSL holder; Trust Deed governs all operations",
              },
              {
                entity: "Investment Manager",
                purpose: "Makes investment decisions",
                protection:
                  "If the IM fails, assets are still held safely by the Trustee under Trust Deed",
              },
              {
                entity: "Operating Co",
                purpose: "Runs technology platform",
                protection:
                  "Operational liability ring-fenced from fund assets; replaceable without impacting fund",
              },
              {
                entity: "SPVs",
                purpose: "Isolate project risk",
                protection:
                  "If one project fails, other SPVs and the fund are protected; limited recourse",
              },
              {
                entity: "Gnosis Safe",
                purpose: "On-chain treasury control",
                protection:
                  "3-of-5 multisig prevents single-point-of-failure for all blockchain operations",
              },
              {
                entity: "Custodian",
                purpose: "Third-party key management",
                protection:
                  "Insurance-backed institutional custody; regulatory requirement for MIS operations",
              },
            ].map((item) => (
              <div key={item.entity} className="bg-white p-6 border border-black/5">
                <h3 className="font-archivo font-bold text-deep-blue text-sm uppercase tracking-wide mb-2">
                  {item.entity}
                </h3>
                <p className="text-xs text-ember font-ibm-mono uppercase tracking-wider mb-3">
                  {item.purpose}
                </p>
                <p className="text-sm text-slate leading-relaxed font-archivo">
                  {item.protection}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== AI-NATIVE ===== */}
      <section className="py-20 px-4 bg-deep-blue text-off-white">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-brass mb-4">
            AI-Native Operations
          </p>
          <h2 className="font-playfair text-[2.8rem] font-black text-off-white leading-tight mb-6">
            40% of Traditional Headcount
          </h2>
          <p className="text-lg text-off-white/70 leading-relaxed font-archivo mb-10">
            Every entity is designed AI-native. AI handles document drafting,
            compliance monitoring, NAV calculation, specification matching,
            tender response generation, logistics optimisation, and reporting.
            Human roles focus on relationships, judgement calls, regulatory
            sign-offs, and physical site presence.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                function: "Fund Admin & NAV",
                traditional: "2-3 staff",
                f2k: "0 (outsourced + AI calc)",
                ai: "NAV calculation, reconciliation, reporting",
              },
              {
                function: "Compliance & AML",
                traditional: "2-3 staff",
                f2k: "1 (PT consultant)",
                ai: "Transaction monitoring, sanctions screening, report generation",
              },
              {
                function: "Platform Operations",
                traditional: "3-5 staff",
                f2k: "0 (self-operating)",
                ai: "KYC queue, distribution calc, audit logs, monitoring",
              },
              {
                function: "Tender Writing",
                traditional: "2-3 staff",
                f2k: "0 (AI-assisted)",
                ai: "Draft generation, specification matching, compliance checklists",
              },
              {
                function: "Financial Reporting",
                traditional: "2-3 staff",
                f2k: "1 (Finance Director)",
                ai: "Automated reporting, margin tracking, FX monitoring",
              },
              {
                function: "Project Cost Tracking",
                traditional: "1 per project",
                f2k: "0 (AI per project)",
                ai: "Cost forecasting, schedule variance, milestone tracking",
              },
            ].map((row) => (
              <div
                key={row.function}
                className="border border-off-white/10 p-5"
              >
                <h4 className="font-archivo font-bold text-brass text-sm mb-3">
                  {row.function}
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs font-archivo mb-3">
                  <div>
                    <p className="text-off-white/40 uppercase tracking-wider mb-1">
                      Traditional
                    </p>
                    <p className="text-off-white/70">{row.traditional}</p>
                  </div>
                  <div>
                    <p className="text-off-white/40 uppercase tracking-wider mb-1">
                      F2K
                    </p>
                    <p className="text-brass">{row.f2k}</p>
                  </div>
                </div>
                <p className="text-xs text-off-white/50 font-archivo">
                  AI handles: {row.ai}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-ember/20 border border-ember/30 p-6 text-center">
            <p className="font-playfair text-2xl font-bold text-off-white mb-2">
              ~$1.5-2.5M / year saved
            </p>
            <p className="font-archivo text-sm text-off-white/70">
              12-17 traditional roles replaced by AI-native operations
            </p>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-ember text-white py-16 px-4 text-center">
        <div className="max-w-[700px] mx-auto">
          <h2 className="font-playfair text-[clamp(2rem,4vw,3rem)] font-black leading-tight mb-4">
            Join the Team Building F2K
          </h2>
          <p className="text-lg text-white/85 leading-relaxed font-archivo mb-8">
            We are recruiting globally for peak leadership positions. If you
            have the experience and share the urgency, we want to hear from you.
          </p>
          <a
            href="/careers"
            className="bg-white text-ember hover:bg-off-white px-8 py-3 font-archivo font-semibold transition-colors inline-block"
          >
            View Open Positions
          </a>
        </div>
      </section>
    </>
  );
}
