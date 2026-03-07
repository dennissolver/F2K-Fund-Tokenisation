import { createSupabaseService } from "@/lib/supabase-service";
import RedemptionActions from "./RedemptionActions";

export const dynamic = "force-dynamic";

export default async function RedemptionsPage() {
  const supabase = createSupabaseService();

  const { data: redemptions } = await (supabase.from("redemptions") as any)
    .select("*, investors(full_name, email)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy mb-6">Redemption Requests</h2>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-500">
              <th className="px-4 py-3">Investor</th>
              <th className="px-4 py-3">Tokens</th>
              <th className="px-4 py-3">NAV at Request</th>
              <th className="px-4 py-3">Est. Value (USDC)</th>
              <th className="px-4 py-3">Notice Ends</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {redemptions && redemptions.length > 0 ? (
              redemptions.map((r: Record<string, unknown>) => {
                const investor = r.investors as Record<string, unknown> | null;
                return (
                  <tr key={r.id as string} className="border-t">
                    <td className="px-4 py-3">
                      <div className="font-medium">
                        {(investor?.full_name as string) ?? "Unknown"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {(investor?.email as string) ?? ""}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {Number(r.token_amount).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      ${Number(r.nav_at_request).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      ${Number(r.redemption_value_usdc).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {r.notice_period_ends
                        ? new Date(r.notice_period_ends as string).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          r.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : r.status === "approved"
                            ? "bg-blue-100 text-blue-700"
                            : r.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : r.status === "cancelled"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {r.status as string}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(r.created_at as string).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {r.status === "pending" ? (
                        <RedemptionActions redemptionId={r.id as string} />
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                  No redemption requests yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
