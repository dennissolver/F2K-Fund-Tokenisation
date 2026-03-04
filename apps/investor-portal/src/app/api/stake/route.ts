import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { createSupabaseService } from "@/lib/supabase-service";
import { stakeSubmitSchema } from "@f2k/shared/validation";

export async function POST(request: Request) {
  const supabase = createSupabaseServer();
  const service = createSupabaseService();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = stakeSubmitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { asset_class_id, description, declared_value } = parsed.data;

  // Get investor
  const { data: investor } = await service
    .from("investors")
    .select("id, kyc_status")
    .eq("auth_user_id", user.id)
    .single();

  if (!investor) {
    return NextResponse.json({ error: "Investor record not found" }, { status: 404 });
  }

  if (investor.kyc_status !== "approved") {
    return NextResponse.json(
      { error: "KYC must be approved before staking assets" },
      { status: 403 }
    );
  }

  // Validate asset class exists and is enabled
  const { data: assetClass } = await service
    .from("asset_classes")
    .select("*")
    .eq("id", asset_class_id)
    .eq("enabled", true)
    .single();

  if (!assetClass) {
    return NextResponse.json({ error: "Invalid or disabled asset class" }, { status: 400 });
  }

  if (declared_value < Number(assetClass.min_value_usd)) {
    return NextResponse.json(
      { error: `Minimum value for ${assetClass.label} is $${assetClass.min_value_usd}` },
      { status: 400 }
    );
  }

  // Create stake in draft status
  const { data: stake, error } = await service
    .from("asset_stakes")
    .insert({
      investor_id: investor.id,
      asset_class_id,
      description,
      declared_value,
      status: "draft",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await service.from("audit_log").insert({
    actor_id: user.id,
    actor_email: user.email,
    action: "stake_created",
    entity_type: "asset_stake",
    entity_id: stake.id,
    details: { asset_class_id, declared_value },
  });

  return NextResponse.json({ stake });
}

export async function GET(request: Request) {
  const supabase = createSupabaseServer();
  const service = createSupabaseService();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: investor } = await service
    .from("investors")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (!investor) {
    return NextResponse.json({ error: "Investor record not found" }, { status: 404 });
  }

  const { data: stakes, error } = await service
    .from("asset_stakes")
    .select("*, asset_classes(*)")
    .eq("investor_id", investor.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ stakes });
}
