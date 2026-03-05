"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const statusColors: Record<string, string> = {
  new: "bg-yellow-100 text-yellow-700",
  contacted: "bg-blue-100 text-blue-700",
  qualified: "bg-emerald-100 text-emerald-700",
  declined: "bg-red-100 text-red-700",
};

const typeLabels: Record<string, string> = {
  lender: "Construction Lender",
  government: "Government / Employer Tenant",
  offtaker: "Stabilised Asset Offtaker",
};

export default function RegistrationDetailPage() {
  const params = useParams();
  const [roi, setRoi] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/registrations/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setRoi(data.registration);
        setStatus(data.registration.status);
        setNotes(data.registration.notes || "");
      }
      setLoading(false);
    }
    load();
  }, [params.id]);

  async function handleStatusUpdate() {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/registrations/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update");
      }
      const data = await res.json();
      setRoi(data.registration);
      setSuccess("Status updated successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-gray-400">Loading...</div>;
  }

  if (!roi) {
    return <div className="p-8 text-red-500">Registration not found.</div>;
  }

  const details = roi.details || {};

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <a href="/registrations" className="text-sm text-navy hover:underline">
          &larr; All Registrations
        </a>
      </div>

      <h2 className="text-2xl font-bold text-navy mb-1">{roi.org_name}</h2>
      <p className="text-gray-500 mb-6">{typeLabels[roi.type] || roi.type}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Contact Info */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-navy mb-4">Contact Information</h3>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-gray-500">Name</dt>
              <dd className="font-medium">{roi.contact_name}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Email</dt>
              <dd className="font-medium">{roi.contact_email}</dd>
            </div>
            {roi.contact_phone && (
              <div>
                <dt className="text-gray-500">Phone</dt>
                <dd className="font-medium">{roi.contact_phone}</dd>
              </div>
            )}
            {roi.region && (
              <div>
                <dt className="text-gray-500">Region</dt>
                <dd className="font-medium">{roi.region}</dd>
              </div>
            )}
            {roi.organisation_type && (
              <div>
                <dt className="text-gray-500">Organisation Type</dt>
                <dd className="font-medium">{roi.organisation_type}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Status & Dates */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-navy mb-4">Status</h3>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-gray-500">Current Status</dt>
              <dd>
                <span className={`px-2 py-0.5 rounded text-xs ${statusColors[roi.status] || "bg-gray-100"}`}>
                  {roi.status}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Submitted</dt>
              <dd className="font-medium">{new Date(roi.created_at).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Last Updated</dt>
              <dd className="font-medium">{new Date(roi.updated_at).toLocaleString()}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Type-specific details */}
      {Object.keys(details).length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h3 className="font-semibold text-navy mb-4">Details</h3>
          <dl className="space-y-3 text-sm">
            {Object.entries(details).map(([key, value]) => (
              <div key={key}>
                <dt className="text-gray-500 capitalize">{key.replace(/_/g, " ")}</dt>
                <dd className="font-medium">
                  {Array.isArray(value) ? value.join(", ") : String(value || "—")}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Message */}
      {roi.message && (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h3 className="font-semibold text-navy mb-4">Message</h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{roi.message}</p>
        </div>
      )}

      {/* Status Update */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-navy mb-4">Update Status</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border rounded px-3 py-2 text-sm w-full max-w-xs"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="declined">Declined</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border rounded px-3 py-2 text-sm w-full"
              rows={3}
              placeholder="Internal notes about this registration..."
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-emerald-600 text-sm">{success}</p>}
          <button
            onClick={handleStatusUpdate}
            disabled={saving}
            className="bg-navy text-white px-4 py-2 rounded text-sm hover:bg-navy/80 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
