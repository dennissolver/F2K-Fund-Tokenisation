import { NextResponse } from "next/server";
import { getAdminUser, hasPermission, auditLog } from "@/lib/auth";
import { createSupabaseService } from "@/lib/supabase-service";
import { getPublicClient, getWalletClient } from "@/lib/blockchain";
import { CONTRACTS } from "@f2k/shared/contracts";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminUser();
  if (!admin || !hasPermission(admin.role, "manage_nav")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createSupabaseService();

  // Fetch the NAV record
  const { data: navRecord, error: fetchError } = await supabase
    .from("nav_records")
    .select("*")
    .eq("id", params.id)
    .eq("status", "approved")
    .single();

  if (fetchError || !navRecord) {
    return NextResponse.json({ error: "NAV record not found or not approved" }, { status: 404 });
  }

  let txHash: string | null = null;

  // Attempt on-chain publication if contract is deployed
  if (CONTRACTS.navAttestation.address !== "0x0000000000000000000000000000000000000000") {
    try {
      const walletClient = getWalletClient();
      const publicClient = getPublicClient();

      // NAV values are stored with 6 decimals in DB, same as USDC
      const navPerToken = BigInt(Math.round(Number(navRecord.nav_per_token) * 1_000_000));
      const totalNav = BigInt(Math.round(Number(navRecord.total_nav) * 1_000_000));
      const totalSupply = BigInt(Math.round(Number(navRecord.total_supply) * 1_000_000));

      const hash = await walletClient.writeContract({
        address: CONTRACTS.navAttestation.address,
        abi: CONTRACTS.navAttestation.abi,
        functionName: "publishNav",
        args: [navPerToken, totalNav, totalSupply],
      });

      await publicClient.waitForTransactionReceipt({ hash });
      txHash = hash;
    } catch (err) {
      console.error("On-chain NAV publish failed:", err);
      // Continue with off-chain publish even if on-chain fails
    }
  }

  // Update DB status
  const { error } = await supabase
    .from("nav_records")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
      on_chain_tx_hash: txHash,
    })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await auditLog(admin.id, admin.email, "nav_published", "nav_record", params.id, {
    on_chain_tx_hash: txHash,
  });

  return NextResponse.json({ ok: true, tx_hash: txHash });
}
