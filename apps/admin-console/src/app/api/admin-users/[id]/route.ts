import { NextResponse } from "next/server";
import { getAdminUser, hasPermission, auditLog } from "@/lib/auth";
import { createSupabaseService } from "@/lib/supabase-service";

const VALID_ROLES = ["super_admin", "fund_manager", "compliance", "read_only"] as const;

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(admin.role, "manage_admin_users")) {
    return NextResponse.json({ error: "Forbidden: super_admin only" }, { status: 403 });
  }

  const { id } = params;
  const body = await request.json();
  const { role, full_name } = body as { role?: string; full_name?: string };

  if (role && !VALID_ROLES.includes(role as (typeof VALID_ROLES)[number])) {
    return NextResponse.json(
      { error: `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}` },
      { status: 400 }
    );
  }

  const updates: Record<string, string> = {};
  if (role) updates.role = role;
  if (full_name) updates.full_name = full_name;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const supabase = createSupabaseService();
  const { data, error } = await supabase
    .from("admin_users")
    .update(updates as never)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await auditLog(
    admin.id,
    admin.email,
    "admin_user_updated",
    "admin_users",
    id,
    { updates }
  );

  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(admin.role, "manage_admin_users")) {
    return NextResponse.json({ error: "Forbidden: super_admin only" }, { status: 403 });
  }

  const { id } = params;

  if (admin.id === id) {
    return NextResponse.json(
      { error: "Cannot delete yourself" },
      { status: 400 }
    );
  }

  const supabase = createSupabaseService();
  const { error } = await supabase
    .from("admin_users")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await auditLog(
    admin.id,
    admin.email,
    "admin_user_removed",
    "admin_users",
    id,
    {}
  );

  return NextResponse.json({ success: true });
}
