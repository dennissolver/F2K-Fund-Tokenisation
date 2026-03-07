import { createSupabaseServer } from "@/lib/supabase-server";
import { createSupabaseService } from "@/lib/supabase-service";
import { TOKEN_SYMBOL, MARKETPLACE_FEE_BPS } from "@f2k/shared";
import CreateListingForm from "@/components/CreateListingForm";
import MarketplaceBuyButton from "@/components/MarketplaceBuyButton";
import CancelListingButton from "@/components/CancelListingButton";

export const dynamic = "force-dynamic";

export default async function MarketplacePage() {
  const supabase = createSupabaseServer();
  const serviceClient = createSupabaseService();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Please sign in to access the marketplace.</p>
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

  if (!investor || investor.kyc_status !== "approved") {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-8 shadow-sm border text-center">
          <h2 className="text-xl font-bold text-navy mb-2">Access Restricted</h2>
          <p className="text-gray-600">
            {!investor
              ? "Complete onboarding to access the marketplace."
              : "KYC must be approved to trade on the marketplace."}
          </p>
        </div>
      </div>
    );
  }

  // Calculate available tokens for listing
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

  const { data: myActiveListings } = await (serviceClient.from("marketplace_listings") as any)
    .select("token_amount")
    .eq("seller_id", investor.id)
    .eq("status", "active");

  const tokensInListings = (myActiveListings || []).reduce(
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

  // Get all active listings
  const { data: allListings } = await (serviceClient.from("marketplace_listings") as any)
    .select("*, seller:seller_id(id, wallet_address)")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  // Get user's own listings (all statuses)
  const { data: userListings } = await (serviceClient.from("marketplace_listings") as any)
    .select("*")
    .eq("seller_id", investor.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">Token Marketplace</h1>
        <div className="text-sm text-gray-500">
          Platform fee: {(MARKETPLACE_FEE_BPS / 100).toFixed(2)}%
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Active Listings */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-bold text-navy mb-4">Active Listings</h3>
            {allListings && allListings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="pb-2">Tokens</th>
                      <th className="pb-2">Price/Token</th>
                      <th className="pb-2">Total (USDC)</th>
                      <th className="pb-2">vs NAV</th>
                      <th className="pb-2">Expires</th>
                      <th className="pb-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {allListings.map((l: Record<string, unknown>) => {
                      const listingPrice = Number(l.price_per_token);
                      const navDiff = ((listingPrice - navPerToken) / navPerToken) * 100;
                      const isMine = (l.seller_id as string) === investor.id;

                      return (
                        <tr key={l.id as string} className="border-b last:border-0">
                          <td className="py-3">
                            {Number(l.token_amount).toLocaleString()} {TOKEN_SYMBOL}
                          </td>
                          <td className="py-3">${listingPrice.toFixed(2)}</td>
                          <td className="py-3 font-semibold">
                            ${Number(l.total_price_usdc).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td className="py-3">
                            <span
                              className={`text-xs font-medium ${
                                navDiff >= 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {navDiff >= 0 ? "+" : ""}
                              {navDiff.toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-3 text-xs text-gray-500">
                            {l.expires_at
                              ? new Date(l.expires_at as string).toLocaleDateString()
                              : "No expiry"}
                          </td>
                          <td className="py-3">
                            {isMine ? (
                              <CancelListingButton listingId={l.id as string} />
                            ) : (
                              <MarketplaceBuyButton
                                listingId={l.id as string}
                                tokenAmount={Number(l.token_amount)}
                                totalPriceUsdc={Number(l.total_price_usdc)}
                                tokenSymbol={TOKEN_SYMBOL}
                              />
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400 text-sm py-4 text-center">
                No active listings. Be the first to list tokens for sale.
              </p>
            )}
          </div>

          {/* My Listings History */}
          {userListings && userListings.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-4">My Listings</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Tokens</th>
                    <th className="pb-2">Price/Token</th>
                    <th className="pb-2">Total</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {userListings.map((l: Record<string, unknown>) => (
                    <tr key={l.id as string} className="border-b last:border-0">
                      <td className="py-2">
                        {new Date(l.created_at as string).toLocaleDateString()}
                      </td>
                      <td className="py-2">
                        {Number(l.token_amount).toLocaleString()} {TOKEN_SYMBOL}
                      </td>
                      <td className="py-2">${Number(l.price_per_token).toFixed(2)}</td>
                      <td className="py-2">
                        ${Number(l.total_price_usdc).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            l.status === "filled"
                              ? "bg-green-100 text-green-700"
                              : l.status === "active"
                              ? "bg-blue-100 text-blue-700"
                              : l.status === "expired"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {l.status as string}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Create Listing */}
        <div>
          <CreateListingForm availableTokens={availableTokens} navPerToken={navPerToken} />

          <div className="bg-gray-50 rounded-xl p-5 mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">How It Works</h3>
            <ol className="text-xs text-gray-600 space-y-2 list-decimal list-inside">
              <li>List your {TOKEN_SYMBOL} tokens at your desired price.</li>
              <li>Tokens are held in escrow while the listing is active.</li>
              <li>Another approved investor purchases your listing.</li>
              <li>You receive USDC minus the {(MARKETPLACE_FEE_BPS / 100).toFixed(2)}% platform fee.</li>
              <li>Cancel anytime to return tokens from escrow.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
