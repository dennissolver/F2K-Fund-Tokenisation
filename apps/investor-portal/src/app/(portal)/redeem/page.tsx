import { createSupabaseServer } from "@/lib/supabase-server";
import { createSupabaseService } from "@/lib/supabase-service";
import { TOKEN_SYMBOL, REDEMPTION_NOTICE_DAYS } from "@f2k/shared";
import RedeemFlow from "@/components/RedeemFlow";

export const dynamic = "force-dynamic";

export default async function RedeemPage() {
  const supabase = createSupabaseServer();
  const serviceClient = createSupabaseService();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Please sign in to redeem tokens.</p>
        <a href="/login" className="text-f2k-blue hover:underline">
          Sign in
        </a>
      </div>
    );
  }

  const { data: investor } = await supabase
    .from("investors")
    .select("id, kyc_status")
    .eq("auth_user_id", user.id)
    .single();

  if (!investor) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-8 shadow-sm border text-center">
          <h2 className="text-xl font-bold text-navy mb-2">Complete Onboarding</h2>
          <p className="text-gray-600 mb-4">
            You need to complete your investor onboarding before you can redeem tokens.
          </p>
          <a
            href="/onboarding"
            className="inline-block bg-f2k-blue hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm transition-colors"
          >
            Start Onboarding
          </a>
        </div>
      </div>
    );
  }

  if (investor.kyc_status !== "approved") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-8 shadow-sm border text-center">
          <h2 className="text-xl font-bold text-navy mb-2">KYC Required</h2>
          <p className="text-gray-600">
            Your KYC must be approved before you can redeem tokens. Current status:{" "}
            <span className="font-semibold">{investor.kyc_status}</span>
          </p>
        </div>
      </div>
    );
  }

  // Calculate available tokens
  const { data: mintedSubs } = await serviceClient
    .from("subscriptions")
    .select("tokens_to_mint")
    .eq("investor_id", investor.id)
    .eq("status", "minted");

  const totalMinted = (mintedSubs || []).reduce(
    (sum, s) => sum + Number(s.tokens_to_mint),
    0
  );

  const { data: activeRedemptions } = await (serviceClient.from("redemptions") as any)
    .select("token_amount")
    .eq("investor_id", investor.id)
    .in("status", ["pending", "approved", "processing"]);

  const tokensInRedemption = (activeRedemptions || []).reduce(
    (sum: number, r: { token_amount: number }) => sum + Number(r.token_amount),
    0
  );

  const { data: activeListings } = await (serviceClient.from("marketplace_listings") as any)
    .select("token_amount")
    .eq("seller_id", investor.id)
    .eq("status", "active");

  const tokensInListings = (activeListings || []).reduce(
    (sum: number, l: { token_amount: number }) => sum + Number(l.token_amount),
    0
  );

  const availableTokens = totalMinted - tokensInRedemption - tokensInListings;

  // Get current NAV
  const { data: latestNav } = await supabase
    .from("nav_records")
    .select("nav_per_token")
    .eq("status", "published")
    .order("calculated_at", { ascending: false })
    .limit(1)
    .single();

  const navPerToken = latestNav ? Number(latestNav.nav_per_token) : 1.0;

  // Get past redemptions
  const { data: redemptions } = await (serviceClient.from("redemptions") as any)
    .select("*")
    .eq("investor_id", investor.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-navy mb-6">Redeem Tokens</h1>

      <RedeemFlow availableTokens={availableTokens} navPerToken={navPerToken} />

      {/* Past Redemptions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border mt-8">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Redemption History</h3>
        {redemptions && redemptions.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Date</th>
                <th className="pb-2">Tokens</th>
                <th className="pb-2">NAV at Request</th>
                <th className="pb-2">Est. Value</th>
                <th className="pb-2">Notice Ends</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {redemptions.map((r: Record<string, unknown>) => (
                <tr key={r.id as string} className="border-b last:border-0">
                  <td className="py-2">
                    {new Date(r.created_at as string).toLocaleDateString()}
                  </td>
                  <td className="py-2">
                    {Number(r.token_amount).toLocaleString()} {TOKEN_SYMBOL}
                  </td>
                  <td className="py-2">${Number(r.nav_at_request).toFixed(2)}</td>
                  <td className="py-2">
                    ${Number(r.redemption_value_usdc).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-2">
                    {r.notice_period_ends
                      ? new Date(r.notice_period_ends as string).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        r.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : r.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : r.status === "cancelled"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {r.status as string}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400 text-sm">No redemption requests yet.</p>
        )}
      </div>

      {/* Info section */}
      <div className="bg-gray-50 rounded-xl p-6 mt-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">How Redemption Works</h3>
        <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
          <li>Submit a redemption request specifying the number of {TOKEN_SYMBOL} tokens to redeem.</li>
          <li>
            A {REDEMPTION_NOTICE_DAYS}-day notice period begins. Your tokens are held in escrow during
            this period.
          </li>
          <li>After the notice period, the fund manager reviews and approves the request.</li>
          <li>
            USDC payout is calculated at the NAV on the processing date and sent to your wallet.
          </li>
        </ol>
      </div>
    </div>
  );
}
