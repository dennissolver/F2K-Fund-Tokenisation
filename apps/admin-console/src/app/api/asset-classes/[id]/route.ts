import { NextResponse } from "next/server";
import { getAdminUser, hasPermission, auditLog } from "@/lib/auth";
import { createSupabaseService } from "@/lib/supabase-service";
import { assetClassUpdateSchema } from "@f2k/shared/validation";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminUser();
  if (!admin || !hasPermission(admin.role, "manage_asset_classes")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = assetClassUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const supabase = createSupabaseService();

  // Build update object from provided fields
  const updates: Record<string, unknown> = {};
  if (parsed.data.ltv_ratio !== undefined) updates.ltv_ratio = parsed.data.ltv_ratio;
  if (parsed.data.enabled !== undefined) updates.enabled = parsed.data.enabled;
  if (parsed.data.min_value_usd !== undefined) updates.min_value_usd = parsed.data.min_value_usd;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No updates provided" }, { status: 400 });
  }

  const { data: updated, error } = await supabase
    .from("asset_classes")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await auditLog(admin.id, admin.email, "asset_class_updated", "asset_class", params.id, updates);

  return NextResponse.json({ asset_class: updated });
}
