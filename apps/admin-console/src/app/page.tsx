import { createSupabaseService } from "@/lib/supabase-service";

export const dynamic = "force-dynamic";

function fmt(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function fmtNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

function timeAgo(date: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000
  );
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default async function AdminDashboard() {
  const supabase = createSupabaseService();

  // --- Row 1: Key Metrics ---

  // Total AUM: minted subscriptions + approved/lien_registered/tokens_minted stakes
  const [
    { data: mintedSubs },
    { data: qualifiedStakes },
    { data: latestNav },
    { count: activeInvestors },
    { count: pendingKyc },
    { count: pendingSubs },
    { count: stakesUnderReview },
    { count: pendingAllowlist },
    { data: subsByStatus },
    { data: stakesByStatus },
    { data: auditLogs },
  ] = await Promise.all([
    // Minted subscriptions total
    supabase
      .from("subscriptions")
      .select("amount_usdc")
      .eq("status", "minted"),

    // Qualified asset stakes
    supabase
      .from("asset_stakes")
      .select("collateral_value, status")
      .in("status", ["approved", "lien_registered", "tokens_minted"]),

    // Latest published NAV
    supabase
      .from("nav_records")
      .select("nav_per_token, total_nav, total_supply, calculated_at")
      .eq("status", "published")
      .order("calculated_at", { ascending: false })
      .limit(1),

    // Active investors
    supabase
      .from("investors")
      .select("id", { count: "exact", head: true })
      .eq("kyc_status", "approved"),

    // Pending KYC
    supabase
      .from("investors")
      .select("id", { count: "exact", head: true })
      .eq("kyc_status", "pending"),

    // Pending subscriptions
    supabase
      .from("subscriptions")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),

    // Stakes under review
    supabase
      .from("asset_stakes")
      .select("id", { count: "exact", head: true })
      .in("status", ["submitted", "under_review"]),

    // Pending allowlist
    supabase
      .from("allowlist")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),

    // Subscription pipeline by status
    supabase
      .from("subscriptions")
      .select("status")
      .in("status", ["pending", "confirmed", "minted"]),

    // Asset stakes by status
    supabase
      .from("asset_stakes")
      .select("status")
      .in("status", [
        "submitted",
        "under_review",
        "approved",
        "lien_registered",
        "tokens_minted",
      ]),

    // Recent audit log
    supabase
      .from("audit_log")
      .select("action, actor_email, entity_type, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  // Compute totals
  const subsAum =
    mintedSubs?.reduce(
      (sum, s) => sum + (Number(s.amount_usdc) || 0),
      0
    ) ?? 0;
  const stakesAum =
    qualifiedStakes?.reduce(
      (sum, s) => sum + (Number(s.collateral_value) || 0),
      0
    ) ?? 0;
  const totalAum = subsAum + stakesAum;

  const nav = latestNav?.[0];
  const tokenSupply = nav ? Number(nav.total_supply) : 0;
  const navPerToken = nav ? Number(nav.nav_per_token) : 0;

  // Count subscription statuses
  const subStatusCounts: Record<string, number> = {
    pending: 0,
    confirmed: 0,
    minted: 0,
  };
  subsByStatus?.forEach((s) => {
    if (s.status in subStatusCounts) subStatusCounts[s.status]++;
  });

  // Count stake statuses
  const stakeStatusCounts: Record<string, number> = {
    submitted: 0,
    under_review: 0,
    approved: 0,
    lien_registered: 0,
    tokens_minted: 0,
  };
  stakesByStatus?.forEach((s) => {
    if (s.status in stakeStatusCounts) stakeStatusCounts[s.status]++;
  });

  const stakeLabels: Record<string, string> = {
    submitted: "Submitted",
    under_review: "Under Review",
    approved: "Approved",
    lien_registered: "Lien Registered",
    tokens_minted: "Tokens Minted",
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy mb-6">Dashboard</h2>

      {/* Row 1: Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500 mb-1">Total AUM</p>
          <p className="text-2xl font-bold text-navy">{fmt(totalAum)}</p>
          <p className="text-xs text-gray-400 mt-1">
            Subs {fmt(subsAum)} + Stakes {fmt(stakesAum)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500 mb-1">Token Supply</p>
          <p className="text-2xl font-bold text-navy">
            {fmtNumber(tokenSupply)}
          </p>
          <p className="text-xs text-gray-400 mt-1">F2K-HT tokens</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500 mb-1">NAV per Token</p>
          <p className="text-2xl font-bold text-navy">{fmt(navPerToken)}</p>
          {nav && (
            <p className="text-xs text-gray-400 mt-1">
              as of{" "}
              {new Date(nav.calculated_at).toLocaleDateString("en-AU")}
            </p>
          )}
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500 mb-1">Active Investors</p>
          <p className="text-2xl font-bold text-navy">
            {activeInvestors ?? 0}
          </p>
          <p className="text-xs text-gray-400 mt-1">KYC approved</p>
        </div>
      </div>

      {/* Fundraise Progress Tracker */}
      {(() => {
        const TRANCHE_1_TARGET = 1_000_000;
        const TRANCHE_2_TARGET = 600_000_000;
        const TOTAL_TARGET = TRANCHE_1_TARGET + TRANCHE_2_TARGET;

        // Pipeline: confirmed but not yet minted subscriptions + stakes in review/approved
        const confirmedSubs = (mintedSubs || []).length > 0 ? subsAum : 0;
        const pendingSubsValue = subsByStatus
          ?.filter((s) => s.status === "pending" || s.status === "confirmed")
          .length ?? 0;

        const inTranche1 = totalAum <= TRANCHE_1_TARGET;
        const currentTarget = inTranche1 ? TRANCHE_1_TARGET : TOTAL_TARGET;
        const currentLabel = inTranche1 ? "Tranche 1 — $1M Seed" : "Tranche 2 — $600M Wholesale";
        const pctOfCurrent = currentTarget > 0 ? Math.min((totalAum / currentTarget) * 100, 100) : 0;
        const pctOfTotal = TOTAL_TARGET > 0 ? Math.min((totalAum / TOTAL_TARGET) * 100, 100) : 0;

        return (
          <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-navy">Fundraise Progress</h3>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-navy text-white">
                {currentLabel}
              </span>
            </div>

            {/* Current tranche progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">
                  {fmt(totalAum)} raised
                </span>
                <span className="text-gray-500">
                  {fmt(currentTarget)} target
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pctOfCurrent}%`,
                    background: inTranche1
                      ? "linear-gradient(90deg, #1e3a5f, #2d5a8e)"
                      : "linear-gradient(90deg, #1e3a5f, #c9a84c)",
                  }}
                />
              </div>
              <p className="text-right text-xs text-gray-400 mt-1">
                {pctOfCurrent.toFixed(1)}% of {inTranche1 ? "Tranche 1" : "total raise"}
              </p>
            </div>

            {/* Overall progress (always show both tranches) */}
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="text-gray-500">Tranche 1</div>
                <div className="font-semibold text-navy">
                  {fmt(Math.min(totalAum, TRANCHE_1_TARGET))}
                  <span className="text-gray-400 font-normal"> / {fmt(TRANCHE_1_TARGET)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                  <div
                    className="h-full rounded-full bg-navy"
                    style={{ width: `${Math.min((totalAum / TRANCHE_1_TARGET) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="text-gray-500">Tranche 2</div>
                <div className="font-semibold text-navy">
                  {fmt(Math.max(totalAum - TRANCHE_1_TARGET, 0))}
                  <span className="text-gray-400 font-normal"> / {fmt(TRANCHE_2_TARGET)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                  <div
                    className="h-full rounded-full bg-gold"
                    style={{ width: `${Math.min((Math.max(totalAum - TRANCHE_1_TARGET, 0) / TRANCHE_2_TARGET) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="text-gray-500">Total Raise</div>
                <div className="font-semibold text-navy">
                  {fmt(totalAum)}
                  <span className="text-gray-400 font-normal"> / {fmt(TOTAL_TARGET)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pctOfTotal}%`,
                      background: "linear-gradient(90deg, #1e3a5f, #c9a84c)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Row 2: Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500 mb-1">Pending KYC</p>
          <p className="text-2xl font-bold text-gold">{pendingKyc ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500 mb-1">Pending Subscriptions</p>
          <p className="text-2xl font-bold text-gold">{pendingSubs ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500 mb-1">Stakes Under Review</p>
          <p className="text-2xl font-bold text-gold">
            {stakesUnderReview ?? 0}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-gray-500 mb-1">Pending Allowlist</p>
          <p className="text-2xl font-bold text-gold">
            {pendingAllowlist ?? 0}
          </p>
        </div>
      </div>

      {/* Row 3: Fund Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Subscription Pipeline */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-navy mb-4">
            Subscription Pipeline
          </h3>
          <div className="space-y-3">
            {(["pending", "confirmed", "minted"] as const).map((status) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">
                  {status}
                </span>
                <span className="text-sm font-semibold text-navy bg-gray-100 rounded-full px-3 py-1">
                  {subStatusCounts[status]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Asset Stakes */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-navy mb-4">
            Asset Stakes by Status
          </h3>
          <div className="space-y-3">
            {(
              [
                "submitted",
                "under_review",
                "approved",
                "lien_registered",
                "tokens_minted",
              ] as const
            ).map((status) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {stakeLabels[status]}
                </span>
                <span className="text-sm font-semibold text-navy bg-gray-100 rounded-full px-3 py-1">
                  {stakeStatusCounts[status]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-navy mb-4">
          Recent Activity
        </h3>
        {auditLogs && auditLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2 pr-4 font-medium">Time</th>
                  <th className="pb-2 pr-4 font-medium">Actor</th>
                  <th className="pb-2 pr-4 font-medium">Action</th>
                  <th className="pb-2 font-medium">Entity</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2 pr-4 text-gray-400 whitespace-nowrap">
                      {timeAgo(log.created_at)}
                    </td>
                    <td className="py-2 pr-4 text-navy">
                      {log.actor_email ?? "system"}
                    </td>
                    <td className="py-2 pr-4 text-gray-700 font-medium">
                      {log.action}
                    </td>
                    <td className="py-2 text-gray-500">
                      {log.entity_type}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            No activity yet. Audit log entries will appear here.
          </p>
        )}
      </div>
    </div>
  );
}
