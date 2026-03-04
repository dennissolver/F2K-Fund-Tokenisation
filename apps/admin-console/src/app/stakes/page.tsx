import { createSupabaseService } from "@/lib/supabase-service";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  submitted: "bg-yellow-100 text-yellow-700",
  under_review: "bg-blue-100 text-blue-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  lien_registered: "bg-indigo-100 text-indigo-700",
  tokens_minted: "bg-green-100 text-green-700",
};

export default async function StakesPage() {
  const supabase = createSupabaseService();

  const { data: stakes } = await supabase
    .from("asset_stakes")
    .select("*, investors(full_name, email), asset_classes(label, code, ltv_ratio)")
    .order("created_at", { ascending: false });

  const activeStakes = stakes?.filter((s) => s.status !== "draft") || [];

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy mb-6">Asset Stakes</h2>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-500">
              <th className="px-4 py-3">Investor</th>
              <th className="px-4 py-3">Asset Class</th>
              <th className="px-4 py-3">Declared Value</th>
              <th className="px-4 py-3">Appraised</th>
              <th className="px-4 py-3">LTV</th>
              <th className="px-4 py-3">Tokens</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeStakes.length > 0 ? (
              activeStakes.map((stake) => {
                const inv = stake.investors as { full_name: string | null; email: string } | null;
                const cls = stake.asset_classes as { label: string; code: string; ltv_ratio: number } | null;
                return (
                  <tr
                    key={stake.id}
                    className={`border-t hover:bg-gray-50 ${
                      stake.status === "submitted" ? "bg-yellow-50" : ""
                    }`}
                  >
                    <td className="px-4 py-3">{inv?.full_name || inv?.email || "—"}</td>
                    <td className="px-4 py-3">{cls?.label || "—"}</td>
                    <td className="px-4 py-3">${Number(stake.declared_value).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      {stake.appraised_value
                        ? `$${Number(stake.appraised_value).toLocaleString()}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {stake.ltv_ratio_applied
                        ? `${(Number(stake.ltv_ratio_applied) * 100).toFixed(0)}%`
                        : `${(Number(cls?.ltv_ratio ?? 0) * 100).toFixed(0)}%`}
                    </td>
                    <td className="px-4 py-3">
                      {stake.tokens_to_mint
                        ? Number(stake.tokens_to_mint).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          statusColors[stake.status] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {stake.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(stake.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`/stakes/${stake.id}`}
                        className="text-xs bg-navy text-white px-2 py-1 rounded hover:bg-navy/80"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                  No stakes submitted yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
