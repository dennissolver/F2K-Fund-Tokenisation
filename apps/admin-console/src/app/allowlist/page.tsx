import { createSupabaseService } from "@/lib/supabase-service";

export const dynamic = "force-dynamic";

export default async function AllowlistPage() {
  const supabase = createSupabaseService();

  const { data: entries } = await supabase
    .from("allowlist")
    .select("*, investors(full_name, email)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy mb-6">Allowlist</h2>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-500">
              <th className="px-4 py-3">Wallet</th>
              <th className="px-4 py-3">Investor</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Added</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries && entries.length > 0 ? (
              entries.map((entry) => (
                <tr key={entry.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{entry.wallet_address}</td>
                  <td className="px-4 py-3">
                    {(entry.investors as { full_name: string | null; email: string } | null)?.full_name ||
                     (entry.investors as { full_name: string | null; email: string } | null)?.email || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      entry.status === "approved" ? "bg-green-100 text-green-700" :
                      entry.status === "denied" ? "bg-red-100 text-red-700" :
                      entry.status === "revoked" ? "bg-gray-100 text-gray-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>{entry.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{new Date(entry.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    {entry.status === "pending" && (
                      <div className="flex gap-2">
                        <form action={`/api/allowlist/${entry.id}`} method="POST">
                          <input type="hidden" name="action" value="approve" />
                          <button className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">Approve</button>
                        </form>
                        <form action={`/api/allowlist/${entry.id}`} method="POST">
                          <input type="hidden" name="action" value="deny" />
                          <button className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Deny</button>
                        </form>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No allowlist entries.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
