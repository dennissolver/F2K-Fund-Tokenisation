"use client";

import { useState, type FormEvent } from "react";

const projectTypes = [
  "Social Housing",
  "Affordable Housing",
  "NDIS SDA (Specialist Disability)",
  "Build-to-Rent",
  "Defence Housing",
  "Residential Subdivision (10+ lots)",
  "Key Worker Housing",
  "Student Accommodation",
] as const;

const dwellingRanges = [
  "10 – 30",
  "31 – 100",
  "101 – 250",
  "251 – 500",
  "500+",
] as const;

const landStatuses = [
  "Owned — DA approved",
  "Owned — DA pending",
  "Under contract / option",
  "Council or government owned (available for partnership)",
  "Identified but not secured",
] as const;

const constructionPreferences = [
  "Modular / volumetric — preferred",
  "Panelised / flat-pack — preferred",
  "Open to any modern method of construction",
  "Traditional construction only",
] as const;

const fundingStatuses = [
  "Fully funded",
  "Partially funded — seeking co-investment",
  "Government grant secured — seeking delivery partner",
  "Unfunded — seeking full development finance",
] as const;

const regions = [
  "NSW",
  "VIC",
  "QLD",
  "WA",
  "SA",
  "TAS",
  "NT",
  "ACT",
] as const;

export default function ProjectSubmitForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [orgName, setOrgName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [region, setRegion] = useState("");
  const [projectType, setProjectType] = useState("");
  const [dwellingCount, setDwellingCount] = useState("");
  const [landStatus, setLandStatus] = useState("");
  const [constructionPref, setConstructionPref] = useState("");
  const [fundingStatus, setFundingStatus] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [timeline, setTimeline] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/register-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "project",
          org_name: orgName,
          contact_name: contactName,
          contact_email: contactEmail,
          contact_phone: contactPhone || undefined,
          region: region || undefined,
          message: message || undefined,
          honeypot: honeypot || undefined,
          details: {
            project_type: projectType,
            dwelling_count: dwellingCount,
            land_status: landStatus,
            construction_preference: constructionPref,
            funding_status: fundingStatus,
            site_address: siteAddress || undefined,
            target_timeline: timeline || undefined,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="bg-white p-8 border border-black/5 text-center">
        <h3 className="font-playfair text-2xl font-bold text-deep-blue mb-3">
          Project Received
        </h3>
        <p className="text-slate font-archivo leading-relaxed">
          Thank you for submitting your project. Our team will review the
          details and respond within 5 business days if the project fits
          F2K&apos;s delivery model.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full border border-black/10 px-4 py-2.5 font-archivo text-sm text-deep-blue focus:outline-none focus:border-ember transition-colors";
  const labelClass =
    "block text-deep-blue font-semibold font-archivo text-sm mb-1";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 border border-black/5 space-y-5"
    >
      {/* Honeypot */}
      <input
        tabIndex={-1}
        aria-hidden
        style={{ position: "absolute", left: "-9999px" }}
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        autoComplete="off"
      />

      {/* Contact */}
      <p className="font-ibm-mono text-[0.6rem] tracking-[0.3em] uppercase text-ember">
        Your Details
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Organisation / Entity Name *</label>
          <input
            className={inputClass}
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Contact Name *</label>
          <input
            className={inputClass}
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Email *</label>
          <input
            type="email"
            className={inputClass}
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input
            type="tel"
            className={inputClass}
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
        </div>
      </div>

      {/* Project qualifying fields */}
      <div className="border-t border-black/5 pt-5 space-y-5">
        <p className="font-ibm-mono text-[0.6rem] tracking-[0.3em] uppercase text-ember">
          Project Details
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Project Type *</label>
            <select
              className={inputClass}
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              required
            >
              <option value="">Select type...</option>
              {projectTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Number of Dwellings *</label>
            <select
              className={inputClass}
              value={dwellingCount}
              onChange={(e) => setDwellingCount(e.target.value)}
              required
            >
              <option value="">Select range...</option>
              {dwellingRanges.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>State *</label>
            <select
              className={inputClass}
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              required
            >
              <option value="">Select state...</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Land Status *</label>
            <select
              className={inputClass}
              value={landStatus}
              onChange={(e) => setLandStatus(e.target.value)}
              required
            >
              <option value="">Select status...</option>
              {landStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Construction Preference *</label>
            <select
              className={inputClass}
              value={constructionPref}
              onChange={(e) => setConstructionPref(e.target.value)}
              required
            >
              <option value="">Select preference...</option>
              {constructionPreferences.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Funding Status *</label>
            <select
              className={inputClass}
              value={fundingStatus}
              onChange={(e) => setFundingStatus(e.target.value)}
              required
            >
              <option value="">Select status...</option>
              {fundingStatuses.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Site Address / LGA</label>
          <input
            className={inputClass}
            value={siteAddress}
            onChange={(e) => setSiteAddress(e.target.value)}
            placeholder="Street address, suburb, or Local Government Area"
          />
        </div>
        <div>
          <label className={labelClass}>Target Construction Start</label>
          <input
            className={inputClass}
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            placeholder="e.g. Q3 2026, Within 12 months, DA dependent"
          />
        </div>
        <div>
          <label className={labelClass}>Project Summary</label>
          <textarea
            className={inputClass}
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Brief description of the project — site context, target demographic, any existing approvals or partnerships..."
          />
        </div>
      </div>

      {error && <p className="text-red-600 text-sm font-archivo">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-ember hover:bg-ember/90 text-white px-8 py-3 font-archivo font-semibold transition-colors disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Project"}
      </button>
    </form>
  );
}
