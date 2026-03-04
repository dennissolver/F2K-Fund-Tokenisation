"use client";

import { useState, useEffect } from "react";
import { CONCENTRATION_LIMITS } from "@f2k/shared";

interface AssetClassRow {
  id: string;
  code: string;
  label: string;
  ltv_ratio: number;
  requires_appraisal: boolean;
  enabled: boolean;
  min_value_usd: number;
}

interface ConcentrationData {
  byClass: Record<string, { value: number; pct: number; count: number; tier: number }>;
  tier12Pct: number;
  largestSingleAssetPct: number;
  totalStakedValue: number;
  totalFundNav: number;
  breaches: {
    classOver40: string[];
    tier12Under25: boolean;
    singleAssetOver5: boolean;
  };
}

export default function AssetClassesPage() {
  const [classes, setClasses] = useState<AssetClassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLtv, setEditLtv] = useState("");
  const [editMinValue, setEditMinValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [concentration, setConcentration] = useState<ConcentrationData | null>(null);

  useEffect(() => {
    fetchClasses();
    fetchConcentration();
  }, []);

  async function fetchClasses() {
    const res = await fetch("/api/asset-classes");
    if (res.ok) {
      const data = await res.json();
      setClasses(data.classes || []);
    }
    setLoading(false);
  }

  async function fetchConcentration() {
    const res = await fetch("/api/concentration");
    if (res.ok) {
      setConcentration(await res.json());
    }
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

      {/* Fund Concentration Dashboard */}
      {concentration && (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold text-navy mb-4">Fund Concentration</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Per-class bars */}
            <div className="md:col-span-2 space-y-3">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">
                Asset Class Exposure (40% limit)
              </p>
              {Object.entries(concentration.byClass)
                .sort(([, a], [, b]) => b.pct - a.pct)
                .map(([code, data]) => {
                  const pct = data.pct * 100;
                  const isOver = pct > CONCENTRATION_LIMITS.maxAssetClassPct * 100;
                  return (
                    <div key={code}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize font-medium text-gray-700">
                          {code} <span className="text-gray-400 text-xs">Tier {data.tier}</span>
                        </span>
                        <span className={isOver ? "text-red-600 font-semibold" : "text-gray-600"}>
                          {pct.toFixed(1)}% (${data.value.toLocaleString()})
                        </span>
                      </div>
                      <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isOver ? "bg-red-500" : pct > 30 ? "bg-amber-400" : "bg-green-500"
                          }`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                        {/* 40% limit line */}
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-red-400"
                          style={{ left: "40%" }}
                          title="40% limit"
                        />
                      </div>
                    </div>
                  );
                })}
              {Object.keys(concentration.byClass).length === 0 && (
                <p className="text-gray-400 text-sm">No active stakes</p>
              )}
            </div>

            {/* Tier 1+2 gauge + single asset */}
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">
                  Tier 1+2 (Cash/Bonds)
                </p>
                <div className="text-center">
                  <span
                    className={`text-3xl font-bold ${
                      concentration.tier12Pct < CONCENTRATION_LIMITS.minTier12Pct
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {(concentration.tier12Pct * 100).toFixed(1)}%
                  </span>
                  <p className="text-xs text-gray-400 mt-1">Minimum 25% required</p>
                  {concentration.breaches.tier12Under25 && (
                    <p className="text-xs text-red-500 mt-1 font-medium">Below minimum threshold</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">
                  Largest Single Asset
                </p>
                <div className="text-center">
                  <span
                    className={`text-3xl font-bold ${
                      concentration.largestSingleAssetPct > CONCENTRATION_LIMITS.maxSingleAssetPct
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {(concentration.largestSingleAssetPct * 100).toFixed(1)}%
                  </span>
                  <p className="text-xs text-gray-400 mt-1">5% limit per asset</p>
                </div>
              </div>

              <div className="pt-2 border-t text-xs text-gray-500 space-y-1">
                <div className="flex justify-between">
                  <span>Total Staked</span>
                  <span>${concentration.totalStakedValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fund NAV</span>
                  <span>${concentration.totalFundNav.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
