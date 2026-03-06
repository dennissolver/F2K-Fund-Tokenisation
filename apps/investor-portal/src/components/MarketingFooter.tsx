export default function MarketingFooter() {
  return (
    <footer className="bg-[#0B0B0B] py-12 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded bg-brass flex items-center justify-center font-bold text-[#0B0B0B] text-xs">
                F2K
              </div>
              <span className="text-off-white font-archivo font-semibold text-sm">
                Factory to Key
              </span>
            </div>
            <p className="text-off-white/40 text-sm font-archivo leading-relaxed">
              Australia&apos;s impartial national housing integrator.
              Manufacturer-agnostic. Compliance-first. From factory to key
              handover.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-ibm-mono text-[0.65rem] tracking-[0.3em] uppercase text-brass mb-4">
              Navigate
            </h4>
            <div className="space-y-2">
              <a
                href="/invest"
                className="block text-sm text-off-white/50 hover:text-brass transition-colors font-archivo"
              >
                Invest
              </a>
              <a
                href="/lenders"
                className="block text-sm text-off-white/50 hover:text-brass transition-colors font-archivo"
              >
                Lenders
              </a>
              <a
                href="/government"
                className="block text-sm text-off-white/50 hover:text-brass transition-colors font-archivo"
              >
                Government
              </a>
              <a
                href="/offtakers"
                className="block text-sm text-off-white/50 hover:text-brass transition-colors font-archivo"
              >
                Offtakers
              </a>
              <a
                href="/introducers"
                className="block text-sm text-off-white/50 hover:text-brass transition-colors font-archivo"
              >
                Introducers
              </a>
              <a
                href="/afsl-partners"
                className="block text-sm text-off-white/50 hover:text-brass transition-colors font-archivo"
              >
                AFSL Partners
              </a>
              <a
                href="/portfolio"
                className="block text-sm text-off-white/50 hover:text-brass transition-colors font-archivo"
              >
                Portfolio
              </a>
              <a
                href="/projects"
                className="block text-sm text-off-white/50 hover:text-brass transition-colors font-archivo"
              >
                Projects
              </a>
              <a
                href="/structure"
                className="block text-sm text-off-white/50 hover:text-brass transition-colors font-archivo"
              >
                Structure
              </a>
              <a
                href="/careers"
                className="block text-sm text-off-white/50 hover:text-brass transition-colors font-archivo"
              >
                Careers
              </a>
              <a
                href="/documents"
                className="block text-sm text-off-white/50 hover:text-brass transition-colors font-archivo"
              >
                Documents
              </a>
              <a
                href="/whitepaper"
                className="block text-sm text-off-white/50 hover:text-brass transition-colors font-archivo"
              >
                Whitepaper
              </a>
            </div>
          </div>

          {/* Actions */}
          <div>
            <h4 className="font-ibm-mono text-[0.65rem] tracking-[0.3em] uppercase text-brass mb-4">
              Get Started
            </h4>
            <div className="space-y-2">
              <a
                href="/invest"
                className="block text-sm text-off-white/50 hover:text-brass transition-colors font-archivo"
              >
                Apply to Invest
              </a>
              <a
                href="/lenders"
                className="block text-sm text-off-white/50 hover:text-brass transition-colors font-archivo"
              >
                Register Interest
              </a>
              <a
                href="/login"
                className="block text-sm text-off-white/50 hover:text-brass transition-colors font-archivo"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>

        {/* Legal */}
        <div className="border-t border-white/10 pt-6 text-center">
          <p className="font-ibm-mono text-[0.65rem] text-off-white/25 tracking-[0.1em]">
            F2K — Factory to Key | Wholesale investors only (s708 Corporations
            Act) | Not financial advice
          </p>
        </div>
      </div>
    </footer>
  );
}
