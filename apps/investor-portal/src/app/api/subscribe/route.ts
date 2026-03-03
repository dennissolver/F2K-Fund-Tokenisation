import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { createSupabaseService } from "@/lib/supabase-service";
import { subscribeSchema } from "@f2k/shared/validation";

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
  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { amount_usdc, tx_hash } = parsed.data;

  // Get investor
  const { data: investor } = await serviceClient
    .from("investors")
    .select("id, kyc_status")
    .eq("auth_user_id", user.id)
    .single();

  if (!investor) {
    return NextResponse.json(
      { error: "Investor record not found" },
      { status: 404 }
    );
  }

  if (investor.kyc_status !== "approved") {
    return NextResponse.json(
      { error: "KYC must be approved before subscribing" },
      { status: 403 }
    );
  }

  // Get current NAV (or default to 1.0 if none published)
  const { data: latestNav } = await serviceClient
    .from("nav_records")
    .select("nav_per_token")
    .eq("status", "published")
    .order("calculated_at", { ascending: false })
    .limit(1)
    .single();

  const tokenPrice = latestNav ? Number(latestNav.nav_per_token) : 1.0;
  const tokensToMint = amount_usdc / tokenPrice;

  // Create subscription
  const { data: subscription, error } = await serviceClient
    .from("subscriptions")
    .insert({
      investor_id: investor.id,
      amount_usdc,
      token_price: tokenPrice,
      tokens_to_mint: tokensToMint,
      tx_hash: tx_hash ?? null,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Audit log
  await serviceClient.from("audit_log").insert({
    actor_id: user.id,
    actor_email: user.email,
    action: "subscription_created",
    entity_type: "subscription",
    entity_id: subscription.id,
    details: { amount_usdc, token_price: tokenPrice, tokens_to_mint: tokensToMint },
  });

  return NextResponse.json({ subscription });
}
