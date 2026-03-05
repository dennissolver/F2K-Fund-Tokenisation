"use client";

import { useState, useEffect } from "react";

type SpvEntityType = "unit_trust" | "pty_ltd" | "partnership";
type SpvStatus = "active" | "winding_down" | "closed";

interface Spv {
  id: string;
  name: string;
  entity_type: SpvEntityType;
  abn: string | null;
  status: SpvStatus;
  target_allocation: number | null;
  current_nav: number | null;
  description: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

const ENTITY_TYPE_LABELS: Record<SpvEntityType, string> = {
  unit_trust: "Unit Trust",
  pty_ltd: "Pty Ltd",
  partnership: "Partnership",
};

const STATUS_STYLES: Record<SpvStatus, string> = {
  active: "bg-green-100 text-green-700",
  winding_down: "bg-yellow-100 text-yellow-700",
  closed: "bg-gray-100 text-gray-500",
};

const STATUS_LABELS: Record<SpvStatus, string> = {
  active: "Active",
  winding_down: "Winding Down",
  closed: "Closed",
};

export default function SpvsPage() {
  const [spvs, setSpvs] = useState<Spv[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // New SPV form
  const [showForm, setShowForm] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEntityType, setFormEntityType] = useState<SpvEntityType>("unit_trust");
  const [formAbn, setFormAbn] = useState("");
  const [formTargetAllocation, setFormTargetAllocation] = useState("");
  const [formDescription, setFormDescription] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState<SpvStatus>("active");
  const [editTargetAllocation, setEditTargetAllocation] = useState("");
  const [editCurrentNav, setEditCurrentNav] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  useEffect(() => {
    fetchSpvs();
  }, []);

  async function fetchSpvs() {
    const res = await fetch("/api/spvs");
    if (res.ok) {
      const data = await res.json();
      setSpvs(data.spvs || []);
    }
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormSubmitting(true);
    setMessage(null);

    const payload: Record<string, unknown> = {
      name: formName,
      entity_type: formEntityType,
    };
    if (formAbn.trim()) payload.abn = formAbn.trim();
    if (formTargetAllocation) payload.target_allocation = parseFloat(formTargetAllocation);
    if (formDescription.trim()) payload.description = formDescription.trim();

    const res = await fetch("/api/spvs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setMessage({ type: "success", text: "SPV created successfully" });
      setShowForm(false);
      setFormName("");
      setFormEntityType("unit_trust");
      setFormAbn("");
      setFormTargetAllocation("");
      setFormDescription("");
      fetchSpvs();
    } else {
      const data = await res.json();
      setMessage({ type: "error", text: data.error || "Failed to create SPV" });
    }
    setFormSubmitting(false);
  }

  function startEdit(spv: Spv) {
    setEditingId(spv.id);
    setEditName(spv.name);
    setEditStatus(spv.status);
    setEditTargetAllocation(spv.target_allocation != null ? String(spv.target_allocation) : "");
    setEditCurrentNav(spv.current_nav != null ? String(spv.current_nav) : "");
    setEditDescription(spv.description || "");
  }

  async function handleUpdate(id: string) {
    setEditSubmitting(true);
    setMessage(null);

    const payload: Record<string, unknown> = {
      name: editName,
      status: editStatus,
      description: editDescription || null,
    };
    if (editTargetAllocation) payload.target_allocation = parseFloat(editTargetAllocation);
    if (editCurrentNav) payload.current_nav = parseFloat(editCurrentNav);

    const res = await fetch(`/api/spvs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setMessage({ type: "success", text: "SPV updated" });
      setEditingId(null);
      fetchSpvs();
    } else {
      const data = await res.json();
      setMessage({ type: "error", text: data.error || "Failed to update" });
    }
    setEditSubmitting(false);
  }

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-navy">SPV Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy/90"
        >
          {showForm ? "Cancel" : "New SPV"}
        </button>
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

      {/* New SPV Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Create New SPV</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Name *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                  placeholder="F2K SPV 1"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Entity Type *</label>
                <select
                  value={formEntityType}
                  onChange={(e) => setFormEntityType(e.target.value as SpvEntityType)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                >
                  <option value="unit_trust">Unit Trust</option>
                  <option value="pty_ltd">Pty Ltd</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">ABN</label>
                <input
                  type="text"
                  value={formAbn}
                  onChange={(e) => setFormAbn(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                  placeholder="12 345 678 901"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Target Allocation ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formTargetAllocation}
                  onChange={(e) => setFormTargetAllocation(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                  placeholder="500000.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Description</label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                rows={2}
                placeholder="Optional description of the SPV purpose"
              />
            </div>
            <button
              type="submit"
              disabled={formSubmitting}
              className="px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy/90 disabled:opacity-50"
            >
              {formSubmitting ? "Creating..." : "Create SPV"}
            </button>
          </form>
        </div>
      )}

      {/* SPV List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-500">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Entity Type</th>
              <th className="px-4 py-3">ABN</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Target Allocation</th>
              <th className="px-4 py-3">Current NAV</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {spvs.length > 0 ? (
              spvs.map((spv) => (
                <tr key={spv.id} className="border-t hover:bg-gray-50">
                  {editingId === spv.id ? (
                    <>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {ENTITY_TYPE_LABELS[spv.entity_type]}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{spv.abn || "---"}</td>
                      <td className="px-4 py-3">
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value as SpvStatus)}
                          className="px-2 py-1 border rounded text-sm"
                        >
                          <option value="active">Active</option>
                          <option value="winding_down">Winding Down</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          step="0.01"
                          value={editTargetAllocation}
                          onChange={(e) => setEditTargetAllocation(e.target.value)}
                          className="w-28 px-2 py-1 border rounded text-sm"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          step="0.01"
                          value={editCurrentNav}
                          onChange={(e) => setEditCurrentNav(e.target.value)}
                          className="w-28 px-2 py-1 border rounded text-sm"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(spv.id)}
                            disabled={editSubmitting}
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
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 font-medium">{spv.name}</td>
                      <td className="px-4 py-3">{ENTITY_TYPE_LABELS[spv.entity_type]}</td>
                      <td className="px-4 py-3 font-mono text-xs">{spv.abn || "---"}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs ${STATUS_STYLES[spv.status]}`}>
                          {STATUS_LABELS[spv.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {spv.target_allocation != null
                          ? `$${Number(spv.target_allocation).toLocaleString()}`
                          : "---"}
                      </td>
                      <td className="px-4 py-3">
                        {spv.current_nav != null
                          ? `$${Number(spv.current_nav).toLocaleString()}`
                          : "---"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => startEdit(spv)}
                          className="text-xs bg-navy text-white px-2 py-1 rounded hover:bg-navy/80"
                        >
                          Edit
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No SPVs created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
