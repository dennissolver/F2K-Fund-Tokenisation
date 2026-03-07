"use client";

import { useState, type FormEvent } from "react";
import { TOKEN_SYMBOL, REDEMPTION_NOTICE_DAYS } from "@f2k/shared";

interface RedeemFlowProps {
  availableTokens: number;
  navPerToken: number;
}

export default function RedeemFlow({ availableTokens, navPerToken }: RedeemFlowProps) {
  const [tokenAmount, setTokenAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amount = parseFloat(tokenAmount) || 0;
  const estimatedUsdc = amount * navPerToken;

  const noticePeriodEnd = new Date();
  noticePeriodEnd.setDate(noticePeriodEnd.getDate() + REDEMPTION_NOTICE_DAYS);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (amount <= 0 || amount > availableTokens) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token_amount: amount }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Redemption request failed");
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
      <div className="bg-white rounded-xl p-8 shadow-sm border text-center">
        <div className="text-green-600 text-4xl mb-4">&#10003;</div>
        <h3 className="text-xl font-bold text-navy mb-2">Redemption Request Submitted</h3>
        <p className="text-gray-600 mb-2">
          Your request to redeem {amount.toLocaleString()} {TOKEN_SYMBOL} has been submitted.
        </p>
        <p className="text-gray-500 text-sm">
          The {REDEMPTION_NOTICE_DAYS}-day notice period ends on{" "}
          <strong>{noticePeriodEnd.toLocaleDateString()}</strong>. You will receive approximately{" "}
          <strong>${estimatedUsdc.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong> USDC
          at the NAV on the processing date.
        </p>
        <a
          href="/dashboard"
          className="inline-block mt-4 bg-f2k-blue hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm transition-colors"
        >
          Back to Dashboard
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border">
      <h3 className="text-lg font-bold text-navy mb-4">Request Redemption</h3>

      {/* Notice period warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-amber-800">
          <strong>Notice period:</strong> Redemption requests are subject to a{" "}
          {REDEMPTION_NOTICE_DAYS}-day notice period. Your tokens will be held in escrow during
          this period. The final USDC payout will be calculated at the NAV on the processing date,
          which may differ from today&apos;s estimate.
        </p>
      </div>

      {/* Available balance */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Available to Redeem</span>
          <span className="font-semibold">
            {availableTokens.toLocaleString()} {TOKEN_SYMBOL}
          </span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-600">Current NAV per Token</span>
          <span className="font-semibold">${navPerToken.toFixed(2)}</span>
        </div>
      </div>

      {/* Token amount input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tokens to Redeem
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            step="any"
            min="0"
            max={availableTokens}
            value={tokenAmount}
            onChange={(e) => setTokenAmount(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-f2k-blue"
            placeholder={`Max ${availableTokens.toLocaleString()}`}
            required
          />
          <button
            type="button"
            onClick={() => setTokenAmount(availableTokens.toString())}
            className="px-4 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
          >
            MAX
          </button>
        </div>
      </div>

      {/* Estimated payout */}
      {amount > 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-blue-700">Estimated USDC Payout</span>
            <span className="font-bold text-blue-800">
              ${estimatedUsdc.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            Based on current NAV. Final amount calculated at processing date.
          </p>
        </div>
      )}

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <button
        type="submit"
        disabled={submitting || amount <= 0 || amount > availableTokens}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Request Redemption"}
      </button>
    </form>
  );
}
