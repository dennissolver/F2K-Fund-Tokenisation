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

  const { error } = await supabase
    .from("distributions")
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

  await auditLog(admin.id, admin.email, "distribution_approved", "distribution", params.id);
  return NextResponse.json({ ok: true });
}
