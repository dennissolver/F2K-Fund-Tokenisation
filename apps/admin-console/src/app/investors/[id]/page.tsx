import { createSupabaseService } from "@/lib/supabase-service";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function InvestorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createSupabaseService();

  const { data: investor } = await supabase
    .from("investors")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!investor) notFound();

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("investor_id", params.id)
    .order("created_at", { ascending: false });

  const { data: payments } = await supabase
    .from("distribution_payments")
    .select("*")
    .eq("investor_id", params.id)
    .order("created_at", { ascending: false });

  const { data: allowlistEntry } = await supabase
    .from("allowlist")
    .select("*")
    .eq("investor_id", params.id)
    .single();

  const { data: auditEntries } = await supabase
    .from("audit_log")
    .select("*")
    .or(`entity_id.eq.${params.id},details->>wallet_address.eq.${investor.wallet_address}`)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <a href="/investors" className="text-sm text-gray-500 hover:text-f2k-blue">&larr; All Investors</a>
          <h2 className="text-2xl font-bold text-navy">{investor.full_name || investor.email}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Profile */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Profile</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-gray-500">Email</dt><dd>{investor.email}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Full Name</dt><dd>{investor.full_name || "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Entity</dt><dd>{investor.entity_name || "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Type</dt><dd>{investor.investor_type || "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Country</dt><dd>{investor.country_code}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Registered</dt><dd>{new Date(investor.created_at).toLocaleDateString()}</dd></div>
          </dl>
        </div>

        {/* KYC & Wallet */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-4">KYC & Wallet</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">KYC Status</dt>
              <dd>
                <span className={`px-2 py-0.5 rounded text-xs ${
                  investor.kyc_status === "approved" ? "bg-green-100 text-green-700" :
                  investor.kyc_status === "rejected" ? "bg-red-100 text-red-700" :
                  "bg-yellow-100 text-yellow-700"
                }`}>
                  {investor.kyc_status}
                </span>
              </dd>
            </div>
            <div className="flex justify-between"><dt className="text-gray-500">KYC Completed</dt><dd>{investor.kyc_completed_at ? new Date(investor.kyc_completed_at).toLocaleDateString() : "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Wallet</dt><dd className="font-mono text-xs">{investor.wallet_address || "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Wallet Verified</dt><dd>{investor.wallet_verified_at ? new Date(investor.wallet_verified_at).toLocaleDateString() : "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Allowlist</dt><dd>{allowlistEntry?.status || "Not added"}</dd></div>
          </dl>
        </div>
      </div>

      {/* Subscriptions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Subscriptions</h3>
        {subscriptions && subscriptions.length > 0 ? (
          <table className="w-full text-sm">
            <thead><tr className="text-left text-gray-500 border-b"><th className="pb-2">Date</th><th className="pb-2">Amount</th><th className="pb-2">Token Price</th><th className="pb-2">Tokens</th><th className="pb-2">Status</th></tr></thead>
            <tbody>
              {subscriptions.map((s) => (
                <tr key={s.id} className="border-b last:border-0">
                  <td className="py-2">{new Date(s.created_at).toLocaleDateString()}</td>
                  <td className="py-2">${Number(s.amount_usdc).toLocaleString()}</td>
                  <td className="py-2">${Number(s.token_price).toFixed(2)}</td>
                  <td className="py-2">{Number(s.tokens_to_mint).toLocaleString()}</td>
                  <td className="py-2"><span className={`px-2 py-0.5 rounded text-xs ${s.status === "minted" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400 text-sm">No subscriptions.</p>
        )}
      </div>

      {/* Distribution Payments */}
      <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Distributions Received</h3>
        {payments && payments.length > 0 ? (
          <table className="w-full text-sm">
            <thead><tr className="text-left text-gray-500 border-b"><th className="pb-2">Date</th><th className="pb-2">Amount</th><th className="pb-2">Status</th><th className="pb-2">Tx</th></tr></thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="py-2">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="py-2">${Number(p.amount_usdc).toLocaleString()}</td>
                  <td className="py-2"><span className="px-2 py-0.5 rounded text-xs bg-yellow-100 text-yellow-700">{p.status}</span></td>
                  <td className="py-2">{p.tx_hash ? <a href={`https://sepolia.etherscan.io/tx/${p.tx_hash}`} target="_blank" rel="noopener noreferrer" className="text-f2k-blue text-xs hover:underline">View</a> : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400 text-sm">No distributions.</p>
        )}
      </div>

      {/* Audit Trail */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Audit Trail</h3>
        {auditEntries && auditEntries.length > 0 ? (
          <div className="space-y-2 text-sm">
            {auditEntries.map((entry) => (
              <div key={entry.id} className="flex gap-4 py-2 border-b last:border-0">
                <span className="text-gray-400 text-xs w-32 flex-shrink-0">{new Date(entry.created_at).toLocaleString()}</span>
                <span className="font-medium">{entry.action}</span>
                <span className="text-gray-500">{entry.actor_email || "system"}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No audit entries.</p>
        )}
      </div>
    </div>
  );
}
