import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documents — F2K Factory to Key",
  description:
    "Download F2K investor documents: whitepaper, organisational structure, opportunity assessments, and national action plan.",
};

const documents = [
  {
    title: "Housing Token Whitepaper V3",
    desc: "Complete technical and financial specification of the F2K Housing Token, fund structure, tokenisation mechanics, and investment thesis.",
    href: "/docs/F2K-Housing-Token-Whitepaper-V3.docx",
    category: "Core",
  },
  {
    title: "Organisational Structure V2",
    desc: "Corporate structure, governance framework, three-tier operating model, and board composition for F2K as national housing integrator.",
    href: "/docs/F2K-Org-Structure-V2.docx",
    category: "Governance",
  },
  {
    title: "Western Australia Opportunity Assessment",
    desc: "Detailed analysis of the WA housing market: $50M Housing Innovation Program, DHW specification frameworks, remote Aboriginal housing pipeline, and F2K's competitive positioning.",
    href: "/docs/Factory2Key-Western Australia Opportunity-Assessment.docx",
    category: "Market",
  },
  {
    title: "National Action Plan",
    desc: "F2K's national strategy for scaling modular housing delivery across all Australian states and territories, with state-by-state pipeline analysis and mobilisation roadmap.",
    href: "/docs/F2K-National-Action-Plan (1).docx",
    category: "Strategy",
  },
];

export default function DocumentsPage() {
  return (
    <div className="py-20 px-4 bg-off-white">
      <div className="max-w-[900px] mx-auto">
        <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-ember mb-4">
          Investor Documents
        </p>
        <h1 className="font-playfair text-[2.8rem] font-black text-deep-blue leading-tight mb-6">
          Due Diligence Library
        </h1>
        <p className="text-lg text-slate leading-relaxed mb-10 font-archivo max-w-[700px]">
          Everything you need to evaluate F2K as an investment opportunity.
          Download our core documents covering the fund structure, market
          analysis, and operational strategy.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {documents.map((doc) => (
            <a
              key={doc.title}
              href={doc.href}
              download
              className="block bg-white p-8 border border-black/5 hover:border-ember transition-colors group"
            >
              <span className="font-ibm-mono text-[0.6rem] tracking-[0.3em] uppercase text-ember/70 mb-2 block">
                {doc.category}
              </span>
              <h3 className="font-archivo font-bold text-deep-blue mb-3 group-hover:text-ember transition-colors text-lg">
                {doc.title}
              </h3>
              <p className="text-sm text-slate leading-relaxed font-archivo mb-4">
                {doc.desc}
              </p>
              <span className="font-ibm-mono text-xs tracking-wider uppercase text-ember inline-flex items-center gap-1">
                Download .docx
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </span>
            </a>
          ))}
        </div>

        <blockquote className="border-l-4 border-brass pl-8 py-4 my-10">
          <p className="font-playfair text-xl italic text-deep-blue leading-relaxed">
            These documents are provided for wholesale investor due diligence
            purposes. F2K Housing Token is available only to wholesale investors
            under s708 of the Corporations Act 2001 (Cth).
          </p>
        </blockquote>

        <div className="text-center">
          <p className="text-slate font-archivo mb-4">
            Questions about the documents or investment structure?
          </p>
          <a
            href="/register"
            className="inline-block bg-ember hover:bg-ember/90 text-white px-8 py-3 font-archivo font-semibold transition-colors"
          >
            Apply to Invest
          </a>
        </div>
      </div>
    </div>
  );
}
