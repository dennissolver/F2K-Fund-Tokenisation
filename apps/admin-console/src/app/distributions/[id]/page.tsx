import { createSupabaseService } from "@/lib/supabase-service";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DistributionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createSupabaseService();

  const { data: distribution } = await supabase
    .from("distributions")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!distribution) notFound();

  const { data: payments } = await supabase
    .from("distribution_payments")
    .select("*, investors(full_name, email, wallet_address)")
    .eq("distribution_id", params.id)
    .order("amount_usdc", { ascending: false });

  return (
    <div>
      <a href="/distributions" className="text-sm text-gray-500 hover:text-f2k-blue">&larr; All Distributions</a>
      <h2 className="text-2xl font-bold text-navy mb-6">
        Distribution — {new Date(distribution.distribution_date).toLocaleDateString()}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="text-xl font-bold text-navy">${Number(distribution.total_amount_usdc).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Status</p>
          <p className="text-xl font-bold">{distribution.status}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Recipients</p>
          <p className="text-xl font-bold text-navy">{payments?.length || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-500">
              <th className="px-4 py-3">Investor</th>
              <th className="px-4 py-3">Wallet</th>
              <th className="px-4 py-3">Token Balance</th>
              <th className="px-4 py-3">Share %</th>
              <th className="px-4 py-3">Amount (USDC)</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Tx</th>
            </tr>
          </thead>
          <tbody>
            {payments && payments.length > 0 ? (
              payments.map((p) => {
                const inv = p.investors as { full_name: string | null; email: string; wallet_address: string | null } | null;
                return (
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-3">{inv?.full_name || inv?.email || "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs">{inv?.wallet_address ? `${inv.wallet_address.slice(0, 6)}...${inv.wallet_address.slice(-4)}` : "—"}</td>
                    <td className="px-4 py-3">{Number(p.token_balance_at_snapshot).toLocaleString()}</td>
                    <td className="px-4 py-3">{(Number(p.share_percentage) * 100).toFixed(2)}%</td>
                    <td className="px-4 py-3 font-semibold">${Number(p.amount_usdc).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        p.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>{p.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      {p.tx_hash ? <a href={`https://sepolia.etherscan.io/tx/${p.tx_hash}`} target="_blank" rel="noopener noreferrer" className="text-f2k-blue text-xs hover:underline">View</a> : "—"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No payments calculated.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
