import { NextResponse } from "next/server";
import { getAdminUser, hasPermission, auditLog } from "@/lib/auth";
import { createSupabaseService } from "@/lib/supabase-service";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminUser();
  if (!admin || !hasPermission(admin.role, "create_distributions")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createSupabaseService();

  // Update distribution status to executing
  await supabase
    .from("distributions")
    .update({ status: "executing" })
    .eq("id", params.id)
    .eq("status", "approved");

  // Mark all payments as sent (Module 5 will add on-chain execution)
  const { error } = await supabase
    .from("distribution_payments")
    .update({ status: "sent" })
    .eq("distribution_id", params.id)
    .eq("status", "pending");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Mark distribution as completed
  await supabase
    .from("distributions")
    .update({
      status: "completed",
      executed_at: new Date().toISOString(),
    })
    .eq("id", params.id);

  await auditLog(admin.id, admin.email, "distribution_executed", "distribution", params.id);
  return NextResponse.json({ ok: true });
}
