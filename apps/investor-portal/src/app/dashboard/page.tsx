import { createSupabaseServer } from "@/lib/supabase-server";
import { TOKEN_SYMBOL } from "@f2k/shared";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Please sign in to view your dashboard.</p>
        <a href="/login" className="text-f2k-blue hover:underline">
          Sign in
        </a>
      </div>
    );
  }

  // Fetch investor data
  const { data: investor } = await supabase
    .from("investors")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  // Fetch subscriptions
  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("investor_id", investor?.id)
    .order("created_at", { ascending: false });

  // Fetch distribution payments
  const { data: payments } = await supabase
    .from("distribution_payments")
    .select("*")
    .eq("investor_id", investor?.id)
    .order("created_at", { ascending: false });

  // Fetch latest published NAV
  const { data: latestNav } = await supabase
    .from("nav_records")
    .select("*")
    .eq("status", "published")
    .order("calculated_at", { ascending: false })
    .limit(1)
    .single();

  // Fetch asset stakes
  const { data: stakes } = await supabase
    .from("asset_stakes")
    .select("*, asset_classes(*)")
    .eq("investor_id", investor?.id)
    .order("created_at", { ascending: false });

  // Calculate holdings
  const mintedSubs = subscriptions?.filter((s) => s.status === "minted") || [];
  const tokenBalance = mintedSubs.reduce(
    (sum, s) => sum + Number(s.tokens_to_mint),
    0
  );
  const navPerToken = latestNav ? Number(latestNav.nav_per_token) : 1.0;
  const totalValue = tokenBalance * navPerToken;
  const totalCost = mintedSubs.reduce(
    (sum, s) => sum + Number(s.amount_usdc),
    0
  );
  const unrealisedGain = totalValue - totalCost;
  const totalDistributions = (payments || []).reduce(
    (sum, p) => sum + Number(p.amount_usdc),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-navy mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Holdings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Holdings</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Token Balance</span>
              <span className="font-semibold">
                {tokenBalance.toLocaleString()} {TOKEN_SYMBOL}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">NAV per Token</span>
              <span className="font-semibold">
                ${navPerToken.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Value</span>
              <span className="font-bold text-lg text-navy">
                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Unrealised P&L</span>
              <span
                className={`font-semibold ${
                  unrealisedGain >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {unrealisedGain >= 0 ? "+" : ""}$
                {unrealisedGain.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Fund Overview */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-4">
            Fund Overview
          </h3>
          {latestNav ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">NAV per Token</span>
                <span className="font-semibold">
                  ${Number(latestNav.nav_per_token).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Fund NAV</span>
                <span className="font-semibold">
                  ${Number(latestNav.total_nav).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="text-sm text-gray-500">
                  {new Date(latestNav.calculated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No NAV published yet.</p>
          )}
        </div>
      </div>

      {/* Distributions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-500">Distributions</h3>
          <span className="text-sm font-semibold text-navy">
            Total: ${totalDistributions.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
        {payments && payments.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Date</th>
                <th className="pb-2">Amount (USDC)</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Tx</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="py-2">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2">
                    ${Number(p.amount_usdc).toLocaleString()}
                  </td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        p.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-2">
                    {p.tx_hash ? (
                      <a
                        href={`https://sepolia.etherscan.io/tx/${p.tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-f2k-blue hover:underline text-xs"
                      >
                        View
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400 text-sm">No distributions yet.</p>
        )}
      </div>

      {/* Staked Assets */}
      <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-500">Staked Assets</h3>
          <a
            href="/stake"
            className="text-sm bg-f2k-blue hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg transition-colors"
          >
            Stake Asset
          </a>
        </div>
        {stakes && stakes.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Date</th>
                <th className="pb-2">Asset Class</th>
                <th className="pb-2">Declared Value</th>
                <th className="pb-2">LTV</th>
                <th className="pb-2">Tokens</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {stakes.map((s: Record<string, unknown>) => (
                <tr key={s.id as string} className="border-b last:border-0">
                  <td className="py-2">
                    {new Date(s.created_at as string).toLocaleDateString()}
                  </td>
                  <td className="py-2">
                    {(s.asset_classes as Record<string, unknown>)?.label as string ?? "—"}
                  </td>
                  <td className="py-2">
                    ${Number(s.declared_value).toLocaleString()}
                  </td>
                  <td className="py-2">
                    {s.ltv_ratio_applied
                      ? `${(Number(s.ltv_ratio_applied) * 100).toFixed(0)}%`
                      : "—"}
                  </td>
                  <td className="py-2">
                    {s.tokens_to_mint
                      ? Number(s.tokens_to_mint).toLocaleString()
                      : "—"}
                  </td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        s.status === "tokens_minted"
                          ? "bg-green-100 text-green-700"
                          : s.status === "lien_registered"
                          ? "bg-blue-100 text-blue-700"
                          : s.status === "approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : s.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {(s.status as string).replace(/_/g, " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400 text-sm">
            No staked assets yet. Stake eligible real-world assets to receive {TOKEN_SYMBOL} tokens.
          </p>
        )}
      </div>

      {/* Subscriptions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-500">Subscriptions</h3>
          <a
            href="/subscribe"
            className="text-sm bg-f2k-blue hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg transition-colors"
          >
            Subscribe More
          </a>
        </div>
        {subscriptions && subscriptions.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Date</th>
                <th className="pb-2">Amount (USDC)</th>
                <th className="pb-2">Token Price</th>
                <th className="pb-2">Tokens</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((s) => (
                <tr key={s.id} className="border-b last:border-0">
                  <td className="py-2">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2">
                    ${Number(s.amount_usdc).toLocaleString()}
                  </td>
                  <td className="py-2">${Number(s.token_price).toFixed(2)}</td>
                  <td className="py-2">
                    {Number(s.tokens_to_mint).toLocaleString()}
                  </td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        s.status === "minted"
                          ? "bg-green-100 text-green-700"
                          : s.status === "confirmed"
                          ? "bg-blue-100 text-blue-700"
                          : s.status === "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400 text-sm">No subscriptions yet.</p>
        )}
      </div>
    </div>
  );
}
