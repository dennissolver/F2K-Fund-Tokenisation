import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { createSupabaseService } from "@/lib/supabase-service";
import { marketplaceBuySchema } from "@f2k/shared/validation";

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
  const parsed = marketplaceBuySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { listing_id, tx_hash } = parsed.data;

  // Get buyer investor
  const { data: buyer } = await serviceClient
    .from("investors")
    .select("id, kyc_status, wallet_address")
    .eq("auth_user_id", user.id)
    .single();

  if (!buyer) {
    return NextResponse.json({ error: "Investor record not found" }, { status: 404 });
  }

  if (buyer.kyc_status !== "approved") {
    return NextResponse.json({ error: "KYC must be approved to buy tokens" }, { status: 403 });
  }

  // Check buyer is on allowlist
  const { data: allowlistEntry } = await serviceClient
    .from("allowlist")
    .select("status")
    .eq("investor_id", buyer.id)
    .eq("status", "approved")
    .single();

  if (!allowlistEntry) {
    return NextResponse.json(
      { error: "Your wallet must be on the allowlist to purchase tokens" },
      { status: 403 }
    );
  }

  // Get listing
  const { data: listing } = await (serviceClient.from("marketplace_listings") as any)
    .select("*")
    .eq("id", listing_id)
    .single();

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  if (listing.status !== "active") {
    return NextResponse.json({ error: "Listing is no longer active" }, { status: 400 });
  }

  if (listing.seller_id === buyer.id) {
    return NextResponse.json({ error: "Cannot buy your own listing" }, { status: 400 });
  }

  // Check expiry
  if (listing.expires_at && new Date(listing.expires_at) < new Date()) {
    // Mark as expired
    await (serviceClient.from("marketplace_listings") as any)
      .update({ status: "expired" } as never)
      .eq("id", listing_id);
    return NextResponse.json({ error: "Listing has expired" }, { status: 400 });
  }

  // Update listing as filled
  const { error } = await (serviceClient.from("marketplace_listings") as any)
    .update({
      status: "filled",
      buyer_id: buyer.id,
      filled_at: new Date().toISOString(),
      settlement_tx_hash: tx_hash ?? null,
    } as never)
    .eq("id", listing_id)
    .eq("status", "active"); // Optimistic lock — only update if still active

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Audit log
  await serviceClient.from("audit_log").insert({
    actor_id: user.id,
    actor_email: user.email,
    action: "marketplace_purchase",
    entity_type: "marketplace_listing",
    entity_id: listing_id,
    details: {
      seller_id: listing.seller_id,
      token_amount: listing.token_amount,
      price_per_token: listing.price_per_token,
      total_price_usdc: listing.total_price_usdc,
    },
  });

  return NextResponse.json({ success: true, listing_id });
}
