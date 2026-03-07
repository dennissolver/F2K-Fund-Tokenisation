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
  career: "Career Application",
  introducer: "Introducer",
  afsl_partner: "AFSL Partner",
  project: "Project Submission",
};

const recommendationColors: Record<string, string> = {
  BUY: "bg-green-100 text-green-800 border-green-300",
  NEGOTIATE: "bg-amber-100 text-amber-800 border-amber-300",
  PASS: "bg-red-100 text-red-800 border-red-300",
  MORE_INFO_NEEDED: "bg-blue-100 text-blue-800 border-blue-300",
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
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/registrations/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setRoi(data.registration);
        setStatus(data.registration.status);
        setNotes(data.registration.notes || "");
        if (data.registration.details?.deal_analysis) {
          setAnalysis(data.registration.details.deal_analysis);
        }
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

  async function runDealAnalysis() {
    setAnalyzing(true);
    setError("");
    try {
      const res = await fetch(`/api/registrations/${params.id}/analyze`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed");
      }
      const data = await res.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
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

      {/* Deal Analysis — only for project submissions */}
      {roi.type === "project" && (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-navy">AI Deal Analysis</h3>
            <button
              onClick={runDealAnalysis}
              disabled={analyzing}
              className="bg-navy text-white px-4 py-2 rounded text-sm hover:bg-navy/80 disabled:opacity-50"
            >
              {analyzing ? "Analysing..." : analysis ? "Re-run Analysis" : "Run Deal Analysis"}
            </button>
          </div>

          {analysis && (
            <div className="space-y-6">
              {/* Recommendation Banner */}
              <div
                className={`border rounded-lg p-4 ${
                  recommendationColors[String(analysis.recommendation)] || "bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wider opacity-70">
                      Recommendation
                    </span>
                    <div className="text-2xl font-bold">
                      {String(analysis.recommendation)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium uppercase tracking-wider opacity-70">
                      Confidence
                    </span>
                    <div className="text-lg font-semibold capitalize">
                      {String(analysis.confidence)}
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm">{String(analysis.recommendation_summary)}</p>
              </div>

              {/* Quick Screen */}
              {analysis.quick_screen && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">Quick Screen</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(analysis.quick_screen as Record<string, string>).map(
                      ([key, val]) => {
                        const v = String(val);
                        return (
                          <div
                            key={key}
                            className={`rounded-lg p-3 text-center text-sm ${
                              v === "PASS"
                                ? "bg-green-50 text-green-700"
                                : v === "FAIL"
                                ? "bg-red-50 text-red-700"
                                : "bg-yellow-50 text-yellow-700"
                            }`}
                          >
                            <div className="font-semibold">{v}</div>
                            <div className="text-xs capitalize opacity-70">
                              {key.replace(/_/g, " ")}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

              {/* Financial Assessment */}
              {analysis.financial_assessment && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">
                    Financial Assessment
                  </h4>
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    {Object.entries(
                      analysis.financial_assessment as Record<string, unknown>
                    ).map(([key, val]) => (
                      <div key={key} className="bg-gray-50 rounded-lg p-3">
                        <dt className="text-xs text-gray-500 capitalize">
                          {key.replace(/_/g, " ")}
                        </dt>
                        <dd className="font-semibold mt-1">
                          {val === null
                            ? "Insufficient data"
                            : typeof val === "number"
                            ? val.toFixed(1) + "%"
                            : String(val)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Strengths & Risks side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.strengths && (analysis.strengths as string[]).length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-green-700 mb-2">Strengths</h4>
                    <ul className="space-y-1">
                      {(analysis.strengths as string[]).map((s, i) => (
                        <li key={i} className="text-sm text-gray-700 flex gap-2">
                          <span className="text-green-500 flex-shrink-0">+</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {analysis.risk_factors && (analysis.risk_factors as string[]).length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-red-700 mb-2">Risk Factors</h4>
                    <ul className="space-y-1">
                      {(analysis.risk_factors as string[]).map((r, i) => (
                        <li key={i} className="text-sm text-gray-700 flex gap-2">
                          <span className="text-red-500 flex-shrink-0">!</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Missing Information */}
              {analysis.missing_information &&
                (analysis.missing_information as string[]).length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-amber-700 mb-2">
                      Missing Information
                    </h4>
                    <ul className="space-y-1">
                      {(analysis.missing_information as string[]).map((m, i) => (
                        <li key={i} className="text-sm text-gray-700 flex gap-2">
                          <span className="text-amber-500 flex-shrink-0">?</span>
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Next Steps */}
              {analysis.suggested_next_steps &&
                (analysis.suggested_next_steps as string[]).length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-navy mb-2">Suggested Next Steps</h4>
                    <ol className="space-y-1 list-decimal list-inside">
                      {(analysis.suggested_next_steps as string[]).map((s, i) => (
                        <li key={i} className="text-sm text-gray-700">
                          {s}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
            </div>
          )}

          {!analysis && !analyzing && (
            <p className="text-sm text-gray-400">
              Click &ldquo;Run Deal Analysis&rdquo; to get an AI-powered assessment of this project
              against F2K fund investment criteria.
            </p>
          )}
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
