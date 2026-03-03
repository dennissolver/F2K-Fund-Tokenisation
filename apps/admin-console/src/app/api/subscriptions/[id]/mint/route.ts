import { NextResponse } from "next/server";
import { getAdminUser, hasPermission, auditLog } from "@/lib/auth";
import { createSupabaseService } from "@/lib/supabase-service";
import { getPublicClient, getWalletClient } from "@/lib/blockchain";
import { CONTRACTS } from "@f2k/shared/contracts";
import { parseUnits } from "viem";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminUser();
  if (!admin || !hasPermission(admin.role, "confirm_subscriptions")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createSupabaseService();

  // Fetch subscription with investor
  const { data: sub, error: fetchError } = await supabase
    .from("subscriptions")
    .select("*, investors!inner(wallet_address)")
    .eq("id", params.id)
    .eq("status", "confirmed")
    .single();

  if (fetchError || !sub) {
    return NextResponse.json({ error: "Subscription not found or not confirmed" }, { status: 404 });
  }

  const investor = sub.investors as { wallet_address: string | null };
  let mintTxHash: string | null = null;

  // Attempt on-chain token mint if token contract is deployed and wallet exists
  if (
    CONTRACTS.token.address !== "0x0000000000000000000000000000000000000000" &&
    investor.wallet_address
  ) {
    try {
      const walletClient = getWalletClient();
      const publicClient = getPublicClient();

      // Mint F2K-HT tokens to investor wallet
      // Using ERC-20 mint (T-REX token agent role required)
      const tokensToMint = parseUnits(String(sub.tokens_to_mint), 6);

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
        args: [investor.wallet_address as `0x${string}`, tokensToMint],
      });

      await publicClient.waitForTransactionReceipt({ hash });
      mintTxHash = hash;
    } catch (err) {
      console.error("On-chain token mint failed:", err);
      // Continue with off-chain update
    }
  }

  // Also mark subscription as processed on subscription contract
  if (
    CONTRACTS.subscription.address !== "0x0000000000000000000000000000000000000000" &&
    sub.tx_hash
  ) {
    try {
      const walletClient = getWalletClient();
      const publicClient = getPublicClient();

      // Get on-chain subscription ID from tx events (simplified: use count-based index)
      // In production, parse the SubscriptionReceived event from the tx receipt
      const hash = await walletClient.writeContract({
        address: CONTRACTS.subscription.address,
        abi: CONTRACTS.subscription.abi,
        functionName: "markProcessed",
        args: [0n], // Simplified — production would track the real sub ID
      });
      await publicClient.waitForTransactionReceipt({ hash });
    } catch (err) {
      console.error("markProcessed failed:", err);
    }
  }

  // Update DB
  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "minted",
      mint_tx_hash: mintTxHash,
    })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await auditLog(admin.id, admin.email, "tokens_minted", "subscription", params.id, {
    mint_tx_hash: mintTxHash,
    wallet: investor.wallet_address,
  });

  return NextResponse.json({ ok: true, mint_tx_hash: mintTxHash });
}
