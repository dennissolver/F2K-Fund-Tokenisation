import { Metadata } from "next";
import Image from "next/image";
import RegistrationForm from "@/components/seafields/RegistrationForm";

export const metadata: Metadata = {
  title: "Seafields Estate — Register Your Interest | F2K",
  description:
    "141-lot residential subdivision in Waggrakine, Geraldton WA. Bare serviced land or house & land packages. Register your interest — no deposit required.",
};

export default function SeafieldsEstatePage() {
  return (
    <>
      {/* ===== DISCLAIMER BANNER ===== */}
      <div className="bg-[#1A2744] text-white/80 text-xs font-archivo text-center py-2.5 px-4 leading-relaxed">
        <strong className="text-white">REGISTRATION OF INTEREST ONLY</strong> —
        No deposit is required or accepted. Registering does not create any
        legal or financial obligation.
      </div>

      {/* ===== HERO ===== */}
      <section className="relative bg-[#1A2744] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A2744] via-[#1A2744] to-[#00B5AD]/20" />

        <div className="relative max-w-[1100px] mx-auto px-4 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-[#00B5AD] mb-4">
                A Factory2Key Development
              </p>
              <h1 className="font-playfair text-[clamp(2.5rem,5vw,4rem)] font-black leading-[1.1] mb-6">
                Seafields Estate
              </h1>
              <p className="text-xl text-white/70 font-archivo leading-relaxed mb-2">
                141 residential lots — bare land or house &amp; land packages.
              </p>
              <p className="text-lg text-white/50 font-archivo mb-8">
                Waggrakine, Geraldton WA — 8km from Geraldton CBD
              </p>
              <p className="text-white/60 font-archivo leading-relaxed mb-8 max-w-lg">
                Select your preferred lot on the subdivision plan — no deposit,
                no commitment. Available as serviced land or as a complete house
                &amp; land package with F2K modular construction. We&apos;ll keep
                you informed as the project progresses.
              </p>
              <a
                href="#site-map"
                className="inline-block bg-[#00B5AD] hover:bg-[#009E97] text-white px-8 py-3.5 font-archivo font-semibold transition-colors"
              >
                Select your lot &rarr;
              </a>
            </div>

            {/* Hero image — subdivision plan preview */}
            <div className="border border-white/10">
              <Image
                src="/seafields/masterplan.jpg"
                alt="Seafields Estate subdivision masterplan — Waggrakine, Geraldton WA"
                width={600}
                height={450}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== KEY STATS ===== */}
      <section className="bg-white border-b border-black/5">
        <div className="max-w-[1100px] mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {[
              { value: "141", label: "Lots" },
              { value: "450–1,522m²", label: "Lot sizes" },
              { value: "~$150K", label: "Avg land price" },
              { value: "~$600K", label: "H&L package" },
              { value: "Q2 2026", label: "Tranche 1 start" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-playfair text-2xl md:text-3xl font-black text-deep-blue">
                  {stat.value}
                </div>
                <div className="font-ibm-mono text-[0.6rem] tracking-[0.3em] uppercase text-slate/60 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT THE PROJECT ===== */}
      <section className="py-16 px-4 bg-off-white">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-[#00B5AD] mb-4">
            About the Development
          </p>
          <h2 className="font-playfair text-[2rem] font-black text-deep-blue leading-tight mb-6">
            Land &amp; Lifestyle in Geraldton&apos;s Growth Corridor
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-slate font-archivo leading-relaxed space-y-4">
              <p>
                Seafields Estate is a 141-lot residential subdivision in
                Waggrakine, approximately 8km north of Geraldton CBD. The estate
                is part of a larger ~300-lot development, with over 155 lots
                already sold since 2012.
              </p>
              <p>
                All lots are flat, require minimal earthworks, and are
                connected to reticulated water, sewer, and power. Lots are
                available as bare serviced land (titled, ready to build) or as
                complete house &amp; land packages with F2K modular
                construction.
              </p>
              <p>
                The $188M Geraldton Health Campus redevelopment is driving
                significant demand for staff accommodation, with WACHS
                seeking 10-year leases for medical staff housing in the area.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { label: "Developer", value: "Factory2Key Pty Ltd" },
                { label: "Location", value: "Pepper Gate, Waggrakine WA 6530" },
                { label: "Zoning", value: "R12.5 Residential" },
                { label: "Lots", value: "141 residential (5 tranches)" },
                { label: "Lot Sizes", value: "450m² – 1,522m² (avg 611m²)" },
                { label: "Land Area", value: "~8.86 hectares" },
                { label: "Terrain", value: "Flat — minimal earthworks" },
                { label: "Services", value: "Water, sewer, power (reticulated)" },
                { label: "Planner", value: "CLE Town Planning + Design" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex border-b border-black/5 pb-2"
                >
                  <span className="font-ibm-mono text-[0.65rem] tracking-wider uppercase text-slate/50 w-28 shrink-0 pt-0.5">
                    {item.label}
                  </span>
                  <span className="font-archivo text-sm text-deep-blue">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== STAGING ===== */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-[#00B5AD] mb-4">
            Development Staging
          </p>
          <h2 className="font-playfair text-[2rem] font-black text-deep-blue leading-tight mb-8">
            Five-Tranche Delivery
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { tranche: "1", lots: "40", timeline: "Q2–Q4 2026" },
              { tranche: "2", lots: "35", timeline: "Q1–Q3 2027" },
              { tranche: "3", lots: "30", timeline: "Q4 '27–Q2 '28" },
              { tranche: "4", lots: "25", timeline: "Q3 '28–Q2 '29" },
              { tranche: "5", lots: "11", timeline: "Q2–Q4 2029" },
            ].map((t) => (
              <div
                key={t.tranche}
                className="bg-off-white p-4 border border-black/5 text-center"
              >
                <div className="font-playfair text-lg font-black text-deep-blue">
                  Tranche {t.tranche}
                </div>
                <div className="font-archivo text-2xl font-bold text-[#00B5AD] mt-1">
                  {t.lots}
                </div>
                <div className="font-ibm-mono text-[0.55rem] tracking-wider text-slate/60 mt-1">
                  LOTS
                </div>
                <div className="font-archivo text-xs text-slate mt-2">
                  {t.timeline}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LOT CATEGORIES ===== */}
      <section className="py-16 px-4 bg-warm-grey">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-[#00B5AD] mb-4">
            Purchase Options
          </p>
          <h2 className="font-playfair text-[2rem] font-black text-deep-blue leading-tight mb-8">
            Three Ways to Buy
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Bare Serviced Land",
                desc: "Titled, serviced lots ready to build. Bring your own builder or hold as an investment. Estimated ~$130K–$160K per lot.",
                lots: "90–100 lots",
              },
              {
                title: "House & Land Package",
                desc: "Complete turnkey modular home by F2K. Lot + 3-bed modular build + site works. Estimated ~$600K per package.",
                lots: "20–30 lots",
              },
              {
                title: "WACHS Staff Accommodation",
                desc: "Completed dwellings leased to WA Country Health Service for medical staff. 10-year government lease.",
                lots: "~20 lots",
              },
            ].map((opt) => (
              <div
                key={opt.title}
                className="bg-white p-6 border border-black/5"
              >
                <h3 className="font-playfair text-lg font-black text-deep-blue mb-2">
                  {opt.title}
                </h3>
                <p className="font-archivo text-sm text-slate leading-relaxed mb-4">
                  {opt.desc}
                </p>
                <div className="font-ibm-mono text-[0.6rem] tracking-[0.3em] uppercase text-[#00B5AD]">
                  {opt.lots}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MARKET CONTEXT ===== */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-[#00B5AD] mb-4">
            Geraldton Market
          </p>
          <h2 className="font-playfair text-[2rem] font-black text-deep-blue leading-tight mb-6">
            Strong Growth Fundamentals
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "$533K", label: "Median house price", sub: "Waggrakine" },
              { value: "27%", label: "Annual growth", sub: "Year-on-year" },
              { value: "<1%", label: "Rental vacancy", sub: "Geraldton region" },
              { value: "$188M", label: "Health campus", sub: "Geraldton redevelopment" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-playfair text-2xl md:text-3xl font-black text-[#00B5AD]">
                  {stat.value}
                </div>
                <div className="font-archivo text-sm text-deep-blue font-semibold mt-1">
                  {stat.label}
                </div>
                <div className="font-ibm-mono text-[0.55rem] text-slate/50 uppercase mt-0.5">
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INTERACTIVE MAP + REGISTRATION FORM ===== */}
      <section className="py-20 px-4 bg-off-white">
        <div className="max-w-[1200px] mx-auto">
          <RegistrationForm />
        </div>
      </section>

      {/* ===== F2K FUND TOKENISATION FOOTER NOTE ===== */}
      <section className="py-8 px-4 bg-[#1A2744]">
        <div className="max-w-[900px] mx-auto flex flex-col sm:flex-row items-center gap-4">
          <div className="shrink-0 border border-white/20 px-3 py-1.5">
            <span className="font-ibm-mono text-[0.6rem] tracking-[0.3em] uppercase text-[#00B5AD]">
              F2K Fund
            </span>
            <span className="font-ibm-mono text-[0.6rem] tracking-[0.3em] uppercase text-white/40 ml-2">
              Tokenisation Project
            </span>
          </div>
          <p className="text-white/40 text-xs font-archivo leading-relaxed text-center sm:text-left">
            Registration data collected on this page is used by Factory2Key Pty
            Ltd as market demand validation for the F2K Fund tokenisation of the
            Seafields Estate development project. Your details are not shared
            with any third party and are used solely for project communications
            and fund reporting purposes.{" "}
            <a
              href="/documents"
              className="text-[#00B5AD]/60 hover:text-[#00B5AD] underline transition-colors"
            >
              View our Privacy Policy
            </a>
          </p>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section className="py-10 px-4 bg-warm-grey">
        <div className="max-w-[900px] mx-auto text-center">
          <p className="font-archivo text-sm text-slate mb-2">
            Questions about Seafields Estate?
          </p>
          <p className="font-archivo text-deep-blue font-semibold">
            Dennis McMahon —{" "}
            <a
              href="mailto:dennis@factory2key.com.au"
              className="text-[#00B5AD] hover:underline"
            >
              dennis@factory2key.com.au
            </a>{" "}
            &middot;{" "}
            <a
              href="tel:+61402612471"
              className="text-[#00B5AD] hover:underline"
            >
              +61 402 612 471
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
