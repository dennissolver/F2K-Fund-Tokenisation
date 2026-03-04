"use client";

import { useState, useEffect } from "react";

interface AssetClassRow {
  id: string;
  code: string;
  label: string;
  ltv_ratio: number;
  requires_appraisal: boolean;
  enabled: boolean;
  min_value_usd: number;
}

export default function AssetClassesPage() {
  const [classes, setClasses] = useState<AssetClassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLtv, setEditLtv] = useState("");
  const [editMinValue, setEditMinValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  async function fetchClasses() {
    const res = await fetch("/api/asset-classes");
    if (res.ok) {
      const data = await res.json();
      setClasses(data.classes || []);
    }
    setLoading(false);
  }

  async function handleSave(id: string) {
    setSaving(true);
    setMessage(null);

    const updates: Record<string, unknown> = {};
    if (editLtv) updates.ltv_ratio = parseFloat(editLtv) / 100;
    if (editMinValue) updates.min_value_usd = parseFloat(editMinValue);

    const res = await fetch(`/api/asset-classes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (res.ok) {
      setMessage("Updated");
      setEditingId(null);
      fetchClasses();
    } else {
      const data = await res.json();
      setMessage(data.error || "Failed to update");
    }
    setSaving(false);
  }

  async function handleToggle(id: string, currentEnabled: boolean) {
    const res = await fetch(`/api/asset-classes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !currentEnabled }),
    });

    if (res.ok) {
      fetchClasses();
    }
  }

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy mb-6">Asset Classes</h2>

      {message && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-500">
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Label</th>
              <th className="px-4 py-3">LTV Ratio</th>
              <th className="px-4 py-3">Min Value</th>
              <th className="px-4 py-3">Appraisal</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((c) => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-mono">{c.code}</td>
                <td className="px-4 py-3 font-medium">{c.label}</td>
                <td className="px-4 py-3">
                  {editingId === c.id ? (
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editLtv}
                      onChange={(e) => setEditLtv(e.target.value)}
                      className="w-20 px-2 py-1 border rounded text-sm"
                      placeholder={String(Number(c.ltv_ratio) * 100)}
                    />
                  ) : (
                    `${(Number(c.ltv_ratio) * 100).toFixed(0)}%`
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingId === c.id ? (
                    <input
                      type="number"
                      value={editMinValue}
                      onChange={(e) => setEditMinValue(e.target.value)}
                      className="w-28 px-2 py-1 border rounded text-sm"
                      placeholder={String(c.min_value_usd)}
                    />
                  ) : (
                    `$${Number(c.min_value_usd).toLocaleString()}`
                  )}
                </td>
                <td className="px-4 py-3">
                  {c.requires_appraisal ? (
                    <span className="text-amber-600">Required</span>
                  ) : (
                    <span className="text-gray-400">No</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggle(c.id, c.enabled)}
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      c.enabled
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {c.enabled ? "Enabled" : "Disabled"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  {editingId === c.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave(c.id)}
                        disabled={saving}
                        className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(c.id);
                        setEditLtv(String(Number(c.ltv_ratio) * 100));
                        setEditMinValue(String(c.min_value_usd));
                      }}
                      className="text-xs bg-navy text-white px-2 py-1 rounded hover:bg-navy/80"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
