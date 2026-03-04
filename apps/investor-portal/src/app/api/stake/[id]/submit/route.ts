import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { createSupabaseService } from "@/lib/supabase-service";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
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

  // Verify stake belongs to investor and is in draft
  const { data: stake } = await service
    .from("asset_stakes")
    .select("id, status, investor_id")
    .eq("id", params.id)
    .eq("investor_id", investor.id)
    .single();

  if (!stake) {
    return NextResponse.json({ error: "Stake not found" }, { status: 404 });
  }

  if (stake.status !== "draft") {
    return NextResponse.json(
      { error: "Only draft stakes can be submitted" },
      { status: 400 }
    );
  }

  const { error } = await service
    .from("asset_stakes")
    .update({ status: "submitted" })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await service.from("audit_log").insert({
    actor_id: user.id,
    actor_email: user.email,
    action: "stake_submitted",
    entity_type: "asset_stake",
    entity_id: params.id,
    details: {},
  });

  return NextResponse.json({ success: true });
}
