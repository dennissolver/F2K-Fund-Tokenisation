import { NextResponse } from "next/server";
import { getAdminUser, hasPermission, auditLog } from "@/lib/auth";
import { createSupabaseService } from "@/lib/supabase-service";
import { kycOverrideSchema } from "@f2k/shared/validation";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminUser();
  if (!admin || !hasPermission(admin.role, "approve_kyc")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = kycOverrideSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { status } = parsed.data;

  const supabase = createSupabaseService();
  const { error } = await supabase
    .from("investors")
    .update({
      kyc_status: status,
      kyc_completed_at: status === "approved" ? new Date().toISOString() : null,
    })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await auditLog(admin.id, admin.email, `kyc_override_${status}`, "investor", params.id);
  return NextResponse.json({ ok: true });
}
