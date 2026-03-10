"use client";

import { useState } from "react";
import { UNITS, HOUSE_TYPE_INFO } from "@/lib/branscombe-units";
import SiteMap from "./SiteMap";

export default function RegistrationForm() {
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleUnit = (unitId: string) => {
    setSelectedUnits((prev) =>
      prev.includes(unitId)
        ? prev.filter((id) => id !== unitId)
        : [...prev, unitId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (honeypot) {
      setSuccess(true);
      return;
    }

    if (selectedUnits.length === 0) {
      setError("Please select at least one unit on the site map above.");
      return;
    }

    if (!consent) {
      setError(
        "Please confirm you understand this is a Registration of Interest only."
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/branscombe/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          units_selected: selectedUnits,
          notes: notes.trim() || null,
          consent,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white p-10 border border-black/5 text-center">
        <div className="w-16 h-16 rounded-full bg-[#00B5AD]/10 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-[#00B5AD]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="font-playfair text-2xl font-black text-deep-blue mb-3">
          Registration Received
        </h3>
        <p className="text-slate font-archivo leading-relaxed max-w-md mx-auto mb-2">
          Thank you for your interest in Branscombe Estate. We&apos;ve recorded
          your interest in{" "}
          <strong>
            {selectedUnits.length} unit{selectedUnits.length > 1 ? "s" : ""}
          </strong>{" "}
          ({selectedUnits.join(", ")}).
        </p>
        <p className="text-slate/70 font-archivo text-sm">
          A confirmation has been sent to <strong>{email}</strong>. We&apos;ll be
          in touch as the project progresses.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full border border-black/10 px-4 py-2.5 font-archivo text-sm text-deep-blue focus:outline-none focus:border-[#00B5AD] transition-colors bg-white";
  const labelClass =
    "block text-deep-blue font-semibold font-archivo text-sm mb-1";

  return (
    <div>
      {/* ===== SITE MAP SECTION ===== */}
      <div id="site-map" className="mb-12">
        <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-[#00B5AD] mb-4">
          Interactive Site Plan
        </p>
        <h2 className="font-playfair text-[2rem] font-black text-deep-blue leading-tight mb-3">
          Select Your Preferred Home(s)
        </h2>
        <p className="text-slate font-archivo leading-relaxed mb-8">
          Click a unit to add it to your registration. You can select more than
          one. Colours indicate current interest level.
        </p>

        <SiteMap selectedUnits={selectedUnits} onToggleUnit={toggleUnit} />

        {/* Selected units summary */}
        {selectedUnits.length > 0 && (
          <div className="mt-6 bg-[#1A2744] text-white p-4 flex flex-wrap items-center gap-3">
            <span className="font-ibm-mono text-[0.65rem] tracking-[0.3em] uppercase opacity-60">
              Selected:
            </span>
            {selectedUnits
              .sort((a, b) => {
                const numA = parseInt(a.replace("U", ""));
                const numB = parseInt(b.replace("U", ""));
                return numA - numB;
              })
              .map((unitId) => {
                const unit = UNITS.find((u) => u.id === unitId);
                return (
                  <button
                    key={unitId}
                    type="button"
                    onClick={() => toggleUnit(unitId)}
                    className="bg-white/10 hover:bg-white/20 px-3 py-1 text-sm font-archivo transition-colors flex items-center gap-2"
                  >
                    {unitId}
                    {unit && (
                      <span className="opacity-50 text-xs">
                        Type {unit.type}
                      </span>
                    )}
                    <span className="opacity-40">&times;</span>
                  </button>
                );
              })}
          </div>
        )}
      </div>

      {/* ===== REGISTRATION FORM ===== */}
      <div id="register">
        <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-[#00B5AD] mb-4">
          Your Details
        </p>
        <h2 className="font-playfair text-[2rem] font-black text-deep-blue leading-tight mb-3">
          Register Your Interest
        </h2>
        <p className="text-slate font-archivo leading-relaxed mb-8">
          Complete the form below to register your interest. No deposit or
          commitment is required.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Honeypot */}
          <input
            tabIndex={-1}
            aria-hidden
            autoComplete="off"
            name="website_url"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ position: "absolute", left: "-9999px" }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="firstName" className={labelClass}>
                First Name *
              </label>
              <input
                id="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClass}
                placeholder="Jane"
              />
            </div>
            <div>
              <label htmlFor="lastName" className={labelClass}>
                Last Name *
              </label>
              <input
                id="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputClass}
                placeholder="Smith"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="email" className={labelClass}>
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="jane@example.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className={labelClass}>
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder="0400 000 000"
              />
            </div>
          </div>

          {/* Selected units display */}
          <div>
            <label className={labelClass}>
              Selected Unit(s) *
            </label>
            <div className="border border-black/10 px-4 py-2.5 bg-white min-h-[42px] font-archivo text-sm">
              {selectedUnits.length > 0 ? (
                <span className="text-deep-blue">
                  {selectedUnits
                    .sort((a, b) => parseInt(a.replace("U", "")) - parseInt(b.replace("U", "")))
                    .join(", ")}
                </span>
              ) : (
                <span className="text-slate/40">
                  Select units on the map above
                </span>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="notes" className={labelClass}>
              Notes / Questions
            </label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={inputClass}
              placeholder="Any questions or preferences..."
            />
          </div>

          {/* Consent checkbox */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 w-4 h-4 accent-[#00B5AD]"
            />
            <span className="text-sm text-slate font-archivo leading-relaxed">
              I understand this is a Registration of Interest only — no deposit or
              commitment is required or implied.
            </span>
          </label>

          {error && (
            <div className="bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-archivo">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="bg-[#00B5AD] hover:bg-[#009E97] text-white px-8 py-3 font-archivo font-semibold transition-colors disabled:opacity-50 w-full sm:w-auto"
          >
            {submitting ? "Submitting..." : "Register My Interest"}
          </button>
        </form>
      </div>
    </div>
  );
}
