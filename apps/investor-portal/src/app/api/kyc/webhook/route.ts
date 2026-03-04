import { NextResponse } from "next/server";
import { createSupabaseService } from "@/lib/supabase-service";
import crypto from "crypto";
import { kycWebhookSchema } from "@f2k/shared/validation";

export async function POST(request: Request) {
  const supabase = createSupabaseService();
  // Verify Sumsub webhook signature
  const body = await request.text();
  const signature = request.headers.get("x-payload-digest");

  if (process.env.SUMSUB_SECRET_KEY && signature) {
    const expectedSignature = crypto
      .createHmac("sha1", process.env.SUMSUB_SECRET_KEY)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  const raw = JSON.parse(body);
  const parsed = kycWebhookSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { type, externalUserId, reviewResult } = parsed.data;

  if (type === "applicantReviewed") {
    const kycStatus =
      reviewResult?.reviewAnswer === "GREEN" ? "approved" : "rejected";

    const { error } = await supabase
      .from("investors")
      .update({
        kyc_status: kycStatus,
        kyc_completed_at:
          kycStatus === "approved" ? new Date().toISOString() : null,
      })
      .eq("kyc_provider_id", externalUserId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Audit log
    await supabase.from("audit_log").insert({
      action: `kyc_${kycStatus}`,
      entity_type: "investor",
      details: { provider: "sumsub", external_user_id: externalUserId },
    });
  }

  return NextResponse.json({ ok: true });
}
