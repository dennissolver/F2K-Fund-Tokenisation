import { NextResponse } from "next/server";
import { getAdminUser, hasPermission, auditLog } from "@/lib/auth";
import { createSupabaseService } from "@/lib/supabase-service";
import { stakeReviewSchema } from "@f2k/shared/validation";
import { checkConcentrationLimits } from "@f2k/shared/concentration";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminUser();
  if (!admin || !hasPermission(admin.role, "manage_stakes")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = stakeReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { action, appraised_value, ltv_override, review_notes, force } = parsed.data;
  const supabase = createSupabaseService();

  // Fetch stake — must be submitted or under_review
  const { data: stake, error: fetchError } = await supabase
    .from("asset_stakes")
    .select("*, asset_classes(*)")
    .eq("id", params.id)
    .single();

  if (fetchError || !stake) {
    return NextResponse.json({ error: "Stake not found" }, { status: 404 });
  }

  if (!["submitted", "under_review"].includes(stake.status)) {
    return NextResponse.json(
      { error: `Cannot review a stake in "${stake.status}" status` },
      { status: 400 }
    );
  }

  if (action === "reject") {
    const { error } = await supabase
      .from("asset_stakes")
      .update({
        status: "rejected",
        review_notes: review_notes ?? null,
        reviewed_by: admin.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await auditLog(admin.id, admin.email, "stake_rejected", "asset_stake", params.id, {
      review_notes,
    });

    return NextResponse.json({ ok: true, status: "rejected" });
  }

  // Approve — calculate collateral value and tokens
  const assetClass = stake.asset_classes as { ltv_ratio: number; code: string };
  const finalAppraisedValue = appraised_value ?? Number(stake.declared_value);
  const finalLtv = ltv_override ?? Number(assetClass.ltv_ratio);
  const collateralValue = finalAppraisedValue * finalLtv;

  // Concentration limit check
  const activeStatuses = ["approved", "lien_registered", "tokens_minted"];
  const { data: activeStakes } = await supabase
    .from("asset_stakes")
    .select("id, collateral_value, asset_classes(code)")
    .in("status", activeStatuses)
    .neq("id", params.id);

  const currentStakes = (activeStakes || []).map((s: Record<string, unknown>) => ({
    id: s.id as string,
    collateral_value: Number(s.collateral_value) || 0,
    asset_class_code: ((s.asset_classes as unknown) as { code: string })?.code || "",
  }));

  // Get latest published NAV for denominator
  const { data: latestNav } = await supabase
    .from("nav_records")
    .select("total_nav")
    .eq("status", "published")
    .order("calculated_at", { ascending: false })
    .limit(1)
    .single();

  const totalFundNav = latestNav ? Number(latestNav.total_nav) : 0;

  const concentrationResult = checkConcentrationLimits({
    currentStakes,
    proposedClassCode: assetClass.code,
    proposedCollateralValue: collateralValue,
    totalFundNav,
  });

  if (!concentrationResult.allowed && !force) {
    return NextResponse.json(
      {
        error: "Concentration limit violated",
        violations: concentrationResult.violations,
        exposure: concentrationResult.exposure,
        hint: "Set force: true to override (audited)",
      },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("asset_stakes")
    .update({
      status: "approved",
      appraised_value: finalAppraisedValue,
      ltv_ratio_applied: finalLtv,
      collateral_value: collateralValue,
      review_notes: review_notes ?? null,
      reviewed_by: admin.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await auditLog(admin.id, admin.email, "stake_approved", "asset_stake", params.id, {
    appraised_value: finalAppraisedValue,
    ltv_ratio_applied: finalLtv,
    collateral_value: collateralValue,
    review_notes,
    concentration_override: !concentrationResult.allowed && force,
    concentration_violations: concentrationResult.violations,
  });

  return NextResponse.json({
    ok: true,
    status: "approved",
    collateral_value: collateralValue,
    concentration: concentrationResult.exposure,
  });
}
