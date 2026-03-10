import { Metadata } from "next";
import Image from "next/image";
import RegistrationForm from "@/components/branscombe/RegistrationForm";

export const metadata: Metadata = {
  title: "Branscombe Estate — Register Your Interest | F2K",
  description:
    "37 architecturally designed, single-storey 3-bedroom modular homes in Claremont, Tasmania. Register your interest — no deposit required.",
};

export default function BranscombeEstatePage() {
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
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A2744] via-[#1A2744] to-[#00B5AD]/20" />

        <div className="relative max-w-[1100px] mx-auto px-4 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-[#00B5AD] mb-4">
                A Factory2Key Development
              </p>
              <h1 className="font-playfair text-[clamp(2.5rem,5vw,4rem)] font-black leading-[1.1] mb-6">
                Branscombe Estate
              </h1>
              <p className="text-xl text-white/70 font-archivo leading-relaxed mb-2">
                37 architecturally designed, single-storey 3-bedroom homes.
              </p>
              <p className="text-lg text-white/50 font-archivo mb-8">
                Claremont, Tasmania — 8km from Hobart CBD
              </p>
              <p className="text-white/60 font-archivo leading-relaxed mb-8 max-w-lg">
                Register your interest in a specific home — no deposit, no
                commitment. Simply let us know which home appeals to you and
                we&apos;ll keep you informed as the project progresses.
              </p>
              <a
                href="#site-map"
                className="inline-block bg-[#00B5AD] hover:bg-[#009E97] text-white px-8 py-3.5 font-archivo font-semibold transition-colors"
              >
                Select your home &rarr;
              </a>
            </div>

            {/* Hero image grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Image
                  src="/branscombe/home-exterior-1.png"
                  alt="Branscombe Estate modular home exterior"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
              <Image
                src="/branscombe/home-exterior-2.png"
                alt="Modular home side view"
                width={290}
                height={200}
                className="w-full h-auto object-cover"
              />
              <Image
                src="/branscombe/home-exterior-3.png"
                alt="Modular home rear view"
                width={290}
                height={200}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== KEY STATS ===== */}
      <section className="bg-white border-b border-black/5">
        <div className="max-w-[1100px] mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "37", label: "Homes" },
              { value: "3", label: "Bedrooms each" },
              { value: "104–114m²", label: "Living area" },
              { value: "2026", label: "Construction start" },
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
            Modern Modular Living in Claremont
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-slate font-archivo leading-relaxed space-y-4">
              <p>
                Branscombe Estate is a 37-dwelling modular residential
                development by Factory2Key Pty Ltd, located at 122–124
                Branscombe Road, Claremont TAS 7011 — just 8km from Hobart CBD.
              </p>
              <p>
                All homes are single-storey, 3-bedroom, designed by Unison
                Modular with high-quality finishes and energy efficiency built in.
                The development has full planning approval (Permit PLN-21-408.02,
                Glenorchy City Council).
              </p>
            </div>
            <div className="space-y-3">
              {[
                { label: "Developer", value: "Factory2Key Pty Ltd" },
                { label: "Location", value: "122–124 Branscombe Rd, Claremont TAS 7011" },
                { label: "Permit", value: "PLN-21-408.02 (Glenorchy City Council)" },
                { label: "Dwellings", value: "37 single-storey, 3-bedroom modular" },
                { label: "House Types", value: "Types 1A, 1B, 2A, 2B, 2C" },
                { label: "Site Area", value: "19,981 m²" },
                { label: "Designer", value: "Unison Modular" },
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

      {/* ===== VIDEO FLYOVER ===== */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-[1100px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-[#00B5AD] mb-4">
            Site Flyover
          </p>
          <h2 className="font-playfair text-[2rem] font-black text-deep-blue leading-tight mb-6">
            See the Site
          </h2>
          <div className="bg-[#1A2744] p-1">
            <video
              controls
              playsInline
              preload="metadata"
              poster="/branscombe/home-exterior-1.png"
              className="w-full h-auto"
            >
              <source
                src="https://eifcgqxpayrpbastpwjo.supabase.co/storage/v1/object/sign/video_storage/122-124%20Branscombe%20Road%20with%20logo2.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mNTljNmQ5ZC03NWZiLTQzODQtYjJkZC1kODVjZDM3YTk3MjYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlb19zdG9yYWdlLzEyMi0xMjQgQnJhbnNjb21iZSBSb2FkIHdpdGggbG9nbzIubXA0IiwiaWF0IjoxNzczMTMwNTU3LCJleHAiOjE4MzUzMzg1NTd9.w9AxB8_EzpCPz8Dv69sLvJ3R4ZZoXryuW_QL5gPMZwg"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
          <p className="text-xs text-slate/50 font-archivo mt-2 text-center">
            Aerial flyover of 122–124 Branscombe Road, Claremont TAS 7011
          </p>
        </div>
      </section>

      {/* ===== HOUSE TYPES ===== */}
      <section className="py-16 px-4 bg-warm-grey">
        <div className="max-w-[900px] mx-auto">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-[#00B5AD] mb-4">
            Home Designs
          </p>
          <h2 className="font-playfair text-[2rem] font-black text-deep-blue leading-tight mb-8">
            Five Architectural Layouts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-2">
              <Image
                src="/branscombe/floorplan-type1.png"
                alt="Floor plan Type 1A and 1B — 104m² + 24m² deck"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
            <div className="bg-white p-2">
              <Image
                src="/branscombe/floorplan-type2.png"
                alt="Floor plan Type 2A, 2B and 2C — 114m² + 24m² deck"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {(
              [
                { type: "1A", size: "104m²", deck: "24m²" },
                { type: "1B", size: "104m²", deck: "24m²" },
                { type: "2A", size: "114m²", deck: "24m²" },
                { type: "2B", size: "114m²", deck: "24m²" },
                { type: "2C", size: "114m²", deck: "24m²" },
              ] as const
            ).map((h) => (
              <div
                key={h.type}
                className="bg-white p-4 border border-black/5 text-center"
              >
                <div className="font-playfair text-lg font-black text-deep-blue">
                  Type {h.type}
                </div>
                <div className="font-ibm-mono text-[0.6rem] tracking-wider text-slate/60 mt-1">
                  {h.size} + {h.deck} DECK
                </div>
                <div className="font-archivo text-xs text-slate mt-1">
                  3 bed &middot; 1 bath
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INTERACTIVE MAP + REGISTRATION FORM ===== */}
      <section className="py-20 px-4 bg-off-white">
        <div className="max-w-[1100px] mx-auto">
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
            Branscombe Estate development project. Your details are not shared
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
            Questions about Branscombe Estate?
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
