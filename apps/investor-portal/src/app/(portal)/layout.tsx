export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 text-gray-900">
      <header className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-gold flex items-center justify-center font-bold text-navy text-sm">
                F2K
              </div>
              <span className="text-lg font-semibold">F2K Housing Token</span>
            </a>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <a
              href="/dashboard"
              className="hover:text-gold transition-colors"
            >
              Dashboard
            </a>
            <a
              href="/subscribe"
              className="hover:text-gold transition-colors"
            >
              Subscribe
            </a>
            <a href="/stake" className="hover:text-gold transition-colors">
              Stake
            </a>
            <a
              href="/statements"
              className="hover:text-gold transition-colors"
            >
              Statements
            </a>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
