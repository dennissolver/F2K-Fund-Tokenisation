import { createSupabaseService } from "@/lib/supabase-service";

export const dynamic = "force-dynamic";

interface InvestorBalance {
  investor_id: string;
  full_name: string;
  email: string;
  wallet_address: string | null;
  subscription_tokens: number;
  stake_tokens: number;
  total_tokens: number;
}

export default async function TokenBalancesPage() {
  const supabase = createSupabaseService();

  // Get minted subscriptions joined with investors
  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("investor_id, tokens_to_mint, investors(id, full_name, email, wallet_address)")
    .eq("status", "minted");

  // Get minted asset stakes joined with investors
  const { data: stakes } = await supabase
    .from("asset_stakes")
    .select("investor_id, tokens_to_mint, investors(id, full_name, email, wallet_address)")
    .eq("status", "tokens_minted");

  // Get latest published NAV
  const { data: latestNav } = await supabase
    .from("nav_records")
    .select("nav_per_token")
    .eq("status", "published")
    .order("calculated_at", { ascending: false })
    .limit(1)
    .single();

  const navPerToken = latestNav ? Number(latestNav.nav_per_token) : 1.0;

  // Aggregate by investor
  const balanceMap = new Map<string, InvestorBalance>();

  if (subscriptions) {
    for (const sub of subscriptions) {
      const investor = sub.investors as unknown as {
        id: string;
        full_name: string;
        email: string;
        wallet_address: string | null;
      };
      if (!investor) continue;

      const existing = balanceMap.get(investor.id);
      const tokens = Number(sub.tokens_to_mint) || 0;

      if (existing) {
        existing.subscription_tokens += tokens;
        existing.total_tokens += tokens;
      } else {
        balanceMap.set(investor.id, {
          investor_id: investor.id,
          full_name: investor.full_name || "Unknown",
          email: investor.email,
          wallet_address: investor.wallet_address,
          subscription_tokens: tokens,
          stake_tokens: 0,
          total_tokens: tokens,
        });
      }
    }
  }

  if (stakes) {
    for (const stake of stakes) {
      const investor = stake.investors as unknown as {
        id: string;
        full_name: string;
        email: string;
        wallet_address: string | null;
      };
      if (!investor) continue;

      const existing = balanceMap.get(investor.id);
      const tokens = Number(stake.tokens_to_mint) || 0;

      if (existing) {
        existing.stake_tokens += tokens;
        existing.total_tokens += tokens;
      } else {
        balanceMap.set(investor.id, {
          investor_id: investor.id,
          full_name: investor.full_name || "Unknown",
          email: investor.email,
          wallet_address: investor.wallet_address,
          subscription_tokens: 0,
          stake_tokens: tokens,
          total_tokens: tokens,
        });
      }
    }
  }

  // Sort by total tokens descending
  const balances = Array.from(balanceMap.values()).sort(
    (a, b) => b.total_tokens - a.total_tokens
  );

  const totalSupply = balances.reduce((sum, b) => sum + b.total_tokens, 0);
  const totalAUM = totalSupply * navPerToken;
  const holderCount = balances.length;

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy mb-6">Token Balances</h2>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Total Supply</p>
          <p className="text-2xl font-bold text-navy">
            {totalSupply.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-400 mt-1">F2K-HT tokens</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Total AUM</p>
          <p className="text-2xl font-bold text-navy">
            ${totalAUM.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-400 mt-1">at ${navPerToken.toFixed(4)} NAV/token</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500">Token Holders</p>
          <p className="text-2xl font-bold text-navy">{holderCount}</p>
          <p className="text-xs text-gray-400 mt-1">unique investors</p>
        </div>
      </div>

      {/* Balances Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-500">
              <th className="px-4 py-3">Investor</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Wallet</th>
              <th className="px-4 py-3 text-right">Tokens (Subs)</th>
              <th className="px-4 py-3 text-right">Tokens (Stakes)</th>
              <th className="px-4 py-3 text-right">Total Tokens</th>
              <th className="px-4 py-3 text-right">Value (USD)</th>
              <th className="px-4 py-3 text-right">% of Supply</th>
            </tr>
          </thead>
          <tbody>
            {balances.length > 0 ? (
              balances.map((b) => {
                const value = b.total_tokens * navPerToken;
                const pct = totalSupply > 0 ? (b.total_tokens / totalSupply) * 100 : 0;

                return (
                  <tr key={b.investor_id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{b.full_name}</td>
                    <td className="px-4 py-3 text-gray-600">{b.email}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      {b.wallet_address
                        ? `${b.wallet_address.slice(0, 6)}...${b.wallet_address.slice(-4)}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {b.subscription_tokens.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {b.stake_tokens.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {b.total_tokens.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {pct.toFixed(2)}%
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                  No token holders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
