import { NextResponse } from "next/server";
import { getAdminUser, hasPermission, auditLog } from "@/lib/auth";
import { createSupabaseService } from "@/lib/supabase-service";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminUser();
  if (!admin || !hasPermission(admin.role, "manage_stakes")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { new_appraised_value: number; ltv_override?: number; reason: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { new_appraised_value, ltv_override, reason } = body;

  // Validate inputs
  if (typeof new_appraised_value !== "number" || new_appraised_value <= 0) {
    return NextResponse.json(
      { error: "new_appraised_value must be a positive number" },
      { status: 400 }
    );
  }

  if (typeof reason !== "string" || reason.trim().length === 0) {
    return NextResponse.json(
      { error: "reason is required and must be a non-empty string" },
      { status: 400 }
    );
  }

  if (ltv_override !== undefined && (typeof ltv_override !== "number" || ltv_override <= 0 || ltv_override > 1)) {
    return NextResponse.json(
      { error: "ltv_override must be a number between 0 and 1 (exclusive)" },
      { status: 400 }
    );
  }

  const supabase = createSupabaseService();

  // Fetch current stake with asset_classes join
  const { data: stake, error: fetchError } = await supabase
    .from("asset_stakes")
    .select("*, asset_classes(*)")
    .eq("id", params.id)
    .single();

  if (fetchError || !stake) {
    return NextResponse.json({ error: "Stake not found" }, { status: 404 });
  }

  // Stake must be in an approved-like status
  if (!["approved", "lien_registered", "tokens_minted"].includes(stake.status)) {
    return NextResponse.json(
      { error: `Cannot revalue a stake in "${stake.status}" status. Must be approved, lien_registered, or tokens_minted.` },
      { status: 400 }
    );
  }

  const previous_appraised_value = stake.appraised_value;
  const previous_collateral_value = stake.collateral_value;
  const previous_ltv = stake.ltv_ratio_applied;

  // Calculate new values
  const effective_ltv = ltv_override ?? stake.ltv_ratio_applied;
  const new_collateral_value = new_appraised_value * effective_ltv;

  // Build revaluation note
  const timestamp = new Date().toISOString();
  const revalNote = `[Revaluation ${timestamp}] ${reason} | Previous: $${Number(previous_appraised_value).toLocaleString()} -> New: $${Number(new_appraised_value).toLocaleString()}`;
  const updatedNotes = stake.review_notes
    ? `${stake.review_notes}\n${revalNote}`
    : revalNote;

  // Update the stake
  const updatePayload: Record<string, unknown> = {
    appraised_value: new_appraised_value,
    collateral_value: new_collateral_value,
    review_notes: updatedNotes,
  };

  if (ltv_override !== undefined) {
    updatePayload.ltv_ratio_applied = ltv_override;
  }

  const { error: updateError } = await supabase
    .from("asset_stakes")
    .update(updatePayload)
    .eq("id", params.id);

  if (updateError) {
    return NextResponse.json(
      { error: "Failed to update stake", details: updateError.message },
      { status: 500 }
    );
  }

  // Audit log
  await auditLog(admin.id, admin.email, "stake_revalued", "asset_stake", params.id, {
    previous_appraised_value,
    new_appraised_value,
    previous_collateral_value,
    new_collateral_value,
    previous_ltv,
    new_ltv: effective_ltv,
    reason,
  });

  return NextResponse.json({
    previous_appraised_value,
    new_appraised_value,
    previous_collateral_value,
    new_collateral_value,
    ltv_ratio_applied: effective_ltv,
  });
}
