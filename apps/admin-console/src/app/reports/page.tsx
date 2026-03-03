export default function ReportsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-navy mb-6">Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: "Investor Register", desc: "All investors with KYC status and holdings", type: "investors" },
          { title: "Holdings Snapshot", desc: "Current token balances and NAV values", type: "holdings" },
          { title: "Distribution Report", desc: "Per-distribution breakdown of all payments", type: "distributions" },
          { title: "Audit Trail", desc: "Full audit log of all admin actions", type: "audit" },
        ].map((report) => (
          <div key={report.type} className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="font-semibold text-navy mb-1">{report.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{report.desc}</p>
            <a
              href={`/api/reports?type=${report.type}&format=csv`}
              className="text-sm bg-f2k-blue text-white px-4 py-1.5 rounded hover:bg-blue-700 transition-colors"
            >
              Download CSV
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
