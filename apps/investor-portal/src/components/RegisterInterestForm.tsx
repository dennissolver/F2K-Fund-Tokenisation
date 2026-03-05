"use client";

import { useState, type FormEvent } from "react";

interface Props {
  type: "lender" | "government" | "offtaker";
}

const regions = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT", "National"] as const;

const facilityTypes = ["Construction", "Development", "Bridging"] as const;

const offtakerOrgTypes = ["REIT", "CHP", "Private Manager", "Institutional"] as const;

export default function RegisterInterestForm({ type }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Shared fields
  const [orgName, setOrgName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [region, setRegion] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  // Lender fields
  const [lendingCapacity, setLendingCapacity] = useState("");
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

  // Government fields
  const [departmentName, setDepartmentName] = useState("");
  const [housingNeed, setHousingNeed] = useState("");
  const [preferredLocations, setPreferredLocations] = useState("");

  // Offtaker fields
  const [organisationType, setOrganisationType] = useState("");
  const [portfolioSize, setPortfolioSize] = useState("");
  const [assetClasses, setAssetClasses] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const details: Record<string, unknown> = {};
    if (type === "lender") {
      details.lending_capacity = lendingCapacity;
      details.facility_types = selectedFacilities;
    } else if (type === "government") {
      details.department_name = departmentName;
      details.housing_need = housingNeed ? Number(housingNeed) : undefined;
      details.preferred_locations = preferredLocations;
    } else {
      details.portfolio_size = portfolioSize;
      details.asset_classes_of_interest = assetClasses;
    }

    try {
      const res = await fetch("/api/register-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          org_name: orgName,
          contact_name: contactName,
          contact_email: contactEmail,
          contact_phone: contactPhone || undefined,
          organisation_type: type === "offtaker" ? organisationType || undefined : undefined,
          region: region || undefined,
          message: message || undefined,
          honeypot: honeypot || undefined,
          details,
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
          Your registration of interest has been received. A member of the F2K team
          will be in touch within 2 business days.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full border border-black/10 px-4 py-2.5 font-archivo text-sm text-deep-blue focus:outline-none focus:border-ember transition-colors";
  const labelClass = "block text-deep-blue font-semibold font-archivo text-sm mb-1";

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 border border-black/5 space-y-5">
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
          <input className={inputClass} value={orgName} onChange={(e) => setOrgName(e.target.value)} required />
        </div>
        <div>
          <label className={labelClass}>Contact Name *</label>
          <input className={inputClass} value={contactName} onChange={(e) => setContactName(e.target.value)} required />
        </div>
        <div>
          <label className={labelClass}>Email *</label>
          <input type="email" className={inputClass} value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input type="tel" className={inputClass} value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Region</label>
          <select className={inputClass} value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="">Select region...</option>
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Type-specific fields */}
      {type === "lender" && (
        <div className="space-y-5 border-t border-black/5 pt-5">
          <div>
            <label className={labelClass}>Lending Capacity (AUD)</label>
            <input className={inputClass} value={lendingCapacity} onChange={(e) => setLendingCapacity(e.target.value)} placeholder="e.g. $10M - $50M" />
          </div>
          <div>
            <label className={labelClass}>Facility Types</label>
            <div className="flex flex-wrap gap-4 mt-1">
              {facilityTypes.map((ft) => (
                <label key={ft} className="flex items-center gap-2 font-archivo text-sm text-slate cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFacilities.includes(ft)}
                    onChange={(e) => {
                      setSelectedFacilities((prev) =>
                        e.target.checked ? [...prev, ft] : prev.filter((f) => f !== ft)
                      );
                    }}
                    className="accent-ember"
                  />
                  {ft}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {type === "government" && (
        <div className="space-y-5 border-t border-black/5 pt-5">
          <div>
            <label className={labelClass}>Department / Agency Name</label>
            <input className={inputClass} value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Housing Need (number of dwellings)</label>
            <input type="number" className={inputClass} value={housingNeed} onChange={(e) => setHousingNeed(e.target.value)} placeholder="e.g. 50" />
          </div>
          <div>
            <label className={labelClass}>Preferred Locations</label>
            <input className={inputClass} value={preferredLocations} onChange={(e) => setPreferredLocations(e.target.value)} placeholder="e.g. Western NSW, Far North QLD" />
          </div>
        </div>
      )}

      {type === "offtaker" && (
        <div className="space-y-5 border-t border-black/5 pt-5">
          <div>
            <label className={labelClass}>Organisation Type</label>
            <select className={inputClass} value={organisationType} onChange={(e) => setOrganisationType(e.target.value)}>
              <option value="">Select type...</option>
              {offtakerOrgTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Portfolio Size (AUD)</label>
            <input className={inputClass} value={portfolioSize} onChange={(e) => setPortfolioSize(e.target.value)} placeholder="e.g. $100M+" />
          </div>
          <div>
            <label className={labelClass}>Asset Classes of Interest</label>
            <input className={inputClass} value={assetClasses} onChange={(e) => setAssetClasses(e.target.value)} placeholder="e.g. Residential, Social Housing" />
          </div>
        </div>
      )}

      <div>
        <label className={labelClass}>Message</label>
        <textarea className={inputClass} rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us about your interest in the F2K pipeline..." />
      </div>

      {error && (
        <p className="text-red-600 text-sm font-archivo">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="bg-ember hover:bg-ember/90 text-white px-8 py-3 font-archivo font-semibold transition-colors disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Register Interest"}
      </button>
    </form>
  );
}
