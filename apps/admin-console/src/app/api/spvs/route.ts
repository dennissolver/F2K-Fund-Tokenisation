import { NextResponse } from "next/server";
import { getAdminUser, hasPermission, auditLog } from "@/lib/auth";
import { createSupabaseService } from "@/lib/supabase-service";

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createSupabaseService();

  const { data: spvs, error } = await supabase
    .from("spvs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ spvs });
}

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin || !hasPermission(admin.role, "manage_nav")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { name, entity_type, abn, target_allocation, description } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const validEntityTypes = ["unit_trust", "pty_ltd", "partnership"];
  if (!entity_type || !validEntityTypes.includes(entity_type)) {
    return NextResponse.json(
      { error: "entity_type must be one of: unit_trust, pty_ltd, partnership" },
      { status: 400 }
    );
  }

  const supabase = createSupabaseService();

  const { data, error } = await supabase
    .from("spvs")
    .insert({
      name: name.trim(),
      entity_type,
      abn: abn || null,
      target_allocation: target_allocation || null,
      description: description || null,
      created_by: admin.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await auditLog(admin.id, admin.email, "spv_created", "spv", data.id);

  return NextResponse.json({ spv: data });
}
