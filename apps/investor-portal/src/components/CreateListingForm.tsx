"use client";

import { useState, type FormEvent } from "react";
import { TOKEN_SYMBOL, MARKETPLACE_FEE_BPS } from "@f2k/shared";

interface CreateListingFormProps {
  availableTokens: number;
  navPerToken: number;
}

export default function CreateListingForm({ availableTokens, navPerToken }: CreateListingFormProps) {
  const [tokenAmount, setTokenAmount] = useState("");
  const [pricePerToken, setPricePerToken] = useState(navPerToken.toFixed(2));
  const [expiresInDays, setExpiresInDays] = useState("30");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amount = parseFloat(tokenAmount) || 0;
  const price = parseFloat(pricePerToken) || 0;
  const totalPrice = amount * price;
  const fee = totalPrice * (MARKETPLACE_FEE_BPS / 10000);
  const sellerProceeds = totalPrice - fee;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (amount <= 0 || amount > availableTokens || price <= 0) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/marketplace/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token_amount: amount,
          price_per_token: price,
          expires_in_days: parseInt(expiresInDays) || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create listing");
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
        <h3 className="text-xl font-bold text-navy mb-2">Listing Created</h3>
        <p className="text-gray-600 mb-4">
          Your listing of {amount.toLocaleString()} {TOKEN_SYMBOL} at ${price.toFixed(2)} per token
          is now live on the marketplace.
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setTokenAmount("");
          }}
          className="inline-block bg-f2k-blue hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm transition-colors"
        >
          Create Another Listing
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border">
      <h3 className="text-lg font-bold text-navy mb-4">Create Listing</h3>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Available to List</span>
          <span className="font-semibold">
            {availableTokens.toLocaleString()} {TOKEN_SYMBOL}
          </span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-600">Current NAV</span>
          <span className="font-semibold">${navPerToken.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-600">Platform Fee</span>
          <span className="font-semibold">{(MARKETPLACE_FEE_BPS / 100).toFixed(2)}%</span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tokens to Sell
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price per Token (USDC)
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={pricePerToken}
            onChange={(e) => setPricePerToken(e.target.value)}
            className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-f2k-blue"
            required
          />
          {price !== navPerToken && price > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {price > navPerToken ? "+" : ""}
              {(((price - navPerToken) / navPerToken) * 100).toFixed(1)}% vs current NAV
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Listing Expiry
          </label>
          <select
            value={expiresInDays}
            onChange={(e) => setExpiresInDays(e.target.value)}
            className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-f2k-blue"
          >
            <option value="7">7 days</option>
            <option value="14">14 days</option>
            <option value="30">30 days</option>
            <option value="60">60 days</option>
            <option value="90">90 days</option>
          </select>
        </div>
      </div>

      {amount > 0 && price > 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Total Sale Price</span>
              <span className="font-semibold text-blue-800">
                ${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-600">
                Platform Fee ({(MARKETPLACE_FEE_BPS / 100).toFixed(2)}%)
              </span>
              <span className="text-blue-600">
                -${fee.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between border-t border-blue-200 pt-1">
              <span className="text-blue-700 font-semibold">You Receive</span>
              <span className="font-bold text-blue-800">
                ${sellerProceeds.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDC
              </span>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <button
        type="submit"
        disabled={submitting || amount <= 0 || amount > availableTokens || price <= 0}
        className="w-full bg-f2k-blue hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
      >
        {submitting ? "Creating Listing..." : "List Tokens for Sale"}
      </button>
    </form>
  );
}
