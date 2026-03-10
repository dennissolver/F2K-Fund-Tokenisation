import { NextResponse } from "next/server";
import { createSupabaseService } from "@/lib/supabase-service";
import { z } from "zod";

const schema = z.object({
  first_name: z.string().min(1, "First name is required").max(100),
  last_name: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().max(30).nullable().optional(),
  units_selected: z
    .array(z.string().regex(/^U\d{1,2}$/))
    .min(1, "Please select at least one unit"),
  price_preferences: z.record(z.string(), z.string()).optional(),
  referrer_type: z.string().max(50).nullable().optional(),
  referrer_name: z.string().max(200).nullable().optional(),
  referrer_company: z.string().max(200).nullable().optional(),
  referrer_contact: z.string().max(200).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
  consent: z.literal(true, {
    errorMap: () => ({
      message: "You must acknowledge this is a registration of interest only",
    }),
  }),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const d = parsed.data;
  const supabase = createSupabaseService();

  const { error } = await (supabase.from("branscombe_registrations") as any).insert({
    first_name: d.first_name,
    last_name: d.last_name,
    email: d.email,
    phone: d.phone ?? null,
    units_selected: d.units_selected,
    price_preferences: d.price_preferences ?? {},
    referrer_type: d.referrer_type ?? null,
    referrer_name: d.referrer_name ?? null,
    referrer_company: d.referrer_company ?? null,
    referrer_contact: d.referrer_contact ?? null,
    notes: d.notes ?? null,
    consent: true,
    source: "web-roi",
  } as never);

  if (error) {
    console.error("Branscombe registration insert error:", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }

  // Audit log
  await supabase.from("audit_log").insert({
    actor_id: null,
    actor_email: d.email,
    action: "branscombe_roi_submitted",
    entity_type: "branscombe_registration",
    entity_id: null,
    details: {
      name: `${d.first_name} ${d.last_name}`,
      units: d.units_selected,
      price_preferences: d.price_preferences,
      referrer: d.referrer_name ? `${d.referrer_name} (${d.referrer_type})` : null,
    },
  });

  // Email notification via Resend
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const unitList = d.units_selected.join(", ");
    const priceRows = d.price_preferences
      ? Object.entries(d.price_preferences)
          .map(
            ([uid, range]) =>
              `<tr><td style="padding:2px 12px;color:#666">${uid}</td><td style="padding:2px 12px">${range}</td></tr>`
          )
          .join("")
      : "";
    const referrerRow =
      d.referrer_name
        ? `<tr><td style="padding:4px 12px;color:#666">Referrer</td><td style="padding:4px 12px">${d.referrer_name}${d.referrer_company ? ` — ${d.referrer_company}` : ""}${d.referrer_contact ? ` (${d.referrer_contact})` : ""} [${d.referrer_type}]</td></tr>`
        : "";

    // Admin notification
    await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL ||
        "Branscombe Estate <onboarding@resend.dev>",
      to: "mcmdennis@gmail.com",
      subject: `Branscombe ROI: ${d.first_name} ${d.last_name} — ${unitList}`,
      html: `
        <h2 style="color:#1A2744;font-family:sans-serif">New Branscombe Estate Registration</h2>
        <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
          <tr><td style="padding:4px 12px;color:#666">Name</td><td style="padding:4px 12px;font-weight:bold">${d.first_name} ${d.last_name}</td></tr>
          <tr><td style="padding:4px 12px;color:#666">Email</td><td style="padding:4px 12px"><a href="mailto:${d.email}">${d.email}</a></td></tr>
          ${d.phone ? `<tr><td style="padding:4px 12px;color:#666">Phone</td><td style="padding:4px 12px">${d.phone}</td></tr>` : ""}
          <tr><td style="padding:4px 12px;color:#666">Units</td><td style="padding:4px 12px;font-weight:bold">${unitList}</td></tr>
          ${referrerRow}
          ${d.notes ? `<tr><td style="padding:4px 12px;color:#666">Notes</td><td style="padding:4px 12px">${d.notes}</td></tr>` : ""}
        </table>
        ${
          priceRows
            ? `<h3 style="color:#1A2744;font-family:sans-serif;margin-top:16px">Price Preferences</h3>
               <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
                 <tr style="background:#f5f5f5"><th style="padding:4px 12px;text-align:left">Unit</th><th style="padding:4px 12px;text-align:left">Price Range</th></tr>
                 ${priceRows}
               </table>`
            : ""
        }
        <p style="margin-top:16px;font-size:12px;color:#999">Branscombe Estate ROI — F2K Fund Tokenisation Project</p>
      `,
    });

    // Registrant confirmation
    await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL ||
        "Branscombe Estate <onboarding@resend.dev>",
      to: d.email,
      subject: "Branscombe Estate — Registration of Interest Confirmed",
      html: `
        <div style="max-width:600px;font-family:sans-serif">
          <div style="background:#1A2744;padding:24px 32px">
            <h1 style="color:#FFFFFF;margin:0;font-size:24px">Branscombe Estate</h1>
            <p style="color:#00B5AD;margin:4px 0 0;font-size:13px">A Factory2Key Development</p>
          </div>
          <div style="padding:32px;background:#FFFFFF">
            <p style="font-size:16px;color:#1A2744">Hi ${d.first_name},</p>
            <p style="font-size:14px;color:#4A5568;line-height:1.6">
              Thank you for registering your interest in Branscombe Estate, Claremont TAS.
              We've noted your interest in the following unit(s):
            </p>
            <div style="background:#F5F3EE;padding:16px 20px;margin:16px 0;font-size:16px;font-weight:bold;color:#1A2744">
              ${unitList}
            </div>
            <p style="font-size:14px;color:#4A5568;line-height:1.6">
              This is a registration of interest only — no deposit or commitment is required.
              We'll keep you informed as the project progresses.
            </p>
            <p style="font-size:14px;color:#4A5568;line-height:1.6">
              If you have any questions, contact Dennis McMahon at
              <a href="mailto:dennis@factory2key.com.au">dennis@factory2key.com.au</a>
              or +61 402 612 471.
            </p>
            <p style="font-size:14px;color:#1A2744;margin-top:24px">
              Kind regards,<br>
              <strong>Factory2Key Pty Ltd</strong>
            </p>
          </div>
          <div style="background:#F5F3EE;padding:16px 32px;font-size:11px;color:#999">
            Branscombe Estate — 122–124 Branscombe Road, Claremont TAS 7011<br>
            F2K Fund Tokenisation Project
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send Branscombe ROI emails:", err);
  }

  return NextResponse.json({ success: true });
}
