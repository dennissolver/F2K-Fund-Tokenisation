import { NextResponse } from "next/server";
import { getAdminUser, hasPermission } from "@/lib/auth";
import { createSupabaseService } from "@/lib/supabase-service";

export async function GET() {
  const admin = await getAdminUser();
  if (!admin || !hasPermission(admin.role, "manage_asset_classes")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const service = createSupabaseService();

  const { data: classes, error } = await service
    .from("asset_classes")
    .select("*")
    .order("code");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ classes });
}
