import { NextResponse } from "next/server";
import { getAdminUser, hasPermission, auditLog } from "@/lib/auth";
import { createSupabaseService } from "@/lib/supabase-service";
import { stakeLienSchema } from "@f2k/shared/validation";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminUser();
  if (!admin || !hasPermission(admin.role, "manage_stakes")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = stakeLienSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { lien_reference } = parsed.data;
  const supabase = createSupabaseService();

  // Must be in approved status
  const { data: stake } = await supabase
    .from("asset_stakes")
    .select("id, status")
    .eq("id", params.id)
    .eq("status", "approved")
    .single();

  if (!stake) {
    return NextResponse.json(
      { error: "Stake not found or not in approved status" },
      { status: 404 }
    );
  }

  const { error } = await supabase
    .from("asset_stakes")
    .update({
      status: "lien_registered",
      lien_reference,
    })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await auditLog(admin.id, admin.email, "lien_registered", "asset_stake", params.id, {
    lien_reference,
  });

  return NextResponse.json({ ok: true, status: "lien_registered" });
}
