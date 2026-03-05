import { createSupabaseService } from "@/lib/supabase-service";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  new: "bg-yellow-100 text-yellow-700",
  contacted: "bg-blue-100 text-blue-700",
  qualified: "bg-emerald-100 text-emerald-700",
  declined: "bg-red-100 text-red-700",
};

const typeLabels: Record<string, string> = {
  lender: "Lender",
  government: "Government",
  offtaker: "Offtaker",
};

export default async function RegistrationsPage({
  searchParams,
}: {
  searchParams: { type?: string; status?: string };
}) {
  const supabase = createSupabaseService();

  let query = (supabase.from("registrations_of_interest") as any)
    .select("*")
    .order("created_at", { ascending: false });

  if (searchParams.type) {
    query = query.eq("type", searchParams.type);
  }
  if (searchParams.status) {
    query = query.eq("status", searchParams.status);
  }

  const { data: registrations } = await query;
  const rows = (registrations || []) as any[];

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy mb-6">Registrations of Interest</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="flex gap-2 items-center text-sm">
          <span className="text-gray-500">Type:</span>
          {[
            { label: "All", value: "" },
            { label: "Lender", value: "lender" },
            { label: "Government", value: "government" },
            { label: "Offtaker", value: "offtaker" },
          ].map((f) => {
            const isActive = (searchParams.type || "") === f.value;
            const href = f.value
              ? `?type=${f.value}${searchParams.status ? `&status=${searchParams.status}` : ""}`
              : searchParams.status
                ? `?status=${searchParams.status}`
                : "?";
            return (
              <a
                key={f.value}
                href={href}
                className={`px-3 py-1 rounded text-xs ${
                  isActive
                    ? "bg-navy text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f.label}
              </a>
            );
          })}
        </div>
        <div className="flex gap-2 items-center text-sm">
          <span className="text-gray-500">Status:</span>
          {[
            { label: "All", value: "" },
            { label: "New", value: "new" },
            { label: "Contacted", value: "contacted" },
            { label: "Qualified", value: "qualified" },
            { label: "Declined", value: "declined" },
          ].map((f) => {
            const isActive = (searchParams.status || "") === f.value;
            const href = f.value
              ? `?status=${f.value}${searchParams.type ? `&type=${searchParams.type}` : ""}`
              : searchParams.type
                ? `?type=${searchParams.type}`
                : "?";
            return (
              <a
                key={f.value}
                href={href}
                className={`px-3 py-1 rounded text-xs ${
                  isActive
                    ? "bg-navy text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f.label}
              </a>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-500">
              <th className="px-4 py-3">Organisation</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Region</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((roi: any) => (
                <tr
                  key={roi.id}
                  className={`border-t hover:bg-gray-50 ${
                    roi.status === "new" ? "bg-yellow-50" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-medium">{roi.org_name}</td>
                  <td className="px-4 py-3">
                    <div>{roi.contact_name}</div>
                    <div className="text-gray-400 text-xs">{roi.contact_email}</div>
                  </td>
                  <td className="px-4 py-3">{typeLabels[roi.type] || roi.type}</td>
                  <td className="px-4 py-3">{roi.region || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        statusColors[roi.status] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {roi.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(roi.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`/registrations/${roi.id}`}
                      className="text-xs bg-navy text-white px-2 py-1 rounded hover:bg-navy/80"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No registrations yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
