"use client";

import { useState } from "react";
import Image from "next/image";
import { UNITS, HOUSE_TYPE_INFO, type HouseType } from "@/lib/branscombe-units";
import SiteMap from "./SiteMap";

const PRICE_RANGES = [
  "Under $350,000",
  "$350,000 – $400,000",
  "$400,000 – $450,000",
  "$450,000 – $500,000",
  "$500,000 – $550,000",
  "$550,000 – $600,000",
  "$600,000+",
] as const;

const REFERRER_TYPES = [
  "Real Estate Agent",
  "Mortgage Broker",
  "Financial Adviser",
  "Friend or Family",
  "Other",
] as const;

const BUYER_TYPES = [
  "First Home Buyer",
  "Next Home Buyer",
  "Downsizer",
  "Investor",
] as const;

const BUYER_PROFILES = [
  "Young Family",
  "Couple",
  "Single",
  "Empty Nester",
  "Retiree / Semi-Retired",
  "Investor — Owner Occupier",
  "Investor — Rental",
  "Other",
] as const;

const CURRENT_HOUSING = [
  "Renting",
  "Own Home (with mortgage)",
  "Own Home (outright)",
  "Living with Family",
  "Other",
] as const;

const PURCHASE_TIMELINES = [
  "As soon as possible",
  "Within 3–6 months",
  "6–12 months",
  "12+ months",
  "Just exploring — no timeframe",
] as const;

const FINANCE_STATUSES = [
  "Pre-approved by lender",
  "Currently exploring finance",
  "Cash buyer — no finance needed",
  "Not yet started",
  "Prefer not to say",
] as const;

const HOW_HEARD = [
  "Online search",
  "Social media",
  "Real estate agent",
  "Word of mouth",
  "Drive-by / local signage",
  "News article",
  "Factory2Key website",
  "Other",
] as const;

/** Floor plan image per house type group */
const FLOORPLAN_IMAGE: Record<HouseType, string> = {
  "1A": "/branscombe/floorplan-type1.png",
  "1B": "/branscombe/floorplan-type1.png",
  "2A": "/branscombe/floorplan-type2.png",
  "2B": "/branscombe/floorplan-type2.png",
  "2C": "/branscombe/floorplan-type2.png",
};

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

  // Price preferences per unit
  const [pricePrefs, setPricePrefs] = useState<Record<string, string>>({});

  // Buyer profile fields
  const [suburb, setSuburb] = useState("");
  const [postcode, setPostcode] = useState("");
  const [buyerType, setBuyerType] = useState("");
  const [buyerProfile, setBuyerProfile] = useState("");
  const [currentHousing, setCurrentHousing] = useState("");
  const [purchaseTimeline, setPurchaseTimeline] = useState("");
  const [financeStatus, setFinanceStatus] = useState("");
  const [howHeard, setHowHeard] = useState("");

  // Referrer / agent fields
  const [referrerType, setReferrerType] = useState("");
  const [referrerName, setReferrerName] = useState("");
  const [referrerCompany, setReferrerCompany] = useState("");
  const [referrerContact, setReferrerContact] = useState("");

  // Expanded unit detail panel
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);

  const toggleUnit = (unitId: string) => {
    setSelectedUnits((prev) => {
      if (prev.includes(unitId)) {
        setPricePrefs((p) => {
          const next = { ...p };
          delete next[unitId];
          return next;
        });
        if (expandedUnit === unitId) setExpandedUnit(null);
        return prev.filter((id) => id !== unitId);
      }
      setExpandedUnit(unitId);
      return [...prev, unitId];
    });
  };

  const setPricePref = (unitId: string, range: string) => {
    setPricePrefs((prev) => ({ ...prev, [unitId]: range }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (honeypot) {
      setSuccess(true);
      return;
    }

    if (selectedUnits.length === 0) {
      setError("Please select at least one home on the site map above.");
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
          price_preferences: pricePrefs,
          suburb: suburb.trim() || null,
          postcode: postcode.trim() || null,
          buyer_type: buyerType || null,
          buyer_profile: buyerProfile || null,
          current_housing: currentHousing || null,
          purchase_timeline: purchaseTimeline || null,
          finance_status: financeStatus || null,
          how_heard: howHeard || null,
          referrer_type: referrerType || null,
          referrer_name: referrerName.trim() || null,
          referrer_company: referrerCompany.trim() || null,
          referrer_contact: referrerContact.trim() || null,
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
            {selectedUnits.length} home{selectedUnits.length > 1 ? "s" : ""}
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
  const selectClass = inputClass;
  const sortedUnits = [...selectedUnits].sort(
    (a, b) => parseInt(a.replace("U", "")) - parseInt(b.replace("U", ""))
  );

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
          Click a home on the site plan to select it. Review the floor plan and
          nominate your price range for each house &amp; land package. You can
          select more than one.
        </p>

        <SiteMap selectedUnits={selectedUnits} onToggleUnit={toggleUnit} />

        {/* Selected units summary bar */}
        {selectedUnits.length > 0 && (
          <div className="mt-6 bg-[#1A2744] text-white p-4 flex flex-wrap items-center gap-3">
            <span className="font-ibm-mono text-[0.65rem] tracking-[0.3em] uppercase opacity-60">
              Selected:
            </span>
            {sortedUnits.map((unitId) => {
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

      {/* ===== UNIT DETAIL PANELS WITH PRICE RANGE ===== */}
      {selectedUnits.length > 0 && (
        <div className="mb-12">
          <p className="font-ibm-mono text-[0.65rem] tracking-[0.4em] uppercase text-[#00B5AD] mb-4">
            Your Selected Homes
          </p>
          <h2 className="font-playfair text-[2rem] font-black text-deep-blue leading-tight mb-3">
            Review &amp; Set Your Price Range
          </h2>
          <p className="text-slate font-archivo leading-relaxed mb-6">
            For each selected home, review the floor plan and location, then tell
            us what you&apos;d expect to pay for the complete{" "}
            <strong>house and land package</strong>. This is not a commitment —
            it helps us understand market expectations.
          </p>

          <div className="space-y-4">
            {sortedUnits.map((unitId) => {
              const unit = UNITS.find((u) => u.id === unitId);
              if (!unit) return null;
              const info = HOUSE_TYPE_INFO[unit.type];
              const isExpanded = expandedUnit === unitId;
              const selectedPrice = pricePrefs[unitId] || "";

              return (
                <div
                  key={unitId}
                  className="bg-white border border-black/5 overflow-hidden"
                >
                  {/* Unit header */}
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedUnit(isExpanded ? null : unitId)
                    }
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-off-white/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-[#00B5AD] flex items-center justify-center text-white font-archivo font-bold text-sm">
                        {unitId}
                      </div>
                      <div>
                        <div className="font-archivo font-bold text-deep-blue text-sm">
                          Type {unit.type} — {info.size} home + {info.deck}
                        </div>
                        <div className="font-archivo text-xs text-slate/60">
                          {unit.zone} &middot; {info.beds} bedrooms &middot;
                          House &amp; land package
                          {selectedPrice && (
                            <span className="ml-2 text-[#00B5AD] font-semibold">
                              &middot; {selectedPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <svg
                      className={`w-5 h-5 text-slate/40 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Expanded detail panel */}
                  {isExpanded && (
                    <div className="border-t border-black/5 px-5 py-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Floor plan */}
                        <div>
                          <p className="font-ibm-mono text-[0.6rem] tracking-[0.3em] uppercase text-slate/50 mb-2">
                            Floor Plan — Type {unit.type}
                          </p>
                          <div className="bg-off-white p-2 border border-black/5">
                            <Image
                              src={FLOORPLAN_IMAGE[unit.type]}
                              alt={`Floor plan Type ${unit.type}`}
                              width={500}
                              height={350}
                              className="w-full h-auto"
                            />
                          </div>
                          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                            <div className="bg-off-white py-2">
                              <div className="font-archivo font-bold text-deep-blue text-sm">
                                {info.size}
                              </div>
                              <div className="font-ibm-mono text-[0.55rem] text-slate/50 uppercase">
                                Home
                              </div>
                            </div>
                            <div className="bg-off-white py-2">
                              <div className="font-archivo font-bold text-deep-blue text-sm">
                                {info.deck}
                              </div>
                              <div className="font-ibm-mono text-[0.55rem] text-slate/50 uppercase">
                                Deck
                              </div>
                            </div>
                            <div className="bg-off-white py-2">
                              <div className="font-archivo font-bold text-deep-blue text-sm">
                                {info.beds} Bed
                              </div>
                              <div className="font-ibm-mono text-[0.55rem] text-slate/50 uppercase">
                                Bedrooms
                              </div>
                            </div>
                          </div>
                          <p className="text-[0.65rem] text-slate/40 font-archivo mt-2 italic">
                            Each lot includes the home, deck, landscaping,
                            driveway, and all site works as a turnkey package.
                          </p>
                        </div>

                        {/* Home renders + price selector */}
                        <div>
                          <p className="font-ibm-mono text-[0.6rem] tracking-[0.3em] uppercase text-slate/50 mb-2">
                            Home Exterior — Indicative Renders
                          </p>
                          <div className="grid grid-cols-3 gap-1 mb-4">
                            <Image
                              src="/branscombe/home-exterior-1.png"
                              alt="Home exterior front"
                              width={200}
                              height={140}
                              className="w-full h-auto object-cover"
                            />
                            <Image
                              src="/branscombe/home-exterior-2.png"
                              alt="Home exterior side"
                              width={200}
                              height={140}
                              className="w-full h-auto object-cover"
                            />
                            <Image
                              src="/branscombe/home-exterior-3.png"
                              alt="Home exterior rear"
                              width={200}
                              height={140}
                              className="w-full h-auto object-cover"
                            />
                          </div>

                          {/* Price range selector */}
                          <p className="font-ibm-mono text-[0.6rem] tracking-[0.3em] uppercase text-slate/50 mb-2">
                            House &amp; Land Package — Your Price Expectation
                          </p>
                          <p className="text-xs text-slate/60 font-archivo mb-3">
                            What would you expect to pay for {unitId} as a
                            complete <strong>house and land package</strong>
                            {" "}(Type {unit.type}, {info.size} home + {info.deck} +
                            land + site works)? This is not binding — it helps us
                            gauge market expectations.
                          </p>
                          <div className="grid grid-cols-1 gap-1.5">
                            {PRICE_RANGES.map((range) => (
                              <button
                                key={range}
                                type="button"
                                onClick={() => setPricePref(unitId, range)}
                                className={`px-4 py-2 text-sm font-archivo text-left border transition-all ${
                                  selectedPrice === range
                                    ? "bg-[#00B5AD] text-white border-[#00B5AD] font-semibold"
                                    : "bg-white text-deep-blue border-black/10 hover:border-[#00B5AD]/50 hover:bg-[#00B5AD]/5"
                                }`}
                              >
                                {range}
                                {selectedPrice === range && (
                                  <span className="float-right">&#10003;</span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

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
          commitment is required. The more you tell us, the better we can keep
          you informed with relevant updates.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          {/* ---- SECTION: Contact Details ---- */}
          <div className="border border-black/5 bg-white p-5">
            <p className="font-ibm-mono text-[0.6rem] tracking-[0.3em] uppercase text-[#00B5AD] mb-4">
              Contact Details
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="suburb" className={labelClass}>
                    Current Suburb / Town
                  </label>
                  <input
                    id="suburb"
                    type="text"
                    value={suburb}
                    onChange={(e) => setSuburb(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Claremont, Sandy Bay, Moonah"
                  />
                </div>
                <div>
                  <label htmlFor="postcode" className={labelClass}>
                    Postcode
                  </label>
                  <input
                    id="postcode"
                    type="text"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. 7011"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ---- SECTION: About You ---- */}
          <div className="border border-black/5 bg-white p-5">
            <p className="font-ibm-mono text-[0.6rem] tracking-[0.3em] uppercase text-[#00B5AD] mb-1">
              About You
            </p>
            <p className="text-xs text-slate/50 font-archivo mb-4">
              Help us understand who is interested in Branscombe Estate. All
              fields in this section are optional.
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="buyerType" className={labelClass}>
                    I am a...
                  </label>
                  <select
                    id="buyerType"
                    value={buyerType}
                    onChange={(e) => setBuyerType(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">— Select —</option>
                    {BUYER_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="buyerProfile" className={labelClass}>
                    Best describes my situation
                  </label>
                  <select
                    id="buyerProfile"
                    value={buyerProfile}
                    onChange={(e) => setBuyerProfile(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">— Select —</option>
                    {BUYER_PROFILES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="currentHousing" className={labelClass}>
                    Current living situation
                  </label>
                  <select
                    id="currentHousing"
                    value={currentHousing}
                    onChange={(e) => setCurrentHousing(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">— Select —</option>
                    {CURRENT_HOUSING.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="purchaseTimeline" className={labelClass}>
                    When are you looking to buy?
                  </label>
                  <select
                    id="purchaseTimeline"
                    value={purchaseTimeline}
                    onChange={(e) => setPurchaseTimeline(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">— Select —</option>
                    {PURCHASE_TIMELINES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="financeStatus" className={labelClass}>
                    Finance status
                  </label>
                  <select
                    id="financeStatus"
                    value={financeStatus}
                    onChange={(e) => setFinanceStatus(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">— Select —</option>
                    {FINANCE_STATUSES.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="howHeard" className={labelClass}>
                    How did you hear about us?
                  </label>
                  <select
                    id="howHeard"
                    value={howHeard}
                    onChange={(e) => setHowHeard(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">— Select —</option>
                    {HOW_HEARD.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ---- SECTION: Selected Units + Price Summary ---- */}
          <div>
            <label className={labelClass}>Selected Home(s) *</label>
            <div className="border border-black/10 bg-white font-archivo text-sm">
              {selectedUnits.length > 0 ? (
                <div className="divide-y divide-black/5">
                  {sortedUnits.map((uid) => {
                    const unit = UNITS.find((u) => u.id === uid);
                    return (
                      <div
                        key={uid}
                        className="px-4 py-2 flex items-center justify-between"
                      >
                        <span className="text-deep-blue">
                          <strong>{uid}</strong>
                          {unit && (
                            <span className="text-slate/60 ml-2">
                              Type {unit.type} — House &amp; land
                            </span>
                          )}
                        </span>
                        {pricePrefs[uid] ? (
                          <span className="text-[#00B5AD] font-semibold text-xs">
                            {pricePrefs[uid]}
                          </span>
                        ) : (
                          <span className="text-slate/30 text-xs">
                            No price set
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="px-4 py-2.5 text-slate/40">
                  Select homes on the site plan above
                </div>
              )}
            </div>
          </div>

          {/* ---- SECTION: Referral / Agent ---- */}
          <div className="border border-black/5 bg-white p-5">
            <p className="font-ibm-mono text-[0.6rem] tracking-[0.3em] uppercase text-slate/50 mb-1">
              Optional
            </p>
            <p className="font-archivo font-semibold text-deep-blue text-sm mb-4">
              Were you referred by a real estate agent or other party?
            </p>
            <p className="text-xs text-slate/60 font-archivo mb-4">
              If someone referred you to this project, provide their details
              below so we can log them for any applicable referral arrangements.
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="referrerType" className={labelClass}>
                  Referrer Type
                </label>
                <select
                  id="referrerType"
                  value={referrerType}
                  onChange={(e) => setReferrerType(e.target.value)}
                  className={selectClass}
                >
                  <option value="">— None / Not applicable —</option>
                  {REFERRER_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {referrerType && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="referrerName" className={labelClass}>
                        Referrer Name
                      </label>
                      <input
                        id="referrerName"
                        type="text"
                        value={referrerName}
                        onChange={(e) => setReferrerName(e.target.value)}
                        className={inputClass}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="referrerCompany" className={labelClass}>
                        Agency / Company
                      </label>
                      <input
                        id="referrerCompany"
                        type="text"
                        value={referrerCompany}
                        onChange={(e) => setReferrerCompany(e.target.value)}
                        className={inputClass}
                        placeholder="ABC Real Estate"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="referrerContact" className={labelClass}>
                      Referrer Email or Phone
                    </label>
                    <input
                      id="referrerContact"
                      type="text"
                      value={referrerContact}
                      onChange={(e) => setReferrerContact(e.target.value)}
                      className={inputClass}
                      placeholder="john@abcrealestate.com.au or 0400 000 000"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ---- Notes ---- */}
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
              placeholder="Any questions, preferences, or things you'd like us to know..."
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
              commitment is required or implied. Pricing shown is indicative and
              relates to a complete house and land package.
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
