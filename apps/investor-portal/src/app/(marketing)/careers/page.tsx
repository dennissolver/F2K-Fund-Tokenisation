import CareerInterestForm from "@/components/CareerInterestForm";

const openPositions = [
  {
    priority: "Wave 1",
    entity: "F2K Housing Trustee",
    roles: [
      {
        title: "Responsible Manager #2",
        salary: "Board appointment or $80-120k",
        location: "National",
        type: "Regulatory requirement",
        desc: "AFSL requires minimum 2 Responsible Managers. Must meet RG 105 requirements — financial services experience, fit and proper. This appointment unblocks the entire AFSL application.",
        requirements: [
          "RG 105 compliant — fit and proper person assessment",
          "Minimum 5 years financial services experience",
          "Understanding of managed investment schemes",
          "Experience with ASIC regulatory requirements",
        ],
      },
      {
        title: "Compliance Officer",
        salary: "$24-48k/yr (PT consultant) or $100-140k (FT)",
        location: "National",
        type: "Part-time initially",
        desc: "Owns the AML/CTF program, AFSL compliance conditions, AUSTRAC reporting, and suspicious matter reporting. Can start as part-time consultant and transition to full-time as the fund scales.",
        requirements: [
          "AML/CTF program design and management experience",
          "AUSTRAC reporting and compliance",
          "AFSL compliance arrangements",
          "Digital assets / blockchain familiarity preferred",
        ],
      },
    ],
  },
  {
    priority: "Wave 1",
    entity: "Board of Directors",
    roles: [
      {
        title: "Chair — Board of Directors",
        salary: "Board fees",
        location: "National",
        type: "Non-executive",
        desc: "Portfolio chairman providing governance oversight across all F2K group entities — the Trustee, Investment Manager (Development and Social Housing Divisions), and Operating Company. Sets strategic direction, chairs the board, and ensures alignment between fund performance, housing delivery, and regulatory compliance across all components.",
        requirements: [
          "Proven board chair or senior non-executive director experience across multi-entity group structures",
          "Understanding of managed investment schemes, fund governance, or financial services regulation",
          "Strategic leadership across construction, infrastructure, or housing sectors",
          "Government and institutional stakeholder relationships at senior level",
          "Experience with high-growth organisations scaling across multiple divisions",
        ],
      },
      {
        title: "Independent Director — Financial Services",
        salary: "Board fees",
        location: "National",
        type: "Non-executive",
        desc: "AFSL experience at board level. May dual-hat as Responsible Manager #2. Strengthens the AFSL application and provides financial services governance oversight.",
        requirements: [
          "AFSL holder or senior experience with AFSL-regulated entities",
          "Fund management, trustee, or investment management background",
          "Understanding of tokenised or digital asset financial products",
          "Board governance experience in financial services",
        ],
      },
      {
        title: "Independent Director — Construction",
        salary: "Board fees",
        location: "National",
        type: "Non-executive",
        desc: "Construction and manufacturing expertise at board level. Provides oversight of the Development Division and Social Housing Division delivery operations.",
        requirements: [
          "Senior experience in construction, manufacturing, or modular/prefab housing",
          "Understanding of Australian building codes and state specification frameworks",
          "Government procurement experience preferred",
          "Board governance experience",
        ],
      },
    ],
  },
  {
    priority: "Wave 1",
    entity: "F2K Housing Management — Social Housing Division",
    roles: [
      {
        title: "Head of Social Housing",
        salary: "$220,000 - $260,000",
        location: "National (travel required)",
        type: "Full-time",
        desc: "The pivotal hire. Leads the entire integrator arm — government relationships, procurement strategy, manufacturer coordination, and delivery oversight for all social housing programs across all states. This person builds the revenue engine.",
        requirements: [
          "10+ years in social housing delivery — state housing authority, Housing Australia, or CHP experience",
          "Government stakeholder relationships across multiple state housing agencies",
          "Understanding of modular/prefabricated construction and the manufacturer landscape",
          "Tender writing and government procurement process expertise",
          "Team leadership — builds and manages the specialist social housing team",
          "Shares the urgency — this is a national emergency and F2K exists to help solve it",
        ],
      },
      {
        title: "Head of Indigenous Housing",
        salary: "$200,000 - $240,000",
        location: "National (NT/WA focus, travel required)",
        type: "Full-time",
        desc: "Leads F2K's Indigenous housing programs across remote, regional, and urban communities. Critical for credibility with NT/WA Aboriginal housing programs and government stakeholder trust. This appointment signals F2K's commitment to community-led housing delivery and ensures culturally appropriate design, procurement, and engagement across all Indigenous housing projects.",
        requirements: [
          "Deep connection to Aboriginal and Torres Strait Islander communities",
          "Experience in social housing, community housing, or Indigenous affairs",
          "Government stakeholder relationships across multiple jurisdictions — particularly NT and WA housing agencies",
          "Understanding of remote community housing challenges, land tenure, and cultural design requirements",
          "Experience with Indigenous procurement policies and community consultation processes",
          "Senior leadership experience in housing delivery or community development",
        ],
      },
    ],
  },
  {
    priority: "Wave 2",
    entity: "F2K Housing Management — Social Housing Division",
    roles: [
      {
        title: "Manufacturer Relations Manager",
        salary: "$150,000 - $180,000",
        location: "National (travel to Australian and Asian manufacturers)",
        type: "Full-time",
        desc: "Manages the entire manufacturer supply chain — the core of F2K's impartial integrator model. Identifies, pre-qualifies, and manages relationships with Australian fabricators and Asian module/component producers.",
        requirements: [
          "Supply chain management experience in construction or manufacturing",
          "Understanding of NCC and state specification requirements",
          "Experience with factory inspection and quality assurance programs",
          "International supplier management (Asian manufacturers preferred)",
          "Transport and logistics coordination experience",
        ],
      },
      {
        title: "Compliance & QA Manager",
        salary: "$140,000 - $170,000",
        location: "National (travel to factories and sites)",
        type: "Full-time",
        desc: "Owns the specification compliance framework across all state programs. Deep knowledge of every state's design briefs, construction specifications, and approval requirements. This is the function that makes F2K indispensable.",
        requirements: [
          "Mastery of state specification frameworks — WA DHW, NCC, QBuild, Homes NSW",
          "Experience with prototype management and design review processes",
          "Wind region compliance and cyclone-rated construction knowledge",
          "Hold-point inspections and fabrication QA experience",
          "Defect rectification and warranty management",
        ],
      },
    ],
  },
];

export default function CareersPage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="bg-deep-blue text-off-white py-20 px-4">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Join F2K
          </p>
          <h1 className="font-playfair text-[clamp(2.5rem,5vw,4rem)] font-black leading-tight mb-6">
            Key Positions
          </h1>
          <p className="text-lg text-off-white/70 leading-relaxed font-archivo max-w-[750px]">
            F2K is assembling the leadership team to build Australia&apos;s
            national housing integrator. We are recruiting globally for peak
            positions across the fund, the board, and the social housing
            delivery arm. If you have the experience and share the urgency, we
            want to hear from you.
          </p>
        </div>
      </section>

      {/* ===== CASCADE ===== */}
      <section className="py-10 px-4 bg-warm-grey">
        <div className="max-w-[900px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                wave: "Wave 1",
                timing: "Immediate",
                desc: "Regulatory requirements + revenue engine. These roles unblock the AFSL application and win government contracts.",
                count: "6 positions",
                color: "ember",
              },
              {
                wave: "Wave 2",
                timing: "Months 4-9",
                desc: "Delivery capability. Once Head of Social Housing is in, they recruit specialist functions.",
                count: "2 positions",
                color: "brass",
              },
              {
                wave: "Wave 3",
                timing: "Months 10-18",
                desc: "Scale. Field staff and state expansion — self-funding from project management fees.",
                count: "As contracts won",
                color: "forest",
              },
            ].map((w) => (
              <div key={w.wave} className="bg-white p-6 border border-black/5 relative">
                <div
                  className={`absolute top-0 left-0 right-0 h-[3px] ${
                    w.color === "ember"
                      ? "bg-ember"
                      : w.color === "brass"
                        ? "bg-brass"
                        : "bg-forest"
                  }`}
                />
                <div className="flex items-center justify-between mb-2">
                  <p
                    className={`font-ibm-mono text-[0.65rem] tracking-wider uppercase font-semibold ${
                      w.color === "ember"
                        ? "text-ember"
                        : w.color === "brass"
                          ? "text-brass"
                          : "text-forest"
                    }`}
                  >
                    {w.wave}
                  </p>
                  <span className="font-ibm-mono text-[0.6rem] text-slate/50 uppercase tracking-wider">
                    {w.timing}
                  </span>
                </div>
                <p className="text-sm text-slate leading-relaxed font-archivo mb-3">
                  {w.desc}
                </p>
                <p className="font-archivo font-bold text-deep-blue text-sm">
                  {w.count}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== POSITIONS ===== */}
      <section className="py-20 px-4 bg-off-white">
        <div className="max-w-[900px] mx-auto space-y-12">
          {openPositions.map((group) => (
            <div key={`${group.priority}-${group.entity}`}>
              <div className="flex items-center gap-3 mb-6">
                <span
                  className={`font-ibm-mono text-[0.6rem] tracking-wider uppercase px-3 py-1 ${
                    group.priority === "Wave 1"
                      ? "bg-ember text-white"
                      : "bg-brass text-deep-blue"
                  }`}
                >
                  {group.priority}
                </span>
                <h3 className="font-archivo font-bold text-deep-blue text-sm uppercase tracking-wide">
                  {group.entity}
                </h3>
              </div>

              <div className="space-y-4">
                {group.roles.map((role) => (
                  <details
                    key={role.title}
                    className="bg-white border border-black/5 group"
                  >
                    <summary className="p-6 cursor-pointer list-none flex items-start justify-between gap-4 hover:bg-warm-grey/30 transition-colors">
                      <div>
                        <h4 className="font-archivo font-bold text-deep-blue text-lg mb-1">
                          {role.title}
                        </h4>
                        <div className="flex flex-wrap gap-3 text-xs font-ibm-mono uppercase tracking-wider">
                          <span className="text-ember">{role.salary}</span>
                          <span className="text-slate/50">|</span>
                          <span className="text-slate/60">{role.location}</span>
                          <span className="text-slate/50">|</span>
                          <span className="text-slate/60">{role.type}</span>
                        </div>
                      </div>
                      <span className="text-ember shrink-0 mt-1 font-archivo text-sm group-open:rotate-45 transition-transform">
                        +
                      </span>
                    </summary>
                    <div className="px-6 pb-6 border-t border-black/5 pt-4">
                      <p className="text-sm text-slate leading-relaxed font-archivo mb-4">
                        {role.desc}
                      </p>
                      <h5 className="font-archivo font-semibold text-deep-blue text-sm mb-2">
                        Requirements
                      </h5>
                      <ul className="space-y-1">
                        {role.requirements.map((req) => (
                          <li
                            key={req}
                            className="text-sm text-slate/80 font-archivo flex items-start gap-2"
                          >
                            <span className="text-ember mt-0.5 shrink-0">
                              &rarr;
                            </span>
                            {req}
                          </li>
                        ))}
                      </ul>
                      <a
                        href="#express-interest"
                        className="inline-block mt-4 bg-ember hover:bg-ember/90 text-white px-6 py-2 font-archivo font-semibold text-sm transition-colors"
                      >
                        Express Interest
                      </a>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CRITICAL HIRE CALLOUT ===== */}
      <section className="py-16 px-4 bg-deep-blue text-off-white">
        <div className="max-w-[900px] mx-auto">
          <div className="border border-ember/30 bg-ember/10 p-8 md:p-12">
            <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
              The Critical First Hire
            </p>
            <h2 className="font-playfair text-[2rem] font-black text-off-white leading-tight mb-4">
              Head of Social Housing
            </h2>
            <p className="text-base text-off-white/70 leading-relaxed font-archivo mb-4">
              Everything hinges on this person. The ideal candidate has 10+
              years in social housing delivery, has become frustrated with the
              pace of change from inside government, and wants to drive it from
              the private sector. They understand why modular hasn&apos;t scaled
              &mdash; fragmented supply chains, state silos, compliance
              complexity &mdash; and they see the Central Integrator model as
              the answer.
            </p>
            <p className="text-base text-off-white/70 leading-relaxed font-archivo">
              This hire builds the rest. The manufacturer network, the
              compliance framework, the government relationships, the tender
              pipeline &mdash; it all flows from this appointment.
            </p>
            <a
              href="#express-interest"
              className="inline-block mt-6 bg-ember hover:bg-ember/90 text-white px-8 py-3 font-archivo font-semibold transition-colors"
            >
              Express Interest for This Role
            </a>
          </div>
        </div>
      </section>

      {/* ===== FORM ===== */}
      <section id="express-interest" className="py-20 px-4 bg-off-white">
        <div className="max-w-[700px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Register Your Interest
          </p>
          <h2 className="font-playfair text-[2.8rem] font-black text-deep-blue leading-tight mb-4">
            Express Interest
          </h2>
          <p className="text-lg text-slate leading-relaxed font-archivo mb-8">
            We are recruiting globally. If you have the experience and share the
            urgency of solving Australia&apos;s housing crisis through modern
            methods of construction, submit your expression of interest below.
          </p>
          <CareerInterestForm />
        </div>
      </section>
    </>
  );
}
