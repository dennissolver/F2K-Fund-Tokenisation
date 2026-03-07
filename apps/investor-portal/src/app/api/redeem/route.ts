import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { createSupabaseService } from "@/lib/supabase-service";
import { redeemRequestSchema } from "@f2k/shared/validation";
import { REDEMPTION_NOTICE_DAYS } from "@f2k/shared";

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
  const parsed = redeemRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { token_amount, tx_hash } = parsed.data;

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

  // Check investor has sufficient token balance (from minted subscriptions minus previous redemptions)
  const { data: mintedSubs } = await serviceClient
    .from("subscriptions")
    .select("tokens_to_mint")
    .eq("investor_id", investor.id)
    .eq("status", "minted");

  const totalMinted = (mintedSubs || []).reduce(
    (sum, s) => sum + Number(s.tokens_to_mint),
    0
  );

  // Subtract tokens in pending/approved/processing redemptions
  const { data: activeRedemptions } = await (serviceClient.from("redemptions") as any)
    .select("token_amount")
    .eq("investor_id", investor.id)
    .in("status", ["pending", "approved", "processing"]);

  const tokensInRedemption = (activeRedemptions || []).reduce(
    (sum: number, r: { token_amount: number }) => sum + Number(r.token_amount),
    0
  );

  // Subtract tokens in active marketplace listings
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

  // Get current NAV
  const { data: latestNav } = await serviceClient
    .from("nav_records")
    .select("nav_per_token")
    .eq("status", "published")
    .order("calculated_at", { ascending: false })
    .limit(1)
    .single();

  const navPerToken = latestNav ? Number(latestNav.nav_per_token) : 1.0;
  const redemptionValue = token_amount * navPerToken;

  // Calculate notice period end
  const noticePeriodEnds = new Date();
  noticePeriodEnds.setDate(noticePeriodEnds.getDate() + REDEMPTION_NOTICE_DAYS);

  // Create redemption request
  const { data: redemption, error } = await (serviceClient.from("redemptions") as any)
    .insert({
      investor_id: investor.id,
      token_amount,
      nav_at_request: navPerToken,
      redemption_value_usdc: redemptionValue,
      status: "pending",
      notice_period_ends: noticePeriodEnds.toISOString(),
      burn_tx_hash: tx_hash ?? null,
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
    action: "redemption_requested",
    entity_type: "redemption",
    entity_id: redemption.id,
    details: { token_amount, nav_per_token: navPerToken, redemption_value_usdc: redemptionValue },
  });

  return NextResponse.json({ redemption });
}
