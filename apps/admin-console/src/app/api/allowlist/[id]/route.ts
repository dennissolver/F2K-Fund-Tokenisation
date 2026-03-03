import { NextResponse } from "next/server";
import { getAdminUser, hasPermission, auditLog } from "@/lib/auth";
import { createSupabaseService } from "@/lib/supabase-service";
import { getPublicClient, getWalletClient } from "@/lib/blockchain";

// Identity Registry ABI (simplified — register/remove)
const IDENTITY_REGISTRY_ABI = [
  {
    inputs: [
      { name: "userAddress", type: "address" },
      { name: "identity", type: "address" },
      { name: "country", type: "uint16" },
    ],
    name: "registerIdentity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "userAddress", type: "address" }],
    name: "deleteIdentity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminUser();
  if (!admin || !hasPermission(admin.role, "manage_allowlist")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { action } = await request.json();
  if (!["approve", "deny", "revoke"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const statusMap: Record<string, string> = {
    approve: "approved",
    deny: "denied",
    revoke: "revoked",
  };

  const supabase = createSupabaseService();

  // Fetch the allowlist entry
  const { data: entry } = await supabase
    .from("allowlist")
    .select("*")
    .eq("id", params.id)
    .single();

  let txHash: string | null = null;

  // On-chain identity registry interaction
  const registryAddress = process.env.NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS;
  if (registryAddress && registryAddress !== "0x0000000000000000000000000000000000000000" && entry?.wallet_address) {
    try {
      const walletClient = getWalletClient();
      const publicClient = getPublicClient();

      if (action === "approve") {
        // Register identity — country code 36 = Australia (ISO 3166-1 numeric)
        const hash = await walletClient.writeContract({
          address: registryAddress as `0x${string}`,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: "registerIdentity",
          args: [
            entry.wallet_address as `0x${string}`,
            entry.wallet_address as `0x${string}`, // simplified: identity = wallet
            36, // Australia
          ],
        });
        await publicClient.waitForTransactionReceipt({ hash });
        txHash = hash;
      } else if (action === "revoke") {
        const hash = await walletClient.writeContract({
          address: registryAddress as `0x${string}`,
          abi: IDENTITY_REGISTRY_ABI,
          functionName: "deleteIdentity",
          args: [entry.wallet_address as `0x${string}`],
        });
        await publicClient.waitForTransactionReceipt({ hash });
        txHash = hash;
      }
    } catch (err) {
      console.error("On-chain identity registry update failed:", err);
    }
  }

  const { error } = await supabase
    .from("allowlist")
    .update({
      status: statusMap[action],
      reviewed_by: admin.id,
      reviewed_at: new Date().toISOString(),
      on_chain_tx_hash: txHash ?? entry?.on_chain_tx_hash ?? null,
    })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await auditLog(admin.id, admin.email, `allowlist_${action}`, "allowlist", params.id, {
    on_chain_tx_hash: txHash,
  });

  return NextResponse.json({ ok: true, tx_hash: txHash });
}
