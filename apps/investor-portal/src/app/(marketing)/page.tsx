export default function MarketingHome() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="bg-deep-blue text-off-white min-h-[85vh] flex items-center justify-center relative overflow-hidden px-4 py-24">
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_85%,rgba(184,66,15,0.12)_0%,transparent_50%),radial-gradient(ellipse_at_85%_15%,rgba(200,168,78,0.08)_0%,transparent_50%)]" />

        <div className="relative z-10 max-w-[900px] text-center">
          {/* Beat 1: The crisis */}
          <p className="font-ibm-mono text-[0.75rem] tracking-[0.5em] uppercase text-ember mb-8">
            375,000 homes short by 2029
          </p>
          <h1 className="font-playfair text-[clamp(2.8rem,7vw,5.5rem)] font-black leading-[1] mb-4">
            The Australian Housing Crisis
            <br />
            Won&apos;t Be Solved
            <br />
            <em className="text-brass">the Old Way.</em>
          </h1>

          {/* Beat 2: The procurement problem */}
          <p className="font-archivo text-lg text-off-white/80 max-w-[700px] mx-auto leading-relaxed mt-8">
            Governments need housing for regional staff — teachers, nurses,
            police. Employers need housing for workforces in areas where
            there&apos;s nothing to rent. But capital procurement is slow,
            complex, and politically fraught.{" "}
            <strong className="text-off-white">
              What if they didn&apos;t have to fund the build at all?
            </strong>
          </p>

          {/* Beat 3: The fund solves it */}
          <p className="font-archivo text-base text-off-white/80 max-w-[700px] mx-auto leading-relaxed mt-4">
            The F2K Housing Fund finances the design and construction of
            modular housing, then delivers it to government departments and
            employers under{" "}
            <strong className="text-off-white">
              10-year take-or-pay leases
            </strong>
            . No capital outlay for the tenant — just an operating lease.
            Once leases are in place, each stabilised asset is sold to a REIT,
            and the capital recycles into the next project.
          </p>

          {/* Beat 4: The token is how you participate */}
          <p className="font-archivo text-base text-off-white/50 max-w-[600px] mx-auto leading-relaxed mt-4">
            The F2K Housing Token lets wholesale investors finance this
            pipeline directly — on-chain, transparent, with quarterly
            distributions as stabilised assets are sold.
          </p>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-12">
            {[
              { value: "$70B", label: "Gov't Committed" },
              { value: "375K", label: "Homes Short" },
              { value: "5%→25%", label: "Modular Target" },
              { value: "14-16wk", label: "Factory to Key" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-brass font-playfair">
                  {stat.value}
                </p>
                <p className="text-sm text-off-white/50 font-ibm-mono tracking-wider uppercase mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-center mt-12 flex-wrap">
            <a
              href="/invest"
              className="bg-ember hover:bg-ember/90 text-white px-8 py-3 font-archivo font-semibold transition-colors"
            >
              Apply to Invest
            </a>
            <a
              href="#why-now"
              className="border border-off-white/30 hover:border-brass text-off-white px-8 py-3 font-archivo font-semibold transition-colors"
            >
              Read the Case
            </a>
          </div>
        </div>
      </section>

      {/* ===== WHY NOW ===== */}
      <section id="why-now" className="py-20 px-4 bg-off-white">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Why Now
          </p>
          <h2 className="font-playfair text-[2.8rem] font-black text-deep-blue leading-tight mb-8">
            Seven Forces Converging
          </h2>

          <p className="text-lg text-slate leading-relaxed mb-6 font-archivo">
            There has never been a moment in Australian housing history where
            this many conditions have aligned simultaneously. Each one alone
            would create opportunity. Together, they create an emergency that
            demands a fundamentally new delivery model.
          </p>

          {/* Callout quote */}
          <blockquote className="border-l-4 border-ember pl-8 py-4 my-10">
            <p className="font-playfair text-xl italic text-deep-blue leading-relaxed">
              &ldquo;The Australian housing system remains far from healthy and
              is continuing to experience immense pressure. Systemic reform and
              ongoing investment from government and industry are urgently
              needed.&rdquo;
            </p>
            <cite className="block mt-3 text-sm text-slate font-archivo not-italic">
              — Susan Lloyd-Hurwitz, Chair, National Housing Supply and
              Affordability Council, May 2025
            </cite>
          </blockquote>

          <div className="space-y-6">
            {[
              {
                num: "1",
                title: "The money is committed and it needs to move.",
                text: "Every state and territory has multi-billion dollar housing commitments on their books. Housing Australia's Round 3 launched in January 2026 to fund the remaining 21,350 homes. The federal government has committed $54 million specifically to modern methods of construction. This isn't aspirational — these are appropriated budgets with delivery timelines and political accountability attached.",
              },
              {
                num: "2",
                title: "Traditional construction cannot meet the target.",
                text: "Australia will fall 375,000 homes short of its 1.2 million target by 2029. Labour shortages persist for key trades. Material costs remain elevated above pre-pandemic levels. Builder insolvencies have thinned the industry. The construction sector's productivity has actually declined over two decades. Business as usual is mathematically incapable of closing the gap.",
              },
              {
                num: "3",
                title: "Modular is now policy, not experiment.",
                text: "Queensland has set a 50% MMC target for government projects. NSW has 28 suppliers on its MMC Procurement List and is legislating Building Productivity Reforms in 2026. WA has a $50 million Housing Innovation Program. Victoria is building a $50 million Centre of Excellence. The Australian Building Codes Board has published national standards for offsite construction. CommBank has launched prefab-specific lending products. This sector has moved from fringe to mainstream in 18 months.",
              },
              {
                num: "4",
                title:
                  "Aboriginal housing is the moral imperative with the biggest pipeline.",
                text: "The NT's $4 billion remote housing agreement alone requires 2,700 homes in communities where traditional construction costs are extreme and skilled labour is scarce. There are 328 Aboriginal Community Housing Providers across Australia. Closing the Gap targets are legally binding commitments. This work requires cultural competence, community consultation, and remote logistics capability that most builders simply don't have.",
              },
              {
                num: "5",
                title: "No integrator exists at national scale.",
                text: "Every existing modular player is either a manufacturer competing for individual contracts, a state-based builder limited to one jurisdiction, or a community housing provider focused on tenancy. Nobody is stitching the supply chain together across state boundaries, across manufacturers, across building typologies. The coordination gap is the bottleneck.",
              },
              {
                num: "6",
                title:
                  "Asian manufacturing capacity is available and proven.",
                text: "Australia imported $175 million in prefabricated buildings from China alone in 2024, with Chinese goods accounting for 70% of prefabricated imports. The manufacturing capacity exists. What's needed is an integrator who can ensure NCC compliance, manage quality assurance, coordinate logistics, and guarantee that offshore production meets Australian standards — particularly for cyclone ratings and bushfire zones.",
              },
              {
                num: "7",
                title:
                  "National certification is being created right now.",
                text: "The $4.7 million federal commitment to a voluntary national certification process for modular manufacturers will transform the regulatory landscape. An integrator who is deeply embedded in this certification framework from day one will be positioned as the trusted bridge between manufacturers and government procurement.",
              },
            ].map((item) => (
              <div key={item.num} className="font-archivo">
                <p className="text-base text-slate leading-relaxed">
                  <strong className="text-[#0B0B0B]">
                    {item.num}. {item.title}
                  </strong>{" "}
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY US ===== */}
      <section id="why-us" className="py-20 px-4 bg-warm-grey">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Why Us
          </p>
          <h2 className="font-playfair text-[2.8rem] font-black text-deep-blue leading-tight mb-8">
            The Impartial Integrator Advantage
          </h2>

          <p className="text-lg text-slate leading-relaxed mb-10 font-archivo">
            F2K is not a manufacturer. Not a builder. Not a community housing
            provider. We are the execution layer that connects all of them —
            finding the best-fit solution for every use case, ensuring compliance
            across every jurisdiction, and delivering from factory to key
            handover.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                num: "01",
                title: "Manufacturer Agnostic",
                text: "No equity stake in any factory. No exclusive supply deals. Every project gets an open, competitive assessment of the best manufacturer for the specific use case — whether that's an Australian steel fabricator, an Asian modular producer, a timber SIP manufacturer, or a hybrid approach.",
              },
              {
                num: "02",
                title: "Specification Intelligence",
                text: "We have mapped the complete specification frameworks of the WA Department of Housing and Works — 12 documents, July 2025 edition — covering all five program streams from metro dwellings to cyclone-rated remote Aboriginal housing.",
              },
              {
                num: "03",
                title: "Multi-Typology Capability",
                text: "Single dwellings (BCA Class 1a). Apartments (Class 2 & 3). GROH regional officer housing. Northwest cyclone-rated communities. Remote Aboriginal housing. We don't specialise in one type — we match the right method to the right place.",
              },
              {
                num: "04",
                title: "Cross-Border Economies",
                text: "The same Asian manufacturer building cyclone-rated modules for WA's Kimberley can supply NT's Arnhem Land and QLD's Cape York. National coordination creates production volumes that reduce per-unit cost — something no state-based operator can achieve.",
              },
              {
                num: "05",
                title: "Cultural & Community Competence",
                text: "Aboriginal housing isn't a product variant — it's a different way of working. Local Decision Making. Community consultation. Cultural design requirements. 42% Aboriginal employment targets. F2K builds this into the operating model from day one.",
              },
              {
                num: "06",
                title: "Speed Through Coordination",
                text: "NSW has demonstrated 14-16 weeks from DA to completion using modular. The bottleneck isn't manufacturing speed — it's coordination: design compliance, manufacturer selection, QA hold points, transport permits, site preparation. That's what an integrator exists to solve.",
              },
            ].map((adv) => (
              <div
                key={adv.num}
                className="bg-off-white p-8 border border-black/5 hover:border-ember transition-colors relative group"
              >
                <span className="absolute top-2 right-4 font-playfair text-6xl font-black text-ember/10">
                  {adv.num}
                </span>
                <h3 className="font-archivo text-sm font-bold text-deep-blue uppercase tracking-wide mb-3">
                  {adv.title}
                </h3>
                <p className="text-sm text-slate leading-relaxed font-archivo">
                  {adv.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-20 px-4 bg-off-white">
        <div className="max-w-[900px] mx-auto">
          {/* Sub-section A: Capital Deployment */}
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            How It Works
          </p>
          <h2 className="font-playfair text-[2.8rem] font-black text-deep-blue leading-tight mb-6">
            Build → Stabilise → Sell → Recycle
          </h2>
          <p className="text-lg text-slate leading-relaxed mb-10 font-archivo">
            The fund finances housing construction, delivers tenanted assets
            under long-term leases, then sells each stabilised entity to an
            institutional investor — recycling capital into the next project.
          </p>

          {/* 6-step capital flow */}
          <div className="space-y-0 mb-12">
            {[
              {
                step: "1",
                title: "You Subscribe",
                desc: "USDC or contributed assets enter the fund as equity capital.",
              },
              {
                step: "2",
                title: "Fund Equity → Project SPV",
                desc: "30-40% of project cost is committed as equity to a ring-fenced Special Purpose Vehicle (SPV) — a separate legal entity that isolates each project's risk from the wider fund.",
              },
              {
                step: "3",
                title: "SPV Raises Senior Debt",
                desc: "The SPV raises 60-70% construction finance from senior lenders. Every $1 of investor equity funds $2.50-$3.00 of housing.",
              },
              {
                step: "4",
                title: "Housing Is Built & Leased",
                desc: "F2K delivers housing as integrator (earning a 12% GDV fee) and places tenants — government regional staff or employer workforces — under 10-year take-or-pay leases.",
              },
              {
                step: "5",
                title: "Stabilised Asset Sold",
                desc: "Once leases are operational, the income-producing SPV is sold to a REIT or institutional long-hold investor at a yield premium over development cost. The spread is the fund's primary return.",
              },
              {
                step: "6",
                title: "Capital Recycled → Distributions",
                desc: "Sale proceeds repay senior debt, flow through the fund waterfall, and are distributed quarterly to token holders. Remaining capital is redeployed into the next project.",
              },
            ].map((item, i) => (
              <div key={item.step} className="flex gap-4 items-start">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-12 h-12 rounded-full bg-deep-blue text-brass font-playfair text-lg font-bold flex items-center justify-center">
                    {item.step}
                  </div>
                  {i < 5 && <div className="w-0.5 h-8 bg-warm-grey mt-1" />}
                </div>
                <div className="pb-4">
                  <h3 className="font-archivo font-bold text-deep-blue mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate leading-relaxed font-archivo">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Capital Stack + Tenant Model Panel */}
          <div className="bg-deep-blue text-off-white p-8 mb-10">
            <h3 className="font-playfair text-xl font-bold mb-6">
              Capital Stack
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-brass font-ibm-mono text-xs uppercase tracking-wider mb-4">
                  Project Funding Split
                </p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between font-archivo text-sm mb-1">
                      <span className="text-off-white/70">
                        Senior Construction Debt
                      </span>
                      <span className="text-brass font-semibold">60-70%</span>
                    </div>
                    <div className="w-full bg-off-white/10 h-3">
                      <div
                        className="bg-brass/70 h-3"
                        style={{ width: "65%" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-archivo text-sm mb-1">
                      <span className="text-off-white/70">Fund Equity</span>
                      <span className="text-ember font-semibold">30-40%</span>
                    </div>
                    <div className="w-full bg-off-white/10 h-3">
                      <div
                        className="bg-ember h-3"
                        style={{ width: "35%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-brass font-ibm-mono text-xs uppercase tracking-wider mb-4">
                  Revenue Sources
                </p>
                <div className="space-y-3 font-archivo text-sm">
                  <div className="flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full bg-ember mt-1.5 shrink-0" />
                    <div>
                      <p className="text-off-white font-semibold">
                        Stabilised Asset Sale
                      </p>
                      <p className="text-off-white/60">
                        Lease-backed SPV sold to REIT at yield premium
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full bg-brass mt-1.5 shrink-0" />
                    <div>
                      <p className="text-off-white font-semibold">
                        Integration Fee
                      </p>
                      <p className="text-off-white/60">
                        12% of GDV earned during construction
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full bg-off-white/50 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-off-white font-semibold">
                        Interim Lease Income
                      </p>
                      <p className="text-off-white/60">
                        Take-or-pay income between completion and sale
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tenant Model */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <div className="bg-white p-6 border border-black/5">
              <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-ember mb-2">
                Government Regional Housing
              </p>
              <h3 className="font-archivo font-bold text-deep-blue mb-2">
                Teachers, Nurses, Police
              </h3>
              <p className="text-sm text-slate leading-relaxed font-archivo">
                Housing for essential government staff posted to regional and
                remote communities. Government departments commit to 10-year
                take-or-pay leases. No capital outlay — just an operating lease.
              </p>
            </div>
            <div className="bg-white p-6 border border-black/5">
              <p className="font-ibm-mono text-[0.6rem] tracking-wider uppercase text-ember mb-2">
                Workforce Housing
              </p>
              <h3 className="font-archivo font-bold text-deep-blue mb-2">
                Employer-Backed Leases
              </h3>
              <p className="text-sm text-slate leading-relaxed font-archivo">
                Housing for employer workforces in regional areas where private
                rental supply is inadequate. Employers commit to long-term
                take-or-pay leases, guaranteeing occupancy. No capital
                procurement — just an operating lease.
              </p>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-warm-grey mb-16" />

          {/* Sub-section B: The Token */}
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            The Token
          </p>
          <h2 className="font-playfair text-[2.8rem] font-black text-deep-blue leading-tight mb-8">
            ERC-3643 Security Token
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                step: "01",
                title: "Subscribe",
                desc: "Invest with USDC or contribute qualifying assets (property, bonds, cash). Independent appraisal determines value. Tokens minted at current NAV per unit.",
              },
              {
                step: "02",
                title: "Tokens Minted",
                desc: "ERC-3643 security tokens are minted to your verified wallet, proportional to your subscription. On-chain compliance ensures only KYC'd wholesale investors can hold tokens.",
              },
              {
                step: "03",
                title: "Quarterly Distributions",
                desc: "As stabilised assets are sold, proceeds flow through the fund waterfall and are distributed quarterly as USDC to all token holders, calculated pro-rata.",
              },
            ].map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-deep-blue text-brass font-playfair text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="font-archivo font-bold text-deep-blue mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate leading-relaxed font-archivo">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-deep-blue text-off-white p-8 md:p-12">
            <h3 className="font-playfair text-2xl font-bold mb-4">
              Security & Compliance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-archivo text-sm">
              <div>
                <p className="text-brass font-ibm-mono text-xs uppercase tracking-wider mb-2">
                  Token Standard
                </p>
                <p className="text-off-white/70 leading-relaxed">
                  ERC-3643 (T-REX) — the institutional-grade permissioned token
                  standard with on-chain identity verification and transfer
                  restrictions. Only allowlisted wallets can hold or transfer
                  tokens.
                </p>
              </div>
              <div>
                <p className="text-brass font-ibm-mono text-xs uppercase tracking-wider mb-2">
                  Fund Structure
                </p>
                <p className="text-off-white/70 leading-relaxed">
                  Managed Investment Scheme under Australian law. Wholesale
                  investors only (s708 Corporations Act). NAV published weekly.
                  Quarterly audited accounts. Gnosis Safe multisig treasury.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DOCUMENTS ===== */}
      <section id="documents" className="py-20 px-4 bg-warm-grey">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Documents
          </p>
          <h2 className="font-playfair text-[2.8rem] font-black text-deep-blue leading-tight mb-8">
            Read the Detail
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Housing Token Whitepaper",
                desc: "Complete technical and financial specification of the F2K Housing Token, fund structure, and tokenisation mechanics.",
                href: "/whitepaper",
                cta: "Read Whitepaper",
              },
              {
                title: "Organisational Structure",
                desc: "Corporate structure, governance framework, and operational model for F2K as national housing integrator.",
                href: "/docs/F2K-Org-Structure-V2.docx",
                cta: "Download",
              },
              {
                title: "WA Opportunity Assessment",
                desc: "Detailed analysis of the Western Australian housing market opportunity and F2K's competitive positioning.",
                href: "/docs/Factory2Key-Western Australia Opportunity-Assessment.docx",
                cta: "Download",
              },
              {
                title: "National Action Plan",
                desc: "F2K's national strategy for scaling modular housing delivery across all Australian states and territories.",
                href: "/docs/F2K-National-Action-Plan (1).docx",
                cta: "Download",
              },
            ].map((doc) => (
              <a
                key={doc.title}
                href={doc.href}
                className="block bg-off-white p-6 border border-black/5 hover:border-ember transition-colors group"
              >
                <h3 className="font-archivo font-bold text-deep-blue mb-2 group-hover:text-ember transition-colors">
                  {doc.title}
                </h3>
                <p className="text-sm text-slate leading-relaxed font-archivo mb-4">
                  {doc.desc}
                </p>
                <span className="font-ibm-mono text-xs tracking-wider uppercase text-ember">
                  {doc.cta} →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BOARD & GOVERNANCE ===== */}
      <section className="bg-deep-blue text-off-white py-20 px-4">
        <div className="max-w-[1000px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-brass mb-4">
            The National Team
          </p>
          <h2 className="font-playfair text-[2.8rem] font-black text-off-white leading-tight mb-6">
            Who We Need at the Table
          </h2>
          <p className="text-lg text-off-white/70 leading-relaxed mb-10 font-archivo max-w-[800px]">
            To be credible as Australia&apos;s impartial national housing
            integrator, the F2K board must represent every critical domain:
            Indigenous leadership, MMC industry authority, government procurement
            expertise, housing finance, and remote logistics.
          </p>

          {/* Governance tiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                title: "National Board",
                color: "ember",
                desc: "Strategic oversight, stakeholder relationships, government engagement",
                items: [
                  "Chair + 7 Directors + CEO",
                  "Quarterly board meetings",
                  "Aboriginal Advisory Sub-Committee",
                  "Audit & Risk Sub-Committee",
                  "Manufacturer Accreditation Panel",
                ],
              },
              {
                title: "State Delivery Hubs",
                color: "brass",
                desc: "Procurement, compliance, local trade coordination",
                items: [
                  "WA/NT Hub (Perth)",
                  "QLD/FNQ Hub (Brisbane/Cairns)",
                  "NSW Hub (Sydney/Western NSW)",
                  "VIC/SA/TAS Hub (Melbourne)",
                ],
              },
              {
                title: "Manufacturing Network",
                color: "forest",
                desc: "Accredited suppliers, QA programs, production coordination",
                items: [
                  "Australian steel fabricators",
                  "Australian modular (volumetric)",
                  "Australian panelised / SIPs",
                  "Asian modular producers",
                  "Specialist sub-assemblies",
                ],
              },
            ].map((tier) => (
              <div
                key={tier.title}
                className="border border-off-white/10 p-6 relative"
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-[3px] ${
                    tier.color === "ember"
                      ? "bg-ember"
                      : tier.color === "brass"
                        ? "bg-brass"
                        : "bg-green-500"
                  }`}
                />
                <h3
                  className={`font-archivo font-bold uppercase tracking-wider text-sm mb-2 ${
                    tier.color === "ember"
                      ? "text-ember"
                      : tier.color === "brass"
                        ? "text-brass"
                        : "text-green-400"
                  }`}
                >
                  {tier.title}
                </h3>
                <p className="text-xs text-off-white/60 mb-4 font-archivo">
                  {tier.desc}
                </p>
                <ul className="space-y-1">
                  {tier.items.map((item) => (
                    <li
                      key={item}
                      className="text-xs text-off-white/50 border-b border-off-white/5 py-1 font-archivo"
                    >
                      <span className="text-off-white/30 mr-1">→</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TIMELINE ===== */}
      <section className="py-20 px-4 bg-off-white">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Mobilisation Roadmap
          </p>
          <h2 className="font-playfair text-[2.8rem] font-black text-deep-blue leading-tight mb-10">
            From Formation to First Delivery
          </h2>

          <div className="space-y-8">
            {[
              {
                date: "Q1 2026",
                title: "Entity Formation & Board Assembly",
                text: "Incorporate national entity. Secure Chair and 3 critical director appointments. Register with prefabAUS. Begin CHIA engagement.",
              },
              {
                date: "Q2 2026",
                title: "Manufacturer Pre-Qualification",
                text: "Audit and accredit initial manufacturer network: 3-5 Australian, 2-3 Asian. Map capabilities against state specification frameworks.",
              },
              {
                date: "Q3 2026",
                title: "First State Registrations",
                text: "Register on WA DHW head contractor panel. Apply for QBuild Standing Offer Arrangement. Submit EOI for Housing Australia HAFF Round 3.",
              },
              {
                date: "Q4 2026",
                title: "Prototype & First Contract",
                text: "Deliver prototype dwelling(s) per DHW specification. Target first contract — likely WA prefab housing or NT remote housing.",
              },
              {
                date: "H1 2027",
                title: "Multi-State Operations",
                text: "Activate QLD and NSW hubs. Scale manufacturer network to 8-10 accredited suppliers. Target 50+ dwellings in active pipeline.",
              },
              {
                date: "H2 2027",
                title: "National Scale",
                text: "All four hubs operational. 100+ dwellings in pipeline across 3+ states. Aboriginal housing contracts in NT and/or WA. Revenue covering operations.",
              },
            ].map((item, i) => (
              <div key={item.date} className="flex gap-6 items-start">
                <div className="w-24 shrink-0 text-right">
                  <span className="font-ibm-mono text-xs font-semibold tracking-wider uppercase text-ember">
                    {item.date}
                  </span>
                </div>
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-3 h-3 rounded-full bg-ember border-2 border-off-white shadow-[0_0_0_2px] shadow-ember" />
                  {i < 5 && <div className="w-0.5 h-16 bg-warm-grey mt-1" />}
                </div>
                <div className="pb-2">
                  <h4 className="font-archivo font-bold text-deep-blue mb-1">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate leading-relaxed font-archivo">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="bg-ember text-white py-20 px-4 text-center">
        <div className="max-w-[700px] mx-auto">
          <h2 className="font-playfair text-[clamp(2.5rem,5vw,4rem)] font-black leading-tight mb-6">
            All Hands to the Wheel.
            <br />
            This Is Our Moment.
          </h2>
          <p className="text-lg text-white/85 leading-relaxed font-archivo mb-10">
            The emergency is real. The money is committed. The specifications are
            published. The manufacturers are ready. The communities are waiting.
            What&apos;s missing is the impartial integrator who brings it all
            together. That&apos;s F2K.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/whitepaper"
              className="bg-white text-ember hover:bg-off-white px-8 py-3 font-archivo font-semibold transition-colors"
            >
              Read the Whitepaper
            </a>
            <a
              href="/invest"
              className="border-2 border-white text-white hover:bg-white hover:text-ember px-8 py-3 font-archivo font-semibold transition-colors"
            >
              Apply to Invest
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
