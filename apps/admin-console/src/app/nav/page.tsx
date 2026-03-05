"use client";

import { useState, useEffect } from "react";

interface NavRecord {
  id: string;
  nav_per_token: number;
  total_nav: number;
  total_supply: number;
  calculated_at: string;
  calculated_by: string | null;
  approved_by: string | null;
  approved_at: string | null;
  published_at: string | null;
  on_chain_tx_hash: string | null;
  status: "draft" | "approved" | "published";
  created_at: string;
}

export default function NavPage() {
  const [navRecords, setNavRecords] = useState<NavRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state
  const [navPerToken, setNavPerToken] = useState("");
  const [totalNav, setTotalNav] = useState("");
  const [totalSupply, setTotalSupply] = useState("");

  useEffect(() => {
    fetchRecords();
  }, []);

  async function fetchRecords() {
    try {
      const res = await fetch("/api/nav");
      if (res.ok) {
        const data = await res.json();
        setNavRecords(data.records || []);
      }
    } catch {
      // Fallback: fetch via the page's own data if the GET endpoint doesn't exist yet
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const payload = {
      nav_per_token: parseFloat(navPerToken),
      total_nav: parseFloat(totalNav),
      total_supply: parseFloat(totalSupply),
    };

    if (isNaN(payload.nav_per_token) || isNaN(payload.total_nav) || isNaN(payload.total_supply)) {
      setMessage({ type: "error", text: "All fields must be valid numbers" });
      setSubmitting(false);
      return;
    }

    const res = await fetch("/api/nav", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setMessage({ type: "success", text: "NAV record submitted successfully" });
      setNavPerToken("");
      setTotalNav("");
      setTotalSupply("");
      fetchRecords();
    } else {
      const data = await res.json();
      setMessage({ type: "error", text: data.error || "Failed to submit NAV" });
    }
    setSubmitting(false);
  }

  async function handleApprove(id: string) {
    setActionLoading(id);
    setMessage(null);

    const res = await fetch(`/api/nav/${id}/approve`, { method: "POST" });
    if (res.ok) {
      setMessage({ type: "success", text: "NAV approved" });
      fetchRecords();
    } else {
      const data = await res.json();
      setMessage({ type: "error", text: data.error || "Failed to approve" });
    }
    setActionLoading(null);
  }

  async function handlePublish(id: string) {
    setActionLoading(id);
    setMessage(null);

    const res = await fetch(`/api/nav/${id}/publish`, { method: "POST" });
    if (res.ok) {
      setMessage({ type: "success", text: "NAV published" });
      fetchRecords();
    } else {
      const data = await res.json();
      setMessage({ type: "error", text: data.error || "Failed to publish" });
    }
    setActionLoading(null);
  }

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-navy">NAV Management</h2>
      </div>

      {message && (
        <div
          className={`mb-4 p-3 rounded text-sm border ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Submit New NAV Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Submit New NAV</h3>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">NAV per Token</label>
            <input
              type="number"
              step="0.0001"
              min="0"
              value={navPerToken}
              onChange={(e) => setNavPerToken(e.target.value)}
              className="w-40 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
              placeholder="1.0000"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Total NAV</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={totalNav}
              onChange={(e) => setTotalNav(e.target.value)}
              className="w-44 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
              placeholder="1000000.00"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Total Token Supply</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={totalSupply}
              onChange={(e) => setTotalSupply(e.target.value)}
              className="w-44 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
              placeholder="1000000.00"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy/90 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit NAV"}
          </button>
        </form>
      </div>

      {/* History */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-500">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">NAV/Token</th>
              <th className="px-4 py-3">Total NAV</th>
              <th className="px-4 py-3">Supply</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">On-Chain</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {navRecords.length > 0 ? (
              navRecords.map((nav) => (
                <tr key={nav.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {new Date(nav.calculated_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    ${Number(nav.nav_per_token).toFixed(4)}
                  </td>
                  <td className="px-4 py-3">
                    ${Number(nav.total_nav).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {Number(nav.total_supply).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        nav.status === "published"
                          ? "bg-green-100 text-green-700"
                          : nav.status === "approved"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {nav.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {nav.on_chain_tx_hash ? (
                      <a
                        href={`https://sepolia.etherscan.io/tx/${nav.on_chain_tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-f2k-blue text-xs hover:underline"
                      >
                        View
                      </a>
                    ) : (
                      "---"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {nav.status === "draft" && (
                      <button
                        onClick={() => handleApprove(nav.id)}
                        disabled={actionLoading === nav.id}
                        className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        {actionLoading === nav.id ? "..." : "Approve"}
                      </button>
                    )}
                    {nav.status === "approved" && (
                      <button
                        onClick={() => handlePublish(nav.id)}
                        disabled={actionLoading === nav.id}
                        className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        {actionLoading === nav.id ? "..." : "Publish"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No NAV records.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
