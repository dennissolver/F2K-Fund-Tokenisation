import { createSupabaseService } from "@/lib/supabase-service";
import { PREFERRED_RETURN, MANAGEMENT_FEE, PERFORMANCE_FEE, INTEGRATION_FEE, MIN_INVESTMENT_USDC } from "@f2k/shared";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = createSupabaseService();

  const { data: adminUsers } = await supabase
    .from("admin_users")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy mb-6">Settings</h2>

      {/* Fund Parameters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Fund Parameters (Read-Only)</h3>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-gray-500">Preferred Return</dt><dd className="font-semibold">{(PREFERRED_RETURN * 100).toFixed(1)}% p.a.</dd></div>
          <div><dt className="text-gray-500">Management Fee</dt><dd className="font-semibold">{(MANAGEMENT_FEE * 100).toFixed(1)}% p.a.</dd></div>
          <div><dt className="text-gray-500">Performance Fee</dt><dd className="font-semibold">{(PERFORMANCE_FEE * 100).toFixed(0)}% above hurdle</dd></div>
          <div><dt className="text-gray-500">Integration Fee</dt><dd className="font-semibold">{(INTEGRATION_FEE * 100).toFixed(0)}% of GDV</dd></div>
          <div><dt className="text-gray-500">Min Investment</dt><dd className="font-semibold">${MIN_INVESTMENT_USDC.toLocaleString()} USDC</dd></div>
        </dl>
      </div>

      {/* Admin Users */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-sm font-medium text-gray-500">Admin Users</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-500">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Added</th>
            </tr>
          </thead>
          <tbody>
            {adminUsers && adminUsers.length > 0 ? (
              adminUsers.map((admin) => (
                <tr key={admin.id} className="border-t">
                  <td className="px-4 py-3">{admin.full_name || "—"}</td>
                  <td className="px-4 py-3">{admin.email}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{admin.role}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{new Date(admin.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No admin users configured.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
