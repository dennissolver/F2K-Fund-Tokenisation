import { NextResponse } from "next/server";
import { getAdminUser, hasPermission, auditLog } from "@/lib/auth";
import { createSupabaseService } from "@/lib/supabase-service";
import { getPublicClient, getWalletClient } from "@/lib/blockchain";
import { CONTRACTS } from "@f2k/shared/contracts";
import { checkConcentrationLimits } from "@f2k/shared/concentration";
import { parseUnits } from "viem";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminUser();
  if (!admin || !hasPermission(admin.role, "manage_stakes")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createSupabaseService();

  // Fetch stake with investor and asset class — must be lien_registered
  const { data: stake, error: fetchError } = await supabase
    .from("asset_stakes")
    .select("*, investors!inner(id, wallet_address), asset_classes!inner(code)")
    .eq("id", params.id)
    .eq("status", "lien_registered")
    .single();

  if (fetchError || !stake) {
    return NextResponse.json(
      { error: "Stake not found or not in lien_registered status" },
      { status: 404 }
    );
  }

  // Get current NAV
  const { data: latestNav } = await supabase
    .from("nav_records")
    .select("nav_per_token, total_nav")
    .eq("status", "published")
    .order("calculated_at", { ascending: false })
    .limit(1)
    .single();

  const navPerToken = latestNav ? Number(latestNav.nav_per_token) : 1.0;
  const collateralValue = Number(stake.collateral_value);

  // Concentration limit check — HARD BLOCK at mint (no force override)
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

  const assetClassCode = (stake.asset_classes as { code: string }).code;
  const totalFundNav = latestNav ? Number(latestNav.total_nav) : 0;

  const concentrationResult = checkConcentrationLimits({
    currentStakes,
    proposedClassCode: assetClassCode,
    proposedCollateralValue: collateralValue,
    totalFundNav,
  });

  if (!concentrationResult.allowed) {
    return NextResponse.json(
      {
        error: "Concentration limit violated — minting blocked",
        violations: concentrationResult.violations,
        exposure: concentrationResult.exposure,
      },
      { status: 400 }
    );
  }
  const tokensToMint = collateralValue / navPerToken;

  const investor = stake.investors as { id: string; wallet_address: string | null };
  let mintTxHash: string | null = null;

  // Create synthetic subscription record
  const { data: subscription, error: subError } = await supabase
    .from("subscriptions")
    .insert({
      investor_id: investor.id,
      amount_usdc: collateralValue,
      token_price: navPerToken,
      tokens_to_mint: tokensToMint,
      status: "minted",
      source: "asset_stake",
      confirmed_by: admin.id,
      confirmed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (subError || !subscription) {
    return NextResponse.json({ error: subError?.message || "Failed to create subscription" }, { status: 500 });
  }

  // Attempt on-chain token mint
  if (
    CONTRACTS.token.address !== "0x0000000000000000000000000000000000000000" &&
    investor.wallet_address
  ) {
    try {
      const walletClient = getWalletClient();
      const publicClient = getPublicClient();

      const tokensWei = parseUnits(String(tokensToMint), 6);

      const hash = await walletClient.writeContract({
        address: CONTRACTS.token.address,
        abi: [
          {
            inputs: [
              { name: "to", type: "address" },
              { name: "amount", type: "uint256" },
            ],
            name: "mint",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ] as const,
        functionName: "mint",
        args: [investor.wallet_address as `0x${string}`, tokensWei],
      });

      await publicClient.waitForTransactionReceipt({ hash });
      mintTxHash = hash;
    } catch (err) {
      console.error("On-chain token mint failed for stake:", err);
    }
  }

  // Update subscription with mint tx
  if (mintTxHash) {
    await supabase
      .from("subscriptions")
      .update({ mint_tx_hash: mintTxHash })
      .eq("id", subscription.id);
  }

  // Update stake to tokens_minted
  const { error } = await supabase
    .from("asset_stakes")
    .update({
      status: "tokens_minted",
      nav_at_stake: navPerToken,
      tokens_to_mint: tokensToMint,
      subscription_id: subscription.id,
    })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await auditLog(admin.id, admin.email, "stake_tokens_minted", "asset_stake", params.id, {
    tokens_to_mint: tokensToMint,
    nav_per_token: navPerToken,
    collateral_value: collateralValue,
    subscription_id: subscription.id,
    mint_tx_hash: mintTxHash,
  });

  return NextResponse.json({
    ok: true,
    tokens_minted: tokensToMint,
    subscription_id: subscription.id,
    mint_tx_hash: mintTxHash,
  });
}
