import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { createSupabaseService } from "@/lib/supabase-service";

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
  const { listing_id } = body;

  if (!listing_id) {
    return NextResponse.json({ error: "listing_id is required" }, { status: 400 });
  }

  // Get investor
  const { data: investor } = await serviceClient
    .from("investors")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (!investor) {
    return NextResponse.json({ error: "Investor record not found" }, { status: 404 });
  }

  // Get listing and verify ownership
  const { data: listing } = await (serviceClient.from("marketplace_listings") as any)
    .select("*")
    .eq("id", listing_id)
    .single();

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  if (listing.seller_id !== investor.id) {
    return NextResponse.json({ error: "You can only cancel your own listings" }, { status: 403 });
  }

  if (listing.status !== "active") {
    return NextResponse.json({ error: "Only active listings can be cancelled" }, { status: 400 });
  }

  // Cancel listing
  const { error } = await (serviceClient.from("marketplace_listings") as any)
    .update({ status: "cancelled" } as never)
    .eq("id", listing_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Audit log
  await serviceClient.from("audit_log").insert({
    actor_id: user.id,
    actor_email: user.email,
    action: "marketplace_listing_cancelled",
    entity_type: "marketplace_listing",
    entity_id: listing_id,
    details: { token_amount: listing.token_amount, price_per_token: listing.price_per_token },
  });

  return NextResponse.json({ success: true });
}
