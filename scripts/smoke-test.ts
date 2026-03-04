/**
 * DB Smoke Test — exercises every table's CRUD lifecycle using service-role client.
 * Run: npx tsx scripts/smoke-test.ts
 */
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment");
  process.exit(1);
}

const db = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Track IDs for cleanup
const cleanup: Array<{ table: string; id: string }> = [];

let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${label}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${label}`);
  }
}

async function insertRow(table: string, data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
  const { data: row, error } = await db.from(table).insert(data as never).select().single();
  if (error) {
    console.error(`  Insert ${table} error:`, error.message);
    return null;
  }
  if (row) cleanup.push({ table, id: (row as Record<string, unknown>).id as string });
  return row as Record<string, unknown>;
}

async function updateRow(table: string, id: string, data: Record<string, unknown>): Promise<boolean> {
  const { error } = await db.from(table).update(data as never).eq("id", id);
  if (error) {
    console.error(`  Update ${table} error:`, error.message);
    return false;
  }
  return true;
}

async function main() {
  console.log("\n=== F2K DB Smoke Test ===\n");

  // 1. Verify connection + asset classes
  console.log("1. DB connection & asset classes");
  // Test basic connectivity with a table we know exists (from migration 001)
  const { error: connErr } = await db.from("investors").select("id").limit(1);
  assert(!connErr, "Connected to Supabase");

  // asset_classes may not exist if migration 002 not applied
  const { data: classes, error: classErr } = await db.from("asset_classes").select("*");
  if (classErr) {
    console.log(`  ⚠ asset_classes not available (migration 002 may not be applied): ${classErr.message}`);
  }
  assert(!classErr && classes?.length === 4, `4 asset classes seeded (got ${classes?.length ?? "N/A"})`);

  // 2. Investor + subscription lifecycle
  console.log("\n2. Investor + subscription lifecycle");
  const testEmail = `smoke-test-${Date.now()}@test.local`;

  const investor = await insertRow("investors", {
    email: testEmail,
    full_name: "Smoke Test User",
    investor_type: "wholesale",
    kyc_status: "not_started",
    country_code: "AU",
  });
  assert(!!investor, "Investor created");

  if (investor) {
    // KYC transition
    assert(await updateRow("investors", investor.id as string, { kyc_status: "pending" }), "KYC → pending");
    assert(await updateRow("investors", investor.id as string, { kyc_status: "approved" }), "KYC → approved");

    // Subscription lifecycle (omit 'source' if column doesn't exist yet)
    const subData: Record<string, unknown> = {
      investor_id: investor.id,
      amount_usdc: 50000,
      token_price: 1.0,
      tokens_to_mint: 50000,
      status: "pending",
    };
    // Only include source if migration 002 has been applied
    if (classes && classes.length > 0) {
      subData.source = "direct";
    }
    const sub = await insertRow("subscriptions", subData);
    assert(!!sub, "Subscription created (pending)");

    if (sub) {
      assert(await updateRow("subscriptions", sub.id as string, { status: "confirmed" }), "Subscription → confirmed");
      assert(await updateRow("subscriptions", sub.id as string, { status: "minted", mint_tx_hash: "0xtest123" }), "Subscription → minted");
    }
  }

  // 3. Asset stake lifecycle
  console.log("\n3. Asset stake lifecycle");
  if (investor && classes && classes.length > 0) {
    const cashClass = classes.find((c: Record<string, unknown>) => c.code === "cash");
    assert(!!cashClass, "Cash asset class found");

    if (cashClass) {
      const stake = await insertRow("asset_stakes", {
        investor_id: investor.id,
        asset_class_id: (cashClass as Record<string, unknown>).id,
        description: "Smoke test cash deposit",
        declared_value: 100000,
        status: "draft",
      });
      assert(!!stake, "Asset stake created (draft)");

      if (stake) {
        const stakeId = stake.id as string;
        assert(await updateRow("asset_stakes", stakeId, { status: "submitted" }), "Stake → submitted");
        assert(await updateRow("asset_stakes", stakeId, {
          status: "approved",
          appraised_value: 100000,
          ltv_ratio_applied: 1.0,
          collateral_value: 100000,
        }), "Stake → approved");
        assert(await updateRow("asset_stakes", stakeId, { status: "lien_registered", lien_reference: "LIEN-SMOKE-001" }), "Stake → lien_registered");
        assert(await updateRow("asset_stakes", stakeId, { status: "tokens_minted" }), "Stake → tokens_minted");
      }
    }
  }

  // 4. NAV lifecycle
  console.log("\n4. NAV lifecycle");
  const nav = await insertRow("nav_records", {
    nav_per_token: 1.05,
    total_nav: 5250000,
    total_supply: 5000000,
    calculated_at: new Date().toISOString(),
    status: "draft",
  });
  assert(!!nav, "NAV record created (draft)");

  if (nav) {
    assert(await updateRow("nav_records", nav.id as string, { status: "approved", approved_at: new Date().toISOString() }), "NAV → approved");
    assert(await updateRow("nav_records", nav.id as string, { status: "published", published_at: new Date().toISOString() }), "NAV → published");
  }

  // 5. Distribution + payments
  console.log("\n5. Distribution + payments lifecycle");
  const dist = await insertRow("distributions", {
    distribution_date: new Date().toISOString().split("T")[0],
    total_amount_usdc: 25000,
    nav_at_distribution: 1.05,
    total_tokens_at_snapshot: 5000000,
    status: "draft",
  });
  assert(!!dist, "Distribution created (draft)");

  if (dist && investor) {
    assert(await updateRow("distributions", dist.id as string, { status: "approved", approved_at: new Date().toISOString() }), "Distribution → approved");

    const payment = await insertRow("distribution_payments", {
      distribution_id: dist.id,
      investor_id: investor.id,
      token_balance_at_snapshot: 50000,
      share_percentage: 0.01,
      amount_usdc: 250,
      status: "pending",
    });
    assert(!!payment, "Distribution payment created (pending)");

    if (payment) {
      assert(await updateRow("distribution_payments", payment.id as string, { status: "sent", tx_hash: "0xdisttest" }), "Payment → sent");
      assert(await updateRow("distribution_payments", payment.id as string, { status: "confirmed" }), "Payment → confirmed");
    }

    assert(await updateRow("distributions", dist.id as string, { status: "completed", executed_at: new Date().toISOString() }), "Distribution → completed");
  }

  // 6. Allowlist lifecycle
  console.log("\n6. Allowlist lifecycle");
  const allowEntry = await insertRow("allowlist", {
    wallet_address: `0xSMOKE${Date.now()}`,
    investor_id: investor?.id,
    status: "pending",
  });
  assert(!!allowEntry, "Allowlist entry created (pending)");

  if (allowEntry) {
    assert(await updateRow("allowlist", allowEntry.id as string, { status: "approved", reviewed_at: new Date().toISOString() }), "Allowlist → approved");
  }

  // 7. Audit log
  console.log("\n7. Audit log");
  const auditEntry = await insertRow("audit_log", {
    actor_email: "smoke-test@test.local",
    action: "smoke_test",
    entity_type: "system",
    details: { test: true },
  });
  assert(!!auditEntry, "Audit log entry created");

  const { data: auditRows, error: auditErr } = await db.from("audit_log").select("id").limit(1);
  assert(!auditErr && !!auditRows, "Audit log readable");

  // 8. Cleanup
  console.log("\n8. Cleanup");
  // Reverse order to respect FK constraints
  const cleanupOrder = [...cleanup].reverse();
  let cleanedUp = 0;
  for (const { table, id } of cleanupOrder) {
    const { error } = await db.from(table).delete().eq("id", id);
    if (error) {
      console.error(`  Cleanup ${table}/${id}: ${error.message}`);
    } else {
      cleanedUp++;
    }
  }
  assert(cleanedUp === cleanupOrder.length, `Cleaned up ${cleanedUp}/${cleanupOrder.length} records`);

  // Summary
  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Smoke test crashed:", err);
  process.exit(1);
});
