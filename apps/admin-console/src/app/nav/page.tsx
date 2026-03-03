import { createSupabaseService } from "@/lib/supabase-service";

export const dynamic = "force-dynamic";

export default async function NavPage() {
  const supabase = createSupabaseService();

  const { data: navRecords } = await supabase
    .from("nav_records")
    .select("*")
    .order("calculated_at", { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-navy">NAV Management</h2>
      </div>

      {/* NAV Input Form Placeholder — would be client component */}
      <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Submit New NAV</h3>
        <p className="text-gray-400 text-sm">
          NAV input form with approval workflow. Fund managers submit, different admin approves.
        </p>
      </div>

      {/* History */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-500">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">NAV/Token</th>
              <th className="px-4 py-3">Total NAV</th>
              <th className="px-4 py-3">Supply</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">On-Chain</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {navRecords && navRecords.length > 0 ? (
              navRecords.map((nav) => (
                <tr key={nav.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{new Date(nav.calculated_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-semibold">${Number(nav.nav_per_token).toFixed(4)}</td>
                  <td className="px-4 py-3">${Number(nav.total_nav).toLocaleString()}</td>
                  <td className="px-4 py-3">{Number(nav.total_supply).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      nav.status === "published" ? "bg-green-100 text-green-700" :
                      nav.status === "approved" ? "bg-blue-100 text-blue-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>{nav.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {nav.on_chain_tx_hash ? (
                      <a href={`https://sepolia.etherscan.io/tx/${nav.on_chain_tx_hash}`} target="_blank" rel="noopener noreferrer" className="text-f2k-blue text-xs hover:underline">View</a>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {nav.status === "draft" && <span className="text-xs text-gray-500">Awaiting approval</span>}
                    {nav.status === "approved" && <span className="text-xs text-gray-500">Ready to publish</span>}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No NAV records.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
