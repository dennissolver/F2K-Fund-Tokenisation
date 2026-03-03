import { NextResponse } from "next/server";
import { getAdminUser, hasPermission, auditLog } from "@/lib/auth";
import { createSupabaseService } from "@/lib/supabase-service";
import { getPublicClient, getWalletClient, getDeployerAccount } from "@/lib/blockchain";
import { CONTRACTS } from "@f2k/shared/contracts";
import { parseUnits } from "viem";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminUser();
  if (!admin || !hasPermission(admin.role, "create_distributions")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createSupabaseService();

  // Update distribution status to executing
  await supabase
    .from("distributions")
    .update({ status: "executing" })
    .eq("id", params.id)
    .eq("status", "approved");

  // Fetch payments with investor wallet addresses
  const { data: payments, error: fetchError } = await supabase
    .from("distribution_payments")
    .select("*, investors!inner(wallet_address)")
    .eq("distribution_id", params.id)
    .eq("status", "pending");

  if (fetchError || !payments || payments.length === 0) {
    return NextResponse.json({ error: "No payments found" }, { status: 404 });
  }

  let distributionTxHash: string | null = null;

  // Attempt on-chain distribution if contract is deployed
  if (CONTRACTS.distribution.address !== "0x0000000000000000000000000000000000000000") {
    try {
      const walletClient = getWalletClient();
      const publicClient = getPublicClient();
      const account = getDeployerAccount();

      // Build arrays for on-chain call
      const recipients: `0x${string}`[] = [];
      const amounts: bigint[] = [];

      for (const payment of payments) {
        const investor = payment.investors as { wallet_address: string | null };
        if (!investor.wallet_address) continue;
        recipients.push(investor.wallet_address as `0x${string}`);
        amounts.push(parseUnits(String(payment.amount_usdc), 6));
      }

      if (recipients.length > 0) {
        // Calculate total and approve USDC spend
        const totalAmount = amounts.reduce((a, b) => a + b, 0n);

        const approveHash = await walletClient.writeContract({
          address: CONTRACTS.usdc.address,
          abi: CONTRACTS.usdc.abi,
          functionName: "approve",
          args: [CONTRACTS.distribution.address, totalAmount],
        });
        await publicClient.waitForTransactionReceipt({ hash: approveHash });

        // Execute distribution
        const hash = await walletClient.writeContract({
          address: CONTRACTS.distribution.address,
          abi: CONTRACTS.distribution.abi,
          functionName: "distribute",
          args: [recipients, amounts],
        });
        await publicClient.waitForTransactionReceipt({ hash });
        distributionTxHash = hash;
      }
    } catch (err) {
      console.error("On-chain distribution failed:", err);
      // Continue with off-chain update
    }
  }

  // Update all payments
  const { error: updateError } = await supabase
    .from("distribution_payments")
    .update({
      status: distributionTxHash ? "confirmed" : "sent",
      tx_hash: distributionTxHash,
    })
    .eq("distribution_id", params.id)
    .eq("status", "pending");

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Mark distribution as completed
  await supabase
    .from("distributions")
    .update({
      status: "completed",
      executed_at: new Date().toISOString(),
    })
    .eq("id", params.id);

  await auditLog(admin.id, admin.email, "distribution_executed", "distribution", params.id, {
    on_chain_tx_hash: distributionTxHash,
    payment_count: payments.length,
  });

  return NextResponse.json({ ok: true, tx_hash: distributionTxHash });
}
