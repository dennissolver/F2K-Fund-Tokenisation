import { NextResponse } from "next/server";
import { getAdminUser, hasPermission, auditLog } from "@/lib/auth";
import { createSupabaseService } from "@/lib/supabase-service";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminUser();
  if (!admin || !hasPermission(admin.role, "manage_allowlist")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { action } = await request.json();
  if (!["approve", "deny", "revoke"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const statusMap: Record<string, string> = {
    approve: "approved",
    deny: "denied",
    revoke: "revoked",
  };

  const supabase = createSupabaseService();
  const { error } = await supabase
    .from("allowlist")
    .update({
      status: statusMap[action],
      reviewed_by: admin.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await auditLog(admin.id, admin.email, `allowlist_${action}`, "allowlist", params.id);
  return NextResponse.json({ ok: true });
}
