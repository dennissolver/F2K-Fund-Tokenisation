"use client";

import { useState } from "react";

interface MarketplaceBuyButtonProps {
  listingId: string;
  tokenAmount: number;
  totalPriceUsdc: number;
  tokenSymbol: string;
}

export default function MarketplaceBuyButton({
  listingId,
  tokenAmount,
  totalPriceUsdc,
  tokenSymbol,
}: MarketplaceBuyButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy() {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/marketplace/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: listingId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Purchase failed");
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
      <span className="text-green-600 text-xs font-semibold">Purchased</span>
    );
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <div className="text-xs text-gray-600">
          Buy {tokenAmount.toLocaleString()} {tokenSymbol} for $
          {totalPriceUsdc.toLocaleString(undefined, { minimumFractionDigits: 2 })}?
        </div>
        <button
          onClick={handleBuy}
          disabled={submitting}
          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors disabled:opacity-50"
        >
          {submitting ? "..." : "Confirm"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs rounded transition-colors"
        >
          Cancel
        </button>
        {error && <span className="text-red-600 text-xs">{error}</span>}
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="px-4 py-1.5 bg-f2k-blue hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
    >
      Buy
    </button>
  );
}
