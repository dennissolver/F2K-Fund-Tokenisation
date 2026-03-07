import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { createSupabaseService } from "@/lib/supabase-service";
import { marketplaceListSchema } from "@f2k/shared/validation";

export async function POST(request: Request) {
  const supabase = createSupabaseServer();
  const serviceClient = createSupabaseService();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = marketplaceListSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { token_amount, price_per_token, tx_hash, expires_in_days } = parsed.data;

  // Get investor
  const { data: investor } = await serviceClient
    .from("investors")
    .select("id, kyc_status")
    .eq("auth_user_id", user.id)
    .single();

  if (!investor) {
    return NextResponse.json({ error: "Investor record not found" }, { status: 404 });
  }

  if (investor.kyc_status !== "approved") {
    return NextResponse.json({ error: "KYC must be approved" }, { status: 403 });
  }

  // Check available tokens (minted minus active redemptions minus active listings)
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

  if (token_amount > availableTokens) {
    return NextResponse.json(
      { error: `Insufficient available tokens. You have ${availableTokens.toLocaleString()} available.` },
      { status: 400 }
    );
  }

  const totalPrice = token_amount * price_per_token;

  // Calculate expiry if specified
  let expiresAt: string | null = null;
  if (expires_in_days) {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + expires_in_days);
    expiresAt = expiry.toISOString();
  }

  // Create listing
  const { data: listing, error } = await (serviceClient.from("marketplace_listings") as any)
    .insert({
      seller_id: investor.id,
      token_amount,
      price_per_token,
      total_price_usdc: totalPrice,
      status: "active",
      transfer_tx_hash: tx_hash ?? null,
      expires_at: expiresAt,
    } as never)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Audit log
  await serviceClient.from("audit_log").insert({
    actor_id: user.id,
    actor_email: user.email,
    action: "marketplace_listing_created",
    entity_type: "marketplace_listing",
    entity_id: listing.id,
    details: { token_amount, price_per_token, total_price_usdc: totalPrice },
  });

  return NextResponse.json({ listing });
}
