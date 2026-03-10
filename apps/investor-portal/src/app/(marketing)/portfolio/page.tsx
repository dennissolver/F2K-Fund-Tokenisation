const statusColors: Record<string, string> = {
  "In Development": "bg-ember/10 text-ember",
  "Under Construction": "bg-blue-100 text-blue-700",
  "Tendering": "bg-brass/20 text-brass",
  "Completed": "bg-forest/10 text-forest",
  "Pipeline": "bg-slate/10 text-slate",
};

const projects = [
  {
    name: "Branscombe Estate",
    location: "122–124 Branscombe Road, Claremont TAS 7011",
    state: "TAS",
    type: "Residential Homes",
    dwellings: "37",
    status: "In Development",
    value: null,
    construction: "Designed by Unison",
    partner: null,
    desc: "37 architecturally designed, single-storey 3-bedroom, 2-bathroom homes on an approved subdivision 8km from Hobart CBD. Five house types (104–114m²), 7 Star Energy rated, with full planning approval (PLN-21-408.02).",
    href: "/projects/branscombe-estate",
  },
  {
    name: "Seafields Estate",
    location: "Pepper Gate, Waggrakine WA 6530",
    state: "WA",
    type: "Residential Subdivision",
    dwellings: "141 lots",
    status: "In Development",
    value: "~$21M GRV",
    construction: "Modular H&L + Bare Land",
    partner: "Humfrey Land Developments",
    desc: "141-lot residential subdivision 8km north of Geraldton CBD. Available as bare serviced land ($130K–$160K) or house & land packages (~$600K) with F2K modular build. Anchored by $188M Geraldton Health Campus redevelopment driving WACHS staff accommodation demand.",
    href: "/projects/seafields-estate",
  },
];

const stats = [
  { label: "Target Fund Size", value: "$600M" },
  { label: "Target Dwellings", value: "4,000+" },
  { label: "States Active", value: "All" },
  { label: "Construction Method", value: "Modular / MMC" },
];

export default function PortfolioPage() {
  const activeProjects = projects.filter((p) => p.status !== "Completed");
  const completedProjects = projects.filter((p) => p.status === "Completed");

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="bg-deep-blue text-off-white py-20 px-4">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Fund Portfolio
          </p>
          <h1 className="font-playfair text-[clamp(2.5rem,5vw,4rem)] font-black leading-tight mb-6">
            Our Projects
          </h1>
          <p className="text-lg text-off-white/70 leading-relaxed font-archivo max-w-[750px]">
            The F2K Housing Token fund invests in modular housing projects
            across Australia — social housing, affordable housing, NDIS SDA,
            and build-to-rent. Each project is delivered through a dedicated
            SPV using modern methods of construction.
          </p>
        </div>
      </section>

      {/* ===== FUND STATS ===== */}
      <section className="py-12 px-4 bg-warm-grey">
        <div className="max-w-[900px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white p-5 border border-black/5 text-center">
                <p className="font-playfair text-2xl font-black text-deep-blue mb-1">
                  {s.value}
                </p>
                <p className="font-ibm-mono text-[0.6rem] tracking-[0.2em] uppercase text-slate/60">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW PROJECTS ARE STRUCTURED ===== */}
      <section className="py-16 px-4 bg-off-white">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-6">
            Fund Structure
          </p>
          <h2 className="font-playfair text-[2rem] font-black text-deep-blue leading-tight mb-8">
            How Projects Are Structured
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "SPV",
                title: "Dedicated Entity",
                desc: "Each project sits in its own Special Purpose Vehicle (SPV) under the fund. Ring-fenced risk, clean governance, separate contracts.",
              },
              {
                step: "MMC",
                title: "Modular Delivery",
                desc: "F2K matches the project to the optimal manufacturer — Australian fabricators or Asian module producers — based on spec, cost, and timeline.",
              },
              {
                step: "ROI",
                title: "Investor Returns",
                desc: "Project revenues flow back to the fund. Investors receive quarterly distributions pro-rata to their F2K-HT token holdings.",
              },
            ].map((s) => (
              <div key={s.step} className="bg-white p-6 border border-black/5">
                <div className="h-9 w-9 bg-ember/10 flex items-center justify-center font-ibm-mono text-[0.6rem] font-bold text-ember tracking-wider mb-3">
                  {s.step}
                </div>
                <h3 className="font-archivo font-bold text-deep-blue mb-1">
                  {s.title}
                </h3>
                <p className="text-sm text-slate leading-relaxed font-archivo">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ACTIVE PROJECTS ===== */}
      <section className="py-16 px-4 bg-warm-grey">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-6">
            Current Pipeline
          </p>
          <h2 className="font-playfair text-[2rem] font-black text-deep-blue leading-tight mb-8">
            Active &amp; Pipeline Projects
          </h2>

          <div className="space-y-4">
            {activeProjects.map((p) => (
              <div
                key={p.name}
                className="bg-white border border-black/5 p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-archivo font-bold text-deep-blue text-lg">
                      {p.name}
                    </h3>
                    {p.location !== "TBA" && (
                      <p className="text-sm text-slate/60 font-archivo">
                        {p.location}
                      </p>
                    )}
                  </div>
                  <span
                    className={`font-ibm-mono text-[0.6rem] tracking-wider uppercase px-3 py-1 shrink-0 ${
                      statusColors[p.status] || "bg-slate/10 text-slate"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                <p className="text-sm text-slate leading-relaxed font-archivo mb-4">
                  {p.desc}
                </p>

                {(p.dwellings || p.type || p.construction || p.value) && (
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-ibm-mono uppercase tracking-wider mb-4">
                    {p.type && (
                      <span>
                        <span className="text-slate/40">Type </span>
                        <span className="text-deep-blue">{p.type}</span>
                      </span>
                    )}
                    {p.dwellings && (
                      <span>
                        <span className="text-slate/40">Dwellings </span>
                        <span className="text-deep-blue">{p.dwellings}</span>
                      </span>
                    )}
                    {p.construction && (
                      <span>
                        <span className="text-slate/40">Method </span>
                        <span className="text-deep-blue">{p.construction}</span>
                      </span>
                    )}
                    {p.value && (
                      <span>
                        <span className="text-slate/40">Value </span>
                        <span className="text-deep-blue">{p.value}</span>
                      </span>
                    )}
                    {p.partner && (
                      <span>
                        <span className="text-slate/40">Partner </span>
                        <span className="text-deep-blue">{p.partner}</span>
                      </span>
                    )}
                  </div>
                )}

                {p.href && (
                  <a
                    href={p.href}
                    className="inline-block bg-[#00B5AD] hover:bg-[#009E97] text-white px-5 py-2 font-archivo font-semibold text-sm transition-colors"
                  >
                    View Project &amp; Register Interest &rarr;
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMPLETED PROJECTS ===== */}
      {completedProjects.length > 0 && (
        <section className="py-16 px-4 bg-off-white">
          <div className="max-w-[900px] mx-auto">
            <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-forest mb-6">
              Delivered
            </p>
            <h2 className="font-playfair text-[2rem] font-black text-deep-blue leading-tight mb-8">
              Completed Projects
            </h2>

            <div className="space-y-4">
              {completedProjects.map((p) => (
                <div
                  key={p.name}
                  className="bg-white border border-black/5 p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-archivo font-bold text-deep-blue text-lg">
                        {p.name}
                      </h3>
                      <p className="text-sm text-slate/60 font-archivo">
                        {p.location}, {p.state}
                      </p>
                    </div>
                    <span className="font-ibm-mono text-[0.6rem] tracking-wider uppercase px-3 py-1 shrink-0 bg-forest/10 text-forest">
                      Completed
                    </span>
                  </div>
                  <p className="text-sm text-slate leading-relaxed font-archivo mb-4">
                    {p.desc}
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-ibm-mono uppercase tracking-wider">
                    {p.type && (
                      <span>
                        <span className="text-slate/40">Type </span>
                        <span className="text-deep-blue">{p.type}</span>
                      </span>
                    )}
                    {p.dwellings && (
                      <span>
                        <span className="text-slate/40">Dwellings </span>
                        <span className="text-deep-blue">{p.dwellings}</span>
                      </span>
                    )}
                    {p.construction && (
                      <span>
                        <span className="text-slate/40">Method </span>
                        <span className="text-deep-blue">{p.construction}</span>
                      </span>
                    )}
                    {p.value && (
                      <span>
                        <span className="text-slate/40">Value </span>
                        <span className="text-deep-blue">{p.value}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTAs ===== */}
      <section className="py-16 px-4 bg-deep-blue text-off-white">
        <div className="max-w-[900px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-white/10 p-8">
              <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-3">
                Promoters
              </p>
              <h3 className="font-playfair text-xl font-black text-off-white mb-3">
                Have a Project?
              </h3>
              <p className="text-sm text-off-white/60 font-archivo leading-relaxed mb-4">
                If you have a qualifying housing project — 10+ dwellings,
                modular-ready, land secured — submit it for assessment.
              </p>
              <a
                href="/projects#submit-project"
                className="inline-block bg-ember hover:bg-ember/90 text-white px-6 py-2 font-archivo font-semibold text-sm transition-colors"
              >
                Submit a Project
              </a>
            </div>
            <div className="border border-white/10 p-8">
              <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-brass mb-3">
                Investors
              </p>
              <h3 className="font-playfair text-xl font-black text-off-white mb-3">
                Invest in the Fund
              </h3>
              <p className="text-sm text-off-white/60 font-archivo leading-relaxed mb-4">
                Wholesale investors can subscribe to F2K-HT tokens and receive
                quarterly distributions from the project portfolio.
              </p>
              <a
                href="/invest"
                className="inline-block bg-brass hover:bg-brass/90 text-deep-blue px-6 py-2 font-archivo font-semibold text-sm transition-colors"
              >
                Apply to Invest
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
