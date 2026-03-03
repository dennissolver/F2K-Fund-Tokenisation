import { NextResponse } from "next/server";
import { getAdminUser, hasPermission, auditLog } from "@/lib/auth";
import { createSupabaseService } from "@/lib/supabase-service";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminUser();
  if (!admin || !hasPermission(admin.role, "confirm_subscriptions")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createSupabaseService();

  // For now: update status to minted (Module 5 will add actual on-chain minting)
  const { error } = await supabase
    .from("subscriptions")
    .update({ status: "minted" })
    .eq("id", params.id)
    .eq("status", "confirmed");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await auditLog(admin.id, admin.email, "tokens_minted", "subscription", params.id);
  return NextResponse.json({ ok: true });
}
