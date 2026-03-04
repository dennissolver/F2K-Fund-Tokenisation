import { NextResponse } from "next/server";
import { getAdminUser, hasPermission } from "@/lib/auth";
import { createSupabaseService } from "@/lib/supabase-service";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminUser();
  if (!admin || !hasPermission(admin.role, "manage_stakes")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createSupabaseService();

  const { data: stake, error } = await supabase
    .from("asset_stakes")
    .select("*, investors(full_name, email, wallet_address), asset_classes(label, code, ltv_ratio)")
    .eq("id", params.id)
    .single();

  if (error || !stake) {
    return NextResponse.json({ error: "Stake not found" }, { status: 404 });
  }

  return NextResponse.json({ stake });
}
