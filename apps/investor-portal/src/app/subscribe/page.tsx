"use client";

import { useState, useEffect } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { MIN_INVESTMENT_USDC, TOKEN_SYMBOL } from "@f2k/shared";

export default function SubscribePage() {
  const [amount, setAmount] = useState("");
  const [navPerToken, setNavPerToken] = useState(1.0);
  const [step, setStep] = useState<"input" | "review" | "success">("input");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNav() {
      const supabase = createSupabaseBrowser();
      const { data } = await supabase
        .from("nav_records")
        .select("nav_per_token")
        .eq("status", "published")
        .order("calculated_at", { ascending: false })
        .limit(1)
        .single();
      if (data) setNavPerToken(Number(data.nav_per_token));
    }
    fetchNav();
  }, []);

  const amountNum = parseFloat(amount) || 0;
  const tokensToReceive = amountNum / navPerToken;

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount_usdc: amountNum }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Subscription failed");
      }

      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Subscription failed");
    }

    setLoading(false);
  }

  if (step === "success") {
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <div className="bg-white rounded-xl p-8 shadow-sm border">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">&#10003;</span>
          </div>
          <h2 className="text-xl font-bold text-navy mb-2">
            Subscription Submitted
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Our team will confirm receipt of your USDC and mint your{" "}
            {TOKEN_SYMBOL} tokens.
          </p>
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
    <div className="max-w-lg mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-navy mb-6">Subscribe</h1>

      <div className="bg-white rounded-xl p-6 shadow-sm border">
        {step === "input" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (USDC)
              </label>
              <input
                type="number"
                min={MIN_INVESTMENT_USDC}
                step="1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Min $${MIN_INVESTMENT_USDC.toLocaleString()}`}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-f2k-blue focus:border-transparent outline-none"
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Current NAV</span>
                <span>${navPerToken.toFixed(2)} / token</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tokens to receive</span>
                <span className="font-semibold">
                  {tokensToReceive.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}{" "}
                  {TOKEN_SYMBOL}
                </span>
              </div>
            </div>

            <button
              onClick={() => setStep("review")}
              disabled={amountNum < MIN_INVESTMENT_USDC}
              className="w-full bg-f2k-blue hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              Review Subscription
            </button>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-navy">Review Your Subscription</h3>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Amount</span>
                <span className="font-semibold">
                  ${amountNum.toLocaleString()} USDC
                </span>
              </div>
              <div className="flex justify-between">
                <span>Token Price (NAV)</span>
                <span>${navPerToken.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tokens</span>
                <span className="font-semibold">
                  {tokensToReceive.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}{" "}
                  {TOKEN_SYMBOL}
                </span>
              </div>
            </div>

            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5"
              />
              <span>
                I confirm I am a wholesale investor and understand the risks
                of this investment.
              </span>
            </label>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => setStep("input")}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!termsAccepted || loading}
                className="flex-1 bg-f2k-blue hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Confirm Subscription"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
