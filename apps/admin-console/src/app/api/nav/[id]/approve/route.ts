import { NextResponse } from "next/server";
import { getAdminUser, hasPermission, auditLog } from "@/lib/auth";
import { createSupabaseService } from "@/lib/supabase-service";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminUser();
  if (!admin || !hasPermission(admin.role, "manage_nav")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createSupabaseService();

  // Verify submitter is different from approver
  const { data: navRecord } = await supabase
    .from("nav_records")
    .select("calculated_by")
    .eq("id", params.id)
    .single();

  if (navRecord?.calculated_by === admin.id) {
    return NextResponse.json(
      { error: "Approver must be different from submitter" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("nav_records")
    .update({
      status: "approved",
      approved_by: admin.id,
      approved_at: new Date().toISOString(),
    })
    .eq("id", params.id)
    .eq("status", "draft");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await auditLog(admin.id, admin.email, "nav_approved", "nav_record", params.id);
  return NextResponse.json({ ok: true });
}
