"use client";

import { useState, useRef, useEffect } from "react";

type NavItem =
  | { label: string; href: string }
  | { label: string; children: { label: string; href: string }[] };

const navItems: NavItem[] = [
  {
    label: "Invest",
    children: [
      { label: "Apply to Invest", href: "/invest" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Redeem Tokens", href: "/redeem" },
      { label: "Marketplace", href: "/marketplace" },
      { label: "Documents", href: "/documents" },
      { label: "Platform", href: "/platform" },
    ],
  },
  {
    label: "Partners",
    children: [
      { label: "Lenders", href: "/lenders" },
      { label: "Government", href: "/government" },
      { label: "Offtakers", href: "/offtakers" },
      { label: "Introducers", href: "/introducers" },
      { label: "AFSL Partners", href: "/afsl-partners" },
    ],
  },
  {
    label: "Projects",
    children: [
      { label: "Submit a Project", href: "/projects" },
      { label: "Portfolio", href: "/portfolio" },
    ],
  },
  {
    label: "About",
    children: [
      { label: "Structure", href: "/structure" },
      { label: "Careers", href: "/careers" },
      { label: "Whitepaper", href: "/whitepaper" },
    ],
  },
];

function Dropdown({
  label,
  items,
}: {
  label: string;
  items: { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm text-off-white/70 hover:text-brass transition-colors font-archivo flex items-center gap-1"
      >
        {label}
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 bg-[#151515] border border-white/10 py-2 min-w-[180px] z-50">
          {items.map((child) => (
            <a
              key={child.href + child.label}
              href={child.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-off-white/60 hover:text-brass hover:bg-white/5 transition-colors font-archivo"
            >
              {child.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MarketingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

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
            {navItems.map((item) =>
              "children" in item ? (
                <Dropdown
                  key={item.label}
                  label={item.label}
                  items={item.children}
                />
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm text-off-white/70 hover:text-brass transition-colors font-archivo"
                >
                  {item.label}
                </a>
              )
            )}
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
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-off-white p-2"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
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
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 py-4 space-y-1">
            {navItems.map((item) => {
              if (!("children" in item)) {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm text-off-white/70 hover:text-brass transition-colors font-archivo py-2"
                  >
                    {item.label}
                  </a>
                );
              }

              const isExpanded = mobileExpanded === item.label;
              return (
                <div key={item.label}>
                  <button
                    onClick={() =>
                      setMobileExpanded(isExpanded ? null : item.label)
                    }
                    className="w-full flex items-center justify-between text-sm text-off-white/70 hover:text-brass transition-colors font-archivo py-2"
                  >
                    {item.label}
                    <svg
                      className={`w-3 h-3 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isExpanded && (
                    <div className="pl-4 space-y-1 border-l border-white/10 ml-2 mb-2">
                      {item.children.map((child) => (
                        <a
                          key={child.href + child.label}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="block text-sm text-off-white/50 hover:text-brass transition-colors font-archivo py-1.5"
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <a
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-off-white/70 hover:text-brass transition-colors font-archivo py-2"
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
