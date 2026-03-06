import ProjectSubmitForm from "@/components/ProjectSubmitForm";

export default function ProjectsPage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="bg-deep-blue text-off-white py-20 px-4">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Project Pipeline
          </p>
          <h1 className="font-playfair text-[clamp(2.5rem,5vw,4rem)] font-black leading-tight mb-6">
            Submit a Project
          </h1>
          <p className="text-lg text-off-white/70 leading-relaxed font-archivo max-w-[750px]">
            F2K partners with landowners, developers, government agencies, and
            community housing providers to deliver housing at scale using modern
            methods of construction. If you have a qualifying project, register
            it here for assessment.
          </p>
        </div>
      </section>

      {/* ===== WHAT WE'RE LOOKING FOR ===== */}
      <section className="py-16 px-4 bg-warm-grey">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-6">
            Qualifying Criteria
          </p>
          <h2 className="font-playfair text-[2rem] font-black text-deep-blue leading-tight mb-8">
            What We&apos;re Looking For
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                label: "Scale",
                desc: "Minimum 10 dwellings per project. F2K's integrator model delivers value through volume — single-dwelling projects are not suitable.",
                icon: "10+",
              },
              {
                label: "Modular-Ready",
                desc: "Projects must be open to modern methods of construction — modular, volumetric, panelised, or hybrid approaches. Traditional construction-only projects do not qualify.",
                icon: "MMC",
              },
              {
                label: "Land Secured",
                desc: "Preference for projects with land owned, under contract, or government-allocated. Speculative site identification without tenure is too early-stage.",
                icon: "DA",
              },
              {
                label: "Housing Focus",
                desc: "Residential housing only — social, affordable, NDIS SDA, build-to-rent, defence, key worker, or student accommodation. No commercial or industrial.",
                icon: "RES",
              },
            ].map((c) => (
              <div key={c.label} className="bg-white p-6 border border-black/5">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 shrink-0 bg-ember/10 flex items-center justify-center font-ibm-mono text-[0.65rem] font-bold text-ember tracking-wider">
                    {c.icon}
                  </div>
                  <div>
                    <h3 className="font-archivo font-bold text-deep-blue mb-1">
                      {c.label}
                    </h3>
                    <p className="text-sm text-slate leading-relaxed font-archivo">
                      {c.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROJECT TYPES ===== */}
      <section className="py-16 px-4 bg-off-white">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-6">
            Eligible Categories
          </p>
          <h2 className="font-playfair text-[2rem] font-black text-deep-blue leading-tight mb-8">
            Project Types We Support
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { type: "Social Housing", desc: "State and territory government programs — NT, WA, QLD, NSW, VIC" },
              { type: "Affordable Housing", desc: "Community housing providers, NHFIC-funded, inclusionary zoning" },
              { type: "NDIS SDA", desc: "Specialist Disability Accommodation — high physical support and robust" },
              { type: "Build-to-Rent", desc: "Institutional BTR developments requiring rapid, repeatable delivery" },
              { type: "Defence Housing", desc: "DHA and defence force accommodation programs" },
              { type: "Key Worker Housing", desc: "Essential worker accommodation — health, education, emergency services" },
              { type: "Student Accommodation", desc: "University and TAFE student housing at scale" },
              { type: "Residential Subdivision", desc: "10+ lot subdivisions suited to modular or panelised delivery" },
            ].map((p) => (
              <div key={p.type} className="bg-white p-5 border border-black/5">
                <h3 className="font-archivo font-bold text-deep-blue text-sm mb-1">
                  {p.type}
                </h3>
                <p className="text-xs text-slate/70 font-archivo leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-16 px-4 bg-warm-grey">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-6">
            Process
          </p>
          <h2 className="font-playfair text-[2rem] font-black text-deep-blue leading-tight mb-8">
            From Submission to Delivery
          </h2>

          <div className="space-y-4">
            {[
              {
                step: "01",
                title: "Submit",
                desc: "Complete the project registration form below. Provide as much detail as possible about the site, approvals, and dwelling count.",
              },
              {
                step: "02",
                title: "Screen",
                desc: "F2K reviews against qualifying criteria — scale, construction suitability, land status, and alignment with fund strategy. Non-qualifying projects are declined with feedback.",
              },
              {
                step: "03",
                title: "Assess",
                desc: "Qualifying projects enter detailed feasibility — manufacturer matching, specification compliance check, cost modelling, and timeline planning.",
              },
              {
                step: "04",
                title: "Structure",
                desc: "Approved projects are structured through an F2K SPV. Development agreement, procurement strategy, and delivery program are finalised.",
              },
              {
                step: "05",
                title: "Deliver",
                desc: "F2K coordinates manufacturer selection, factory production, transport logistics, site preparation, installation, and handover — factory to key.",
              },
            ].map((s) => (
              <div key={s.step} className="bg-white p-6 border border-black/5 flex gap-6 items-start">
                <span className="font-ibm-mono text-2xl font-bold text-ember/30 shrink-0">
                  {s.step}
                </span>
                <div>
                  <h3 className="font-archivo font-bold text-deep-blue mb-1">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate leading-relaxed font-archivo">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NOT A FIT ===== */}
      <section className="py-12 px-4 bg-off-white">
        <div className="max-w-[900px] mx-auto">
          <div className="border border-red-200 bg-red-50 p-6">
            <h3 className="font-archivo font-bold text-red-800 mb-3">
              Projects That Do Not Qualify
            </h3>
            <ul className="space-y-1">
              {[
                "Single dwelling or duplex builds",
                "Traditional construction only — no interest in modular or MMC",
                "Commercial, industrial, or retail developments",
                "Speculative land banking without development intent",
                "Projects outside Australia",
              ].map((item) => (
                <li key={item} className="text-sm text-red-700/80 font-archivo flex items-start gap-2">
                  <span className="text-red-400 mt-0.5 shrink-0">&times;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== FORM ===== */}
      <section id="submit-project" className="py-20 px-4 bg-off-white">
        <div className="max-w-[800px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
            Register a Project
          </p>
          <h2 className="font-playfair text-[2.8rem] font-black text-deep-blue leading-tight mb-4">
            Submit Your Project
          </h2>
          <p className="text-lg text-slate leading-relaxed font-archivo mb-8">
            Provide your project details below. All fields marked with * are
            required. Projects that meet F2K&apos;s qualifying criteria will
            receive a response within 5 business days.
          </p>
          <ProjectSubmitForm />
        </div>
      </section>
    </>
  );
}
