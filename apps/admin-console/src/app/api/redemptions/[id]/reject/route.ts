import { NextResponse } from "next/server";
import { getAdminUser, hasPermission, auditLog } from "@/lib/auth";
import { createSupabaseService } from "@/lib/supabase-service";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminUser();
  if (!admin || !hasPermission(admin.role, "confirm_subscriptions")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { reason } = body;

  const supabase = createSupabaseService();
  const { error } = await (supabase.from("redemptions") as any)
    .update({
      status: "rejected",
      rejection_reason: reason || null,
      approved_by: admin.id,
      approved_at: new Date().toISOString(),
    } as never)
    .eq("id", params.id)
    .eq("status", "pending");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await auditLog(admin.id, admin.email, "redemption_rejected", "redemption", params.id, { reason });
  return NextResponse.json({ ok: true });
}
