"use client";

import { useState, useEffect } from "react";
import { TOKEN_SYMBOL } from "@f2k/shared";
import type { AssetClass } from "@f2k/shared";

type Step = "select" | "details" | "review" | "submit" | "success";

interface StakeResult {
  id: string;
  declared_value: number;
  status: string;
}

export function StakeFlow() {
  const [step, setStep] = useState<Step>("select");
  const [classes, setClasses] = useState<AssetClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<AssetClass | null>(null);
  const [description, setDescription] = useState("");
  const [declaredValue, setDeclaredValue] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [navPerToken, setNavPerToken] = useState(1.0);
  const [stakeResult, setStakeResult] = useState<StakeResult | null>(null);

  const valueNum = parseFloat(declaredValue) || 0;
  const ltvRatio = selectedClass?.ltv_ratio ?? 0;
  const collateralValue = valueNum * ltvRatio;
  const estimatedTokens = collateralValue / navPerToken;

  // Fetch asset classes and NAV
  useEffect(() => {
    async function fetchData() {
      const [classRes, navRes] = await Promise.all([
        fetch("/api/asset-classes"),
        fetch("/api/nav/latest"),
      ]);
      if (classRes.ok) {
        const data = await classRes.json();
        setClasses(data.classes || []);
      }
      if (navRes.ok) {
        const data = await navRes.json();
        if (data.nav_per_token) setNavPerToken(Number(data.nav_per_token));
      }
    }
    fetchData();
  }, []);

  async function handleCreateAndUpload() {
    if (!selectedClass) return;
    setError(null);
    setSubmitting(true);

    try {
      // Create stake
      const res = await fetch("/api/stake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asset_class_id: selectedClass.id,
          description,
          declared_value: valueNum,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create stake");
      }

      const { stake } = await res.json();

      // Upload files
      if (files.length > 0) {
        setUploading(true);
        for (const file of files) {
          const formData = new FormData();
          formData.append("file", file);
          const uploadRes = await fetch(`/api/stake/${stake.id}/upload`, {
            method: "POST",
            body: formData,
          });
          if (!uploadRes.ok) {
            const data = await uploadRes.json();
            throw new Error(data.error || "Failed to upload document");
          }
        }
        setUploading(false);
      }

      // Submit the stake
      const submitRes = await fetch(`/api/stake/${stake.id}/submit`, {
        method: "POST",
      });

      if (!submitRes.ok) {
        const data = await submitRes.json();
        throw new Error(data.error || "Failed to submit stake");
      }

      setStakeResult(stake);
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  }

  if (step === "success") {
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <div className="bg-white rounded-xl p-8 shadow-sm border">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">&#10003;</span>
          </div>
          <h2 className="text-xl font-bold text-navy mb-2">Stake Submitted</h2>
          <p className="text-gray-500 text-sm mb-2">
            Your {selectedClass?.label} stake of ${valueNum.toLocaleString()} has been submitted for review.
          </p>
          <p className="text-gray-400 text-xs mb-6">
            The Contributions Committee will review your submission and appraise the asset.
            Once approved and a lien is registered, {TOKEN_SYMBOL} tokens will be minted to your account.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated LTV</span>
              <span>{(ltvRatio * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Collateral Value</span>
              <span>${collateralValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Tokens</span>
              <span className="font-semibold">{estimatedTokens.toLocaleString(undefined, { maximumFractionDigits: 2 })} {TOKEN_SYMBOL}</span>
            </div>
          </div>
          <a
            href="/dashboard"
            className="inline-block bg-f2k-blue hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-semibold transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-navy mb-2">Stake Assets for {TOKEN_SYMBOL}</h1>
      <p className="text-gray-500 text-sm mb-6">
        Stake eligible real-world assets as collateral to receive {TOKEN_SYMBOL} tokens.
        Each asset class has a loan-to-value ratio that determines your token allocation.
        The fund registers a legal lien over your asset &mdash; your contribution helps build
        Australia&apos;s housing future.
      </p>

      {/* Progress steps */}
      <div className="flex items-center gap-2 mb-8 text-xs">
        {(["select", "details", "review"] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            {i > 0 && <div className="w-8 h-px bg-gray-300" />}
            <div
              className={`px-3 py-1 rounded-full font-medium ${
                step === s
                  ? "bg-f2k-blue text-white"
                  : ["select", "details", "review"].indexOf(step) > i
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {s === "select" ? "1. Asset Class" : s === "details" ? "2. Details" : "3. Review"}
            </div>
          </div>
        ))}
      </div>

      {/* Step 1: Select asset class */}
      {step === "select" && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-navy mb-1">Select Asset Class</h2>
          <p className="text-sm text-gray-500 mb-4">
            All non-crypto/fiat contributions require Contributions Committee approval.
            Haircuts provide a fire-sale buffer protecting the fund.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {classes.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedClass(c);
                  setStep("details");
                }}
                className="bg-white rounded-xl p-5 shadow-sm border hover:border-f2k-blue hover:shadow-md transition-all text-left"
              >
                <div className="font-semibold text-navy mb-1">{c.label}</div>
                <div className="text-sm text-gray-500 mb-3">
                  Min. ${Number(c.min_value_usd).toLocaleString()}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">LTV Ratio</span>
                  <span className="text-lg font-bold text-f2k-blue">
                    {(Number(c.ltv_ratio) * 100).toFixed(0)}%
                  </span>
                </div>
                {c.requires_appraisal && (
                  <div className="mt-2 text-xs text-amber-600">Requires independent appraisal</div>
                )}
              </button>
            ))}
          </div>
          {classes.length === 0 && (
            <p className="text-gray-400 text-sm">Loading asset classes...</p>
          )}
        </div>
      )}

      {/* Step 2: Enter details */}
      {step === "details" && selectedClass && (
        <div className="bg-white rounded-xl p-6 shadow-sm border space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-navy">
              {selectedClass.label} — Details
            </h2>
            <button
              onClick={() => setStep("select")}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Change
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Asset Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder={
                selectedClass.code === "art"
                  ? "e.g. Original oil painting by [Artist], 2021, 120x80cm, with gallery provenance"
                  : selectedClass.code === "property"
                  ? "e.g. 3-bedroom house at [address], freehold title, current valuation by [valuer]"
                  : selectedClass.code === "bonds"
                  ? "e.g. Australian Government Bond, maturity 2030, face value $X"
                  : "e.g. AUD term deposit at [institution], maturity [date]"
              }
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-f2k-blue focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Declared Value (USD)
            </label>
            <input
              type="number"
              min={Number(selectedClass.min_value_usd)}
              step="1000"
              value={declaredValue}
              onChange={(e) => setDeclaredValue(e.target.value)}
              placeholder={`Min $${Number(selectedClass.min_value_usd).toLocaleString()}`}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-f2k-blue focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supporting Documents
            </label>
            <p className="text-xs text-gray-400 mb-2">
              Required: {selectedClass.required_documents.map((d) => d.replace(/_/g, " ")).join(", ")}
            </p>
            <input
              type="file"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
            {files.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">{files.length} file(s) selected</p>
            )}
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            onClick={() => {
              if (description.length < 10) {
                setError("Please provide a more detailed description (at least 10 characters)");
                return;
              }
              if (valueNum < Number(selectedClass.min_value_usd)) {
                setError(`Minimum value for ${selectedClass.label} is $${Number(selectedClass.min_value_usd).toLocaleString()}`);
                return;
              }
              setError(null);
              setStep("review");
            }}
            className="w-full bg-f2k-blue hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition-colors"
          >
            Review Stake
          </button>
        </div>
      )}

      {/* Step 3: Review */}
      {step === "review" && selectedClass && (
        <div className="bg-white rounded-xl p-6 shadow-sm border space-y-4">
          <h2 className="text-lg font-semibold text-navy mb-2">Review Your Stake</h2>

          <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Asset Class</span>
              <span className="font-medium">{selectedClass.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Description</span>
              <span className="font-medium text-right max-w-[60%]">{description}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Declared Value</span>
              <span className="font-medium">${valueNum.toLocaleString()}</span>
            </div>
            <hr />
            <div className="flex justify-between">
              <span className="text-gray-600">LTV Ratio</span>
              <span className="font-semibold text-f2k-blue">{(ltvRatio * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Collateral Value</span>
              <span className="font-semibold">${collateralValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Current NAV</span>
              <span>${navPerToken.toFixed(2)} / token</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Tokens</span>
              <span className="font-bold text-navy">
                {estimatedTokens.toLocaleString(undefined, { maximumFractionDigits: 2 })} {TOKEN_SYMBOL}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Documents</span>
              <span>{files.length} file(s)</span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
            <strong>Important:</strong> By submitting, you authorise the fund to register a legal lien
            over the declared asset. Final token allocation is based on the appraised value (not declared value)
            and the LTV ratio at time of minting. The Contributions Committee must approve all non-crypto/fiat
            contributions.
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={() => setStep("details")}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleCreateAndUpload}
              disabled={submitting}
              className="flex-1 bg-f2k-blue hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {submitting
                ? uploading
                  ? "Uploading documents..."
                  : "Submitting..."
                : "Submit Stake"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
