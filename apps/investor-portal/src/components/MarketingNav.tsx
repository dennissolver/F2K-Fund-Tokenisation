"use client";

import { useState } from "react";

const navLinks = [
  { label: "Invest", href: "/invest" },
  { label: "Lenders", href: "/lenders" },
  { label: "Government", href: "/government" },
  { label: "Offtakers", href: "/offtakers" },
  { label: "Introducers", href: "/introducers" },
  { label: "AFSL Partners", href: "/afsl-partners" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Projects", href: "/projects" },
  { label: "Structure", href: "/structure" },
  { label: "Careers", href: "/careers" },
  { label: "Platform", href: "/platform" },
  { label: "Documents", href: "/documents" },
];

export default function MarketingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0B0B0B]">
      {/* Top bar */}
      <div className="text-center py-2 px-4 font-ibm-mono text-[0.7rem] tracking-[0.35em] uppercase text-brass">
        F2K — Factory to Key &middot; National Housing Integrator
      </div>

      {/* Nav bar */}
      <nav className="border-t border-white/10 px-4 md:px-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between h-14">
          <a href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-brass flex items-center justify-center font-bold text-[#0B0B0B] text-xs">
              F2K
            </div>
            <span className="text-off-white font-archivo font-semibold text-sm hidden sm:inline">
              Factory to Key
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-off-white/70 hover:text-brass transition-colors font-archivo"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/login"
              className="text-sm text-off-white/70 hover:text-brass transition-colors font-archivo"
            >
              Sign In
            </a>
            <a
              href="/invest"
              className="text-sm bg-ember hover:bg-ember/90 text-white px-5 py-2 font-archivo font-semibold transition-colors"
            >
              Apply to Invest
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-off-white p-2"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-white/10 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block text-sm text-off-white/70 hover:text-brass transition-colors font-archivo py-1"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/login"
              onClick={() => setOpen(false)}
              className="block text-sm text-off-white/70 hover:text-brass transition-colors font-archivo py-1"
            >
              Sign In
            </a>
            <a
              href="/invest"
              className="inline-block text-sm bg-ember hover:bg-ember/90 text-white px-5 py-2 font-archivo font-semibold transition-colors mt-2"
            >
              Apply to Invest
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}
