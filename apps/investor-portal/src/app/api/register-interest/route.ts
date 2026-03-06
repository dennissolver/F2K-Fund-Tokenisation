import { NextResponse } from "next/server";
import { createSupabaseService } from "@/lib/supabase-service";
import { registerInterestSchema } from "@f2k/shared/validation";

const typeLabels: Record<string, string> = {
  lender: "Lender",
  government: "Government",
  offtaker: "Offtaker",
  career: "Career",
  introducer: "Introducer",
  afsl_partner: "AFSL Partner",
};

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

  // Email notification
  const d = parsed.data;
  const detailRows = d.details
    ? Object.entries(d.details)
        .map(([k, v]) => `<tr><td style="padding:4px 8px;color:#666">${k}</td><td style="padding:4px 8px">${String(v)}</td></tr>`)
        .join("")
    : "";

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "F2K Platform <onboarding@resend.dev>",
    to: "mcmdennis@gmail.com",
    subject: `New ROI: ${typeLabels[d.type] || d.type} — ${d.org_name}`,
    html: `
      <h2 style="color:#1A2744">New Registration of Interest</h2>
      <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
        <tr><td style="padding:4px 8px;color:#666">Type</td><td style="padding:4px 8px;font-weight:bold">${typeLabels[d.type] || d.type}</td></tr>
        <tr><td style="padding:4px 8px;color:#666">Organisation</td><td style="padding:4px 8px">${d.org_name}</td></tr>
        <tr><td style="padding:4px 8px;color:#666">Contact</td><td style="padding:4px 8px">${d.contact_name}</td></tr>
        <tr><td style="padding:4px 8px;color:#666">Email</td><td style="padding:4px 8px"><a href="mailto:${d.contact_email}">${d.contact_email}</a></td></tr>
        ${d.contact_phone ? `<tr><td style="padding:4px 8px;color:#666">Phone</td><td style="padding:4px 8px">${d.contact_phone}</td></tr>` : ""}
        ${d.region ? `<tr><td style="padding:4px 8px;color:#666">Region</td><td style="padding:4px 8px">${d.region}</td></tr>` : ""}
        ${d.message ? `<tr><td style="padding:4px 8px;color:#666">Message</td><td style="padding:4px 8px">${d.message}</td></tr>` : ""}
        ${detailRows}
      </table>
      <p style="margin-top:16px;font-size:12px;color:#999">View in Admin Console to manage this registration.</p>
    `,
  }).catch((err) => {
    console.error("Failed to send ROI notification email:", err);
  });

  return NextResponse.json({ success: true });
}
