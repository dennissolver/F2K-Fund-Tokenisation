import { createSupabaseService } from "@/lib/supabase-service";

export const dynamic = "force-dynamic";

export default async function InvestorsPage() {
  const supabase = createSupabaseService();

  const { data: investors } = await supabase
    .from("investors")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy mb-6">Investors</h2>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-500">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Wallet</th>
              <th className="px-4 py-3">KYC</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Registered</th>
            </tr>
          </thead>
          <tbody>
            {investors && investors.length > 0 ? (
              investors.map((inv) => (
                <tr key={inv.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <a href={`/investors/${inv.id}`} className="text-f2k-blue hover:underline">
                      {inv.full_name || "—"}
                    </a>
                  </td>
                  <td className="px-4 py-3">{inv.email}</td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {inv.wallet_address ? `${inv.wallet_address.slice(0, 6)}...${inv.wallet_address.slice(-4)}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      inv.kyc_status === "approved" ? "bg-green-100 text-green-700" :
                      inv.kyc_status === "rejected" ? "bg-red-100 text-red-700" :
                      inv.kyc_status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {inv.kyc_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{inv.investor_type || "—"}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(inv.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  No investors yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
