import { NextResponse } from "next/server";
import { getAdminUser, hasPermission, auditLog } from "@/lib/auth";
import { createSupabaseService } from "@/lib/supabase-service";

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createSupabaseService();

  const { data: records, error } = await supabase
    .from("nav_records")
    .select("*")
    .order("calculated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ records });
}

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin || !hasPermission(admin.role, "manage_nav")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { nav_per_token, total_nav, total_supply } = body;

  // Validate all three are positive numbers
  if (
    typeof nav_per_token !== "number" ||
    typeof total_nav !== "number" ||
    typeof total_supply !== "number" ||
    nav_per_token <= 0 ||
    total_nav <= 0 ||
    total_supply <= 0
  ) {
    return NextResponse.json(
      { error: "nav_per_token, total_nav, and total_supply must be positive numbers" },
      { status: 400 }
    );
  }

  const supabase = createSupabaseService();

  const { data, error } = await supabase
    .from("nav_records")
    .insert({
      nav_per_token,
      total_nav,
      total_supply,
      status: "draft",
      calculated_at: new Date().toISOString(),
      calculated_by: admin.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await auditLog(admin.id, admin.email, "nav_submitted", "nav_record", data.id);

  return NextResponse.json({ record: data });
}
