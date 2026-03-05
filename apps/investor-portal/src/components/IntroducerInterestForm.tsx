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

const channelTypes = [
  "Financial Adviser (AFSL holder)",
  "Authorised Representative",
  "Mortgage Broker",
  "Property Adviser",
  "Institutional Placement Agent",
  "Family Office",
  "Fund-of-Funds",
  "Accountant / Tax Adviser",
  "Other",
] as const;

export default function IntroducerInterestForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [orgName, setOrgName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [region, setRegion] = useState("");
  const [channelType, setChannelType] = useState("");
  const [afslNumber, setAfslNumber] = useState("");
  const [clientBase, setClientBase] = useState("");
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
          type: "introducer",
          org_name: orgName,
          contact_name: contactName,
          contact_email: contactEmail,
          contact_phone: contactPhone || undefined,
          region: region || undefined,
          message: message || undefined,
          honeypot: honeypot || undefined,
          details: {
            channel_type: channelType || undefined,
            afsl_number: afslNumber || undefined,
            client_base_description: clientBase || undefined,
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
          Your introducer application has been received. A member of the F2K
          distribution team will be in touch within 5 business days to discuss
          terms and onboarding.
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
          <label className={labelClass}>Organisation / Practice Name *</label>
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
        <div>
          <label className={labelClass}>Channel Type *</label>
          <select
            className={inputClass}
            value={channelType}
            onChange={(e) => setChannelType(e.target.value)}
            required
          >
            <option value="">Select type...</option>
            {channelTypes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="border-t border-black/5 pt-5 space-y-5">
        <div>
          <label className={labelClass}>AFSL Number (if applicable)</label>
          <input
            className={inputClass}
            value={afslNumber}
            onChange={(e) => setAfslNumber(e.target.value)}
            placeholder="e.g. 123456"
          />
        </div>
        <div>
          <label className={labelClass}>Client Base Description</label>
          <textarea
            className={inputClass}
            rows={3}
            value={clientBase}
            onChange={(e) => setClientBase(e.target.value)}
            placeholder="Approximate number of wholesale-eligible clients, typical investment size, sectors..."
          />
        </div>
        <div>
          <label className={labelClass}>Message</label>
          <textarea
            className={inputClass}
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us about your interest in distributing the F2K Housing Token..."
          />
        </div>
      </div>

      {error && <p className="text-red-600 text-sm font-archivo">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-ember hover:bg-ember/90 text-white px-8 py-3 font-archivo font-semibold transition-colors disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Apply to Become an Introducer"}
      </button>
    </form>
  );
}
