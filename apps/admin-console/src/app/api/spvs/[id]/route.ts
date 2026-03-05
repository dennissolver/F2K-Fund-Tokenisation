import { NextResponse } from "next/server";
import { getAdminUser, hasPermission, auditLog } from "@/lib/auth";
import { createSupabaseService } from "@/lib/supabase-service";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminUser();
  if (!admin || !hasPermission(admin.role, "manage_nav")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { name, status, target_allocation, current_nav, description } = body;

  // Validate status if provided
  if (status) {
    const validStatuses = ["active", "winding_down", "closed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "status must be one of: active, winding_down, closed" },
        { status: 400 }
      );
    }
  }

  // Build update object with only provided fields
  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (status !== undefined) updates.status = status;
  if (target_allocation !== undefined) updates.target_allocation = target_allocation;
  if (current_nav !== undefined) updates.current_nav = current_nav;
  if (description !== undefined) updates.description = description;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const supabase = createSupabaseService();

  const { data, error } = await supabase
    .from("spvs")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await auditLog(admin.id, admin.email, "spv_updated", "spv", params.id, updates);

  return NextResponse.json({ spv: data });
}
