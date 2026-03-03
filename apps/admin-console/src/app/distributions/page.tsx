import { createSupabaseService } from "@/lib/supabase-service";

export const dynamic = "force-dynamic";

export default async function DistributionsPage() {
  const supabase = createSupabaseService();

  const { data: distributions } = await supabase
    .from("distributions")
    .select("*")
    .order("distribution_date", { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-navy">Distributions</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-500">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Total (USDC)</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Approved By</th>
              <th className="px-4 py-3">Executed</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {distributions && distributions.length > 0 ? (
              distributions.map((dist) => (
                <tr key={dist.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{new Date(dist.distribution_date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-semibold">${Number(dist.total_amount_usdc).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      dist.status === "completed" ? "bg-green-100 text-green-700" :
                      dist.status === "approved" ? "bg-blue-100 text-blue-700" :
                      dist.status === "executing" ? "bg-purple-100 text-purple-700" :
                      dist.status === "failed" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>{dist.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{dist.approved_by || "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{dist.executed_at ? new Date(dist.executed_at).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-3">
                    <a href={`/distributions/${dist.id}`} className="text-xs text-f2k-blue hover:underline">View Details</a>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No distributions.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
