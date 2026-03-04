"use client";

import { useState, useEffect } from "react";

interface StakeDetail {
  id: string;
  description: string;
  declared_value: number;
  appraised_value: number | null;
  ltv_ratio_applied: number | null;
  collateral_value: number | null;
  nav_at_stake: number | null;
  tokens_to_mint: number | null;
  lien_reference: string | null;
  supporting_docs: string[];
  status: string;
  review_notes: string | null;
  reviewed_at: string | null;
  created_at: string;
  investors: { full_name: string | null; email: string; wallet_address: string | null } | null;
  asset_classes: { label: string; code: string; ltv_ratio: number } | null;
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  submitted: "bg-yellow-100 text-yellow-700",
  under_review: "bg-blue-100 text-blue-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  lien_registered: "bg-indigo-100 text-indigo-700",
  tokens_minted: "bg-green-100 text-green-700",
};

export default function StakeDetailPage({ params }: { params: { id: string } }) {
  const [stake, setStake] = useState<StakeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Review form
  const [appraisedValue, setAppraisedValue] = useState("");
  const [ltvOverride, setLtvOverride] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");

  // Lien form
  const [lienReference, setLienReference] = useState("");

  useEffect(() => {
    fetchStake();
  }, []);

  async function fetchStake() {
    const res = await fetch(`/api/stakes/${params.id}/detail`);
    if (res.ok) {
      const data = await res.json();
      setStake(data.stake);
    }
    setLoading(false);
  }

  async function handleReview(action: "approve" | "reject") {
    setActionLoading(true);
    setError(null);
    setSuccess(null);

    const body: Record<string, unknown> = { action, review_notes: reviewNotes || undefined };
    if (action === "approve") {
      if (appraisedValue) body.appraised_value = parseFloat(appraisedValue);
      if (ltvOverride) body.ltv_override = parseFloat(ltvOverride) / 100;
    }

    const res = await fetch(`/api/stakes/${params.id}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setSuccess(`Stake ${action === "approve" ? "approved" : "rejected"}`);
      fetchStake();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to review");
    }
    setActionLoading(false);
  }

  async function handleLien() {
    if (!lienReference.trim()) {
      setError("Lien reference is required");
      return;
    }
    setActionLoading(true);
    setError(null);
    setSuccess(null);

    const res = await fetch(`/api/stakes/${params.id}/lien`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lien_reference: lienReference }),
    });

    if (res.ok) {
      setSuccess("Lien registered");
      fetchStake();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to register lien");
    }
    setActionLoading(false);
  }

  async function handleMint() {
    setActionLoading(true);
    setError(null);
    setSuccess(null);

    const res = await fetch(`/api/stakes/${params.id}/mint`, {
      method: "POST",
    });

    if (res.ok) {
      const data = await res.json();
      setSuccess(`Minted ${Number(data.tokens_minted).toLocaleString()} F2K-HT tokens`);
      fetchStake();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to mint tokens");
    }
    setActionLoading(false);
  }

  if (loading) {
    return <div className="p-8 text-gray-400">Loading...</div>;
  }

  if (!stake) {
    return <div className="p-8 text-red-500">Stake not found.</div>;
  }

  const inv = stake.investors;
  const cls = stake.asset_classes;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <a href="/stakes" className="text-sm text-gray-400 hover:text-gray-600">&larr; All Stakes</a>
        <h2 className="text-2xl font-bold text-navy">Stake Detail</h2>
        <span className={`px-3 py-1 rounded text-sm font-medium ${statusColors[stake.status] || ""}`}>
          {stake.status.replace(/_/g, " ")}
        </span>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">{success}</div>}

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Investor</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Name</span>
              <span className="font-medium">{inv?.full_name || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="font-medium">{inv?.email || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Wallet</span>
              <span className="font-mono text-xs">{inv?.wallet_address ? `${inv.wallet_address.slice(0, 8)}...${inv.wallet_address.slice(-6)}` : "—"}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Asset</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Class</span>
              <span className="font-medium">{cls?.label || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Default LTV</span>
              <span>{cls ? `${(Number(cls.ltv_ratio) * 100).toFixed(0)}%` : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Declared Value</span>
              <span className="font-semibold">${Number(stake.declared_value).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Description</span>
              <span className="text-right max-w-[60%]">{stake.description}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Valuation details (post-review) */}
      {stake.appraised_value && (
        <div className="bg-white rounded-xl p-5 shadow-sm border mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Valuation</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Appraised Value</div>
              <div className="font-semibold">${Number(stake.appraised_value).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-500">LTV Applied</div>
              <div className="font-semibold">{stake.ltv_ratio_applied ? `${(Number(stake.ltv_ratio_applied) * 100).toFixed(0)}%` : "—"}</div>
            </div>
            <div>
              <div className="text-gray-500">Collateral Value</div>
              <div className="font-semibold">{stake.collateral_value ? `$${Number(stake.collateral_value).toLocaleString()}` : "—"}</div>
            </div>
            <div>
              <div className="text-gray-500">Tokens</div>
              <div className="font-semibold">{stake.tokens_to_mint ? Number(stake.tokens_to_mint).toLocaleString() : "—"}</div>
            </div>
          </div>
          {stake.review_notes && (
            <div className="mt-3 text-sm text-gray-600">
              <span className="text-gray-400">Notes: </span>{stake.review_notes}
            </div>
          )}
        </div>
      )}

      {/* Lien & Mint info */}
      {stake.lien_reference && (
        <div className="bg-white rounded-xl p-5 shadow-sm border mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Lien</h3>
          <div className="text-sm font-mono">{stake.lien_reference}</div>
        </div>
      )}

      {/* Documents */}
      {stake.supporting_docs && stake.supporting_docs.length > 0 && (
        <div className="bg-white rounded-xl p-5 shadow-sm border mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Supporting Documents</h3>
          <ul className="space-y-1 text-sm">
            {stake.supporting_docs.map((doc, i) => (
              <li key={i} className="text-gray-600">
                {doc.split("/").pop()}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Forms */}
      {["submitted", "under_review"].includes(stake.status) && (
        <div className="bg-white rounded-xl p-5 shadow-sm border mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Review Stake</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Appraised Value (USD)</label>
                <input
                  type="number"
                  value={appraisedValue}
                  onChange={(e) => setAppraisedValue(e.target.value)}
                  placeholder={String(stake.declared_value)}
                  className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-f2k-blue outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">LTV Override (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={ltvOverride}
                  onChange={(e) => setLtvOverride(e.target.value)}
                  placeholder={cls ? `${(Number(cls.ltv_ratio) * 100).toFixed(0)}` : ""}
                  className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-f2k-blue outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Review Notes</label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-f2k-blue outline-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleReview("approve")}
                disabled={actionLoading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
              >
                Approve
              </button>
              <button
                onClick={() => handleReview("reject")}
                disabled={actionLoading}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {stake.status === "approved" && (
        <div className="bg-white rounded-xl p-5 shadow-sm border mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Register Lien</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={lienReference}
              onChange={(e) => setLienReference(e.target.value)}
              placeholder="Lien reference number / PPSR registration"
              className="flex-1 px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-f2k-blue outline-none"
            />
            <button
              onClick={handleLien}
              disabled={actionLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
            >
              Register Lien
            </button>
          </div>
        </div>
      )}

      {stake.status === "lien_registered" && (
        <div className="bg-white rounded-xl p-5 shadow-sm border mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Mint Tokens</h3>
          <p className="text-sm text-gray-600 mb-3">
            Lien is registered. Minting will calculate tokens at current NAV and create a synthetic subscription record.
          </p>
          <button
            onClick={handleMint}
            disabled={actionLoading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
          >
            {actionLoading ? "Minting..." : "Mint F2K-HT Tokens"}
          </button>
        </div>
      )}

      {/* Audit trail */}
      <div className="text-xs text-gray-400 mt-4">
        Created: {new Date(stake.created_at).toLocaleString()}
        {stake.reviewed_at && ` | Reviewed: ${new Date(stake.reviewed_at).toLocaleString()}`}
      </div>
    </div>
  );
}
