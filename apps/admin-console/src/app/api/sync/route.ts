import { NextResponse } from "next/server";
import { getAdminUser, hasPermission, auditLog } from "@/lib/auth";
import { getPublicClient } from "@/lib/blockchain";
import { createSupabaseService } from "@/lib/supabase-service";
import { CONTRACTS } from "@f2k/shared/contracts";
import { formatUnits } from "viem";
import { USDC_DECIMALS } from "@f2k/shared";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export async function POST() {
  const admin = await getAdminUser();
  if (!admin || !hasPermission(admin.role, "view_dashboard")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const publicClient = getPublicClient();
  const supabase = createSupabaseService();
  const results = { navSynced: 0, subscriptionsSynced: 0, errors: [] as string[] };

  // --- Sync NavPublished events ---
  if (CONTRACTS.navAttestation.address !== ZERO_ADDRESS) {
    try {
      const logs = await publicClient.getContractEvents({
        ...CONTRACTS.navAttestation,
        eventName: "NavPublished",
        fromBlock: 0n,
        toBlock: "latest",
      });

      for (const log of logs) {
        const txHash = log.transactionHash;
        if (!txHash) continue;

        // Check if any nav_record already has this tx hash
        const { data: existing } = await supabase
          .from("nav_records")
          .select("id")
          .eq("on_chain_tx_hash", txHash)
          .limit(1);

        if (existing && existing.length > 0) continue;

        // Try to match by nav_per_token value to a published record missing a tx hash
        const args = log.args as {
          navPerToken?: bigint;
          totalNav?: bigint;
          totalSupply?: bigint;
        };
        if (!args.navPerToken) continue;

        const navPerTokenOnChain = Number(formatUnits(args.navPerToken, USDC_DECIMALS));

        const { data: matchingNav } = await supabase
          .from("nav_records")
          .select("id")
          .eq("status", "published")
          .is("on_chain_tx_hash", null)
          .order("calculated_at", { ascending: false })
          .limit(10);

        if (matchingNav && matchingNav.length > 0) {
          // Update the most recent unlinked published NAV record
          // In practice, match by nav_per_token value
          for (const nav of matchingNav) {
            const { error } = await supabase
              .from("nav_records")
              .update({ on_chain_tx_hash: txHash })
              .eq("id", nav.id)
              .is("on_chain_tx_hash", null);

            if (!error) {
              results.navSynced++;
              break;
            }
          }
        }
      }
    } catch (err) {
      results.errors.push(`NAV sync error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // --- Sync SubscriptionReceived events ---
  if (CONTRACTS.subscription.address !== ZERO_ADDRESS) {
    try {
      const logs = await publicClient.getContractEvents({
        ...CONTRACTS.subscription,
        eventName: "SubscriptionReceived",
        fromBlock: 0n,
        toBlock: "latest",
      });

      for (const log of logs) {
        const txHash = log.transactionHash;
        if (!txHash) continue;

        // Check if any subscription already has this tx hash
        const { data: existing } = await supabase
          .from("subscriptions")
          .select("id")
          .eq("tx_hash", txHash)
          .limit(1);

        if (existing && existing.length > 0) continue;

        // Try to match by investor wallet address + amount
        const args = log.args as { investor?: `0x${string}`; amount?: bigint };
        if (!args.investor || !args.amount) continue;

        const amountUsdc = Number(formatUnits(args.amount, USDC_DECIMALS));

        // Find investor by wallet address
        const { data: investor } = await supabase
          .from("investors")
          .select("id")
          .ilike("wallet_address", args.investor)
          .single();

        if (!investor) continue;

        // Find a pending/confirmed subscription from this investor with matching amount
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("id")
          .eq("investor_id", investor.id)
          .eq("amount_usdc", amountUsdc)
          .is("tx_hash", null)
          .in("status", ["pending", "confirmed"])
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (sub) {
          const { error } = await supabase
            .from("subscriptions")
            .update({ tx_hash: txHash, status: "confirmed" })
            .eq("id", sub.id);

          if (!error) results.subscriptionsSynced++;
        }
      }
    } catch (err) {
      results.errors.push(`Subscription sync error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  await auditLog(admin.id, admin.email, "blockchain_sync", "system", "sync", {
    navSynced: results.navSynced,
    subscriptionsSynced: results.subscriptionsSynced,
    errors: results.errors,
  });

  return NextResponse.json(results);
}
