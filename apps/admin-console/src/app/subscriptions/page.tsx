import { createSupabaseService } from "@/lib/supabase-service";

export const dynamic = "force-dynamic";

export default async function SubscriptionsPage() {
  const supabase = createSupabaseService();

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*, investors(full_name, email)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy mb-6">Subscriptions</h2>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-500">
              <th className="px-4 py-3">Investor</th>
              <th className="px-4 py-3">Amount (USDC)</th>
              <th className="px-4 py-3">Token Price</th>
              <th className="px-4 py-3">Tokens</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions && subscriptions.length > 0 ? (
              subscriptions.map((sub) => (
                <tr key={sub.id} className={`border-t hover:bg-gray-50 ${sub.status === "pending" ? "bg-yellow-50" : ""}`}>
                  <td className="px-4 py-3">
                    {(sub.investors as { full_name: string | null; email: string } | null)?.full_name ||
                     (sub.investors as { full_name: string | null; email: string } | null)?.email || "—"}
                  </td>
                  <td className="px-4 py-3">${Number(sub.amount_usdc).toLocaleString()}</td>
                  <td className="px-4 py-3">${Number(sub.token_price).toFixed(2)}</td>
                  <td className="px-4 py-3">{Number(sub.tokens_to_mint).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      sub.status === "minted" ? "bg-green-100 text-green-700" :
                      sub.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                      sub.status === "failed" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>{sub.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{new Date(sub.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    {sub.status === "pending" && (
                      <a href={`/api/subscriptions/${sub.id}/confirm`} className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">Confirm</a>
                    )}
                    {sub.status === "confirmed" && (
                      <a href={`/api/subscriptions/${sub.id}/mint`} className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">Mint</a>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No subscriptions.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
