import { NextResponse } from "next/server";
import { createSupabaseService } from "@/lib/supabase-service";
import { registerInterestSchema } from "@f2k/shared/validation";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registerInterestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  // Bot trap — silently succeed if honeypot is filled
  if (parsed.data.honeypot) {
    return NextResponse.json({ success: true });
  }

  const serviceClient = createSupabaseService();

  const { error } = await (serviceClient.from("registrations_of_interest") as any).insert({
    type: parsed.data.type,
    org_name: parsed.data.org_name,
    contact_name: parsed.data.contact_name,
    contact_email: parsed.data.contact_email,
    contact_phone: parsed.data.contact_phone ?? null,
    organisation_type: parsed.data.organisation_type ?? null,
    region: parsed.data.region ?? null,
    message: parsed.data.message ?? null,
    details: parsed.data.details ?? {},
  } as never);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Audit log
  await serviceClient.from("audit_log").insert({
    actor_id: null,
    actor_email: parsed.data.contact_email,
    action: "roi_submitted",
    entity_type: "registration_of_interest",
    entity_id: null,
    details: { type: parsed.data.type, org_name: parsed.data.org_name },
  });

  return NextResponse.json({ success: true });
}
