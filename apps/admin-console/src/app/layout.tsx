import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "F2K Admin Console",
  description: "F2K Housing Token fund administration and operations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-navy text-white min-h-screen p-4 flex-shrink-0">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-8 w-8 rounded bg-gold flex items-center justify-center font-bold text-navy text-sm">
                F2K
              </div>
              <span className="font-semibold">Admin Console</span>
            </div>
            <nav className="space-y-1">
              {[
                { href: "/", label: "Dashboard" },
                { href: "/investors", label: "Investors" },
                { href: "/allowlist", label: "Allowlist" },
                { href: "/subscriptions", label: "Subscriptions" },
                { href: "/redemptions", label: "Redemptions" },
                { href: "/stakes", label: "Asset Stakes" },
                { href: "/token-balances", label: "Token Balances" },
                { href: "/spvs", label: "SPVs" },
                { href: "/registrations", label: "Registrations" },
                { href: "/asset-classes", label: "Asset Classes" },
                { href: "/nav", label: "NAV Management" },
                { href: "/distributions", label: "Distributions" },
                { href: "/reports", label: "Reports" },
                { href: "/audit-log", label: "Audit Log" },
                { href: "/settings", label: "Settings" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 rounded text-sm hover:bg-white/10 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            <header className="bg-white border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold text-navy">
                  F2K Fund Administration
                </h1>
              </div>
            </header>
            <main className="p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
