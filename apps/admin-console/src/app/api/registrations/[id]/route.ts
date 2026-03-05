import { NextResponse } from "next/server";
import { getAdminUser, hasPermission, auditLog } from "@/lib/auth";
import { createSupabaseService } from "@/lib/supabase-service";
import { roiStatusUpdateSchema } from "@f2k/shared/validation";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminUser();
  if (!admin || !hasPermission(admin.role, "manage_registrations")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createSupabaseService();
  const { data: registration, error } = await (supabase.from("registrations_of_interest") as any)
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !registration) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ registration });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminUser();
  if (!admin || !hasPermission(admin.role, "manage_registrations")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = roiStatusUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const supabase = createSupabaseService();

  const { data: registration, error } = await (supabase.from("registrations_of_interest") as any)
    .update({
      status: parsed.data.status,
      notes: parsed.data.notes ?? null,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Audit log
  await auditLog(
    admin.id,
    admin.email,
    "roi_status_updated",
    "registration_of_interest",
    params.id,
    { status: parsed.data.status, notes: parsed.data.notes }
  );

  return NextResponse.json({ registration });
}
