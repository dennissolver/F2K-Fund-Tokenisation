"use client";

import { useState, type FormEvent } from "react";

const regions = [
  "NSW",
  "VIC",
  "QLD",
  "WA",
  "SA",
  "TAS",
  "NT",
  "ACT",
  "National",
  "International",
] as const;

const positions = [
  "Chair — Board of Directors",
  "Independent Director — Financial Services",
  "Independent Director — Construction / Manufacturing",
  "Responsible Manager #2",
  "Compliance Officer",
  "Head of Social Housing",
  "Manufacturer Relations Manager",
  "Compliance & QA Manager",
  "Government Procurement Manager",
  "Other",
] as const;

export default function CareerInterestForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [region, setRegion] = useState("");
  const [position, setPosition] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [experience, setExperience] = useState("");
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
          type: "career",
          org_name: position || "Career Interest",
          contact_name: contactName,
          contact_email: contactEmail,
          contact_phone: contactPhone || undefined,
          region: region || undefined,
          message: message || undefined,
          honeypot: honeypot || undefined,
          details: {
            position,
            linkedin_url: linkedIn || undefined,
            experience_summary: experience || undefined,
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
          Thank You
        </h3>
        <p className="text-slate font-archivo leading-relaxed">
          Your expression of interest has been received. A member of the F2K
          leadership team will be in touch within 5 business days.
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Full Name *</label>
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
        <div>
          <label className={labelClass}>Location</label>
          <select
            className={inputClass}
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="">Select location...</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="border-t border-black/5 pt-5 space-y-5">
        <div>
          <label className={labelClass}>Position of Interest *</label>
          <select
            className={inputClass}
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          >
            <option value="">Select position...</option>
            {positions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>LinkedIn Profile URL</label>
          <input
            type="url"
            className={inputClass}
            value={linkedIn}
            onChange={(e) => setLinkedIn(e.target.value)}
            placeholder="https://linkedin.com/in/..."
          />
        </div>
        <div>
          <label className={labelClass}>Relevant Experience</label>
          <textarea
            className={inputClass}
            rows={4}
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="Briefly describe your relevant experience — industry background, years of experience, key achievements..."
          />
        </div>
        <div>
          <label className={labelClass}>Why F2K?</label>
          <textarea
            className={inputClass}
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What draws you to the F2K mission and this role?"
          />
        </div>
      </div>

      {error && <p className="text-red-600 text-sm font-archivo">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-ember hover:bg-ember/90 text-white px-8 py-3 font-archivo font-semibold transition-colors disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Express Interest"}
      </button>
    </form>
  );
}
