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

  // For now: mark as published (Module 5 will add on-chain publication)
  const { error } = await supabase
    .from("nav_records")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
    })
    .eq("id", params.id)
    .eq("status", "approved");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await auditLog(admin.id, admin.email, "nav_published", "nav_record", params.id);
  return NextResponse.json({ ok: true });
}
