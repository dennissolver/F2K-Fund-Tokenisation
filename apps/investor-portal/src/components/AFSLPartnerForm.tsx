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
] as const;

const serviceTypes = [
  "Full CAR arrangement (operate under your AFSL)",
  "Intermediary authorisation",
  "Compliance outsourcing only",
  "Turnkey fund hosting (AFSL + compliance + administration)",
  "Other",
] as const;

export default function AFSLPartnerForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [orgName, setOrgName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [region, setRegion] = useState("");
  const [afslNumber, setAfslNumber] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [authorisations, setAuthorisations] = useState("");
  const [existingFunds, setExistingFunds] = useState("");
  const [digitalAssets, setDigitalAssets] = useState("");
  const [feeStructure, setFeeStructure] = useState("");
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
          type: "afsl_partner",
          org_name: orgName,
          contact_name: contactName,
          contact_email: contactEmail,
          contact_phone: contactPhone || undefined,
          region: region || undefined,
          message: message || undefined,
          honeypot: honeypot || undefined,
          details: {
            afsl_number: afslNumber,
            service_type: serviceType || undefined,
            authorisations: authorisations || undefined,
            existing_funds_under_management: existingFunds || undefined,
            digital_assets_experience: digitalAssets || undefined,
            indicative_fee_structure: feeStructure || undefined,
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
          Your expression of interest has been received. The F2K leadership team
          will review your submission and be in touch within 5 business days to
          discuss the opportunity.
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
          <label className={labelClass}>Organisation Name *</label>
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
          <label className={labelClass}>AFSL Number *</label>
          <input
            className={inputClass}
            value={afslNumber}
            onChange={(e) => setAfslNumber(e.target.value)}
            required
            placeholder="e.g. 123456"
          />
        </div>
      </div>

      <div className="border-t border-black/5 pt-5 space-y-5">
        <div>
          <label className={labelClass}>Service Type *</label>
          <select
            className={inputClass}
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            required
          >
            <option value="">Select service type...</option>
            {serviceTypes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>
            Current AFSL Authorisations Held *
          </label>
          <textarea
            className={inputClass}
            rows={3}
            value={authorisations}
            onChange={(e) => setAuthorisations(e.target.value)}
            required
            placeholder="e.g. Operate registered MIS, deal in financial products, provide general/personal advice to wholesale clients..."
          />
        </div>
        <div>
          <label className={labelClass}>
            Existing Funds Under Management / CARs Hosted
          </label>
          <textarea
            className={inputClass}
            rows={2}
            value={existingFunds}
            onChange={(e) => setExistingFunds(e.target.value)}
            placeholder="Number of funds, total AUM, types of strategies hosted..."
          />
        </div>
        <div>
          <label className={labelClass}>
            Digital Assets / Tokenised Securities Experience
          </label>
          <textarea
            className={inputClass}
            rows={2}
            value={digitalAssets}
            onChange={(e) => setDigitalAssets(e.target.value)}
            placeholder="Any experience with tokenised funds, digital asset custody, ERC-3643, blockchain-based MIS..."
          />
        </div>
        <div>
          <label className={labelClass}>Indicative Fee Structure</label>
          <textarea
            className={inputClass}
            rows={2}
            value={feeStructure}
            onChange={(e) => setFeeStructure(e.target.value)}
            placeholder="Indicative annual fees, setup costs, compliance monitoring charges..."
          />
        </div>
        <div>
          <label className={labelClass}>Additional Information</label>
          <textarea
            className={inputClass}
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Why your firm is the right AFSL partner for a tokenised housing fund..."
          />
        </div>
      </div>

      {error && <p className="text-red-600 text-sm font-archivo">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-ember hover:bg-ember/90 text-white px-8 py-3 font-archivo font-semibold transition-colors disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Expression of Interest"}
      </button>
    </form>
  );
}
