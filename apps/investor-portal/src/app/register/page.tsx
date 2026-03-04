"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

type EligibilityPath = null | "net_assets" | "income" | "entity";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Eligibility gate
  const [eligibility, setEligibility] = useState<EligibilityPath>(null);
  const [acknowledged, setAcknowledged] = useState(false);

  const eligible = eligibility !== null && acknowledged;

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createSupabaseBrowser();

    const redirectTo = `${window.location.origin}/api/auth/callback`;

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          eligibility_path: eligibility,
          investor_type: eligibility === "income" ? "sophisticated" : "wholesale",
          net_assets_declared: eligibility === "net_assets" || eligibility === "entity",
          income_declared: eligibility === "income",
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      setEmailSent(true);
    }

    setLoading(false);
  }

  // Success state: check your email
  if (emailSent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-navy mb-2">Check Your Email</h1>
            <p className="text-gray-600 mb-4">
              We&apos;ve sent a confirmation link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Click the link in your email to verify your account and continue
              to the onboarding process. The link expires in 24 hours.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
              Don&apos;t see the email? Check your spam folder or{" "}
              <button
                onClick={() => setEmailSent(false)}
                className="text-f2k-blue hover:underline font-medium"
              >
                try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded bg-gold flex items-center justify-center font-bold text-navy text-sm">
              F2K
            </div>
            <span className="text-lg font-semibold text-navy">
              F2K Housing Token
            </span>
          </a>
          <h1 className="text-2xl font-bold text-navy">Apply to Invest</h1>
          <p className="text-gray-500 text-sm mt-1">
            Wholesale investors only — s708 Corporations Act 2001
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-8">
          {/* Step 1: Eligibility */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-navy mb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-navy text-white text-xs flex items-center justify-center">
                1
              </span>
              Confirm Your Eligibility
            </h2>
            <p className="text-xs text-gray-500 mb-4 ml-7">
              Select which criterion you meet under s708 of the Corporations Act
            </p>

            <div className="space-y-2 ml-7">
              <label
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  eligibility === "net_assets"
                    ? "border-f2k-blue bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="eligibility"
                  checked={eligibility === "net_assets"}
                  onChange={() => setEligibility("net_assets")}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Net assets of $2.5 million or more
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Individual or entity net assets (property, shares, super,
                    other assets minus liabilities)
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  eligibility === "income"
                    ? "border-f2k-blue bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="eligibility"
                  checked={eligibility === "income"}
                  onChange={() => setEligibility("income")}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Gross income of $250,000+/year for the last 2 years
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Sophisticated investor classification
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  eligibility === "entity"
                    ? "border-f2k-blue bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="eligibility"
                  checked={eligibility === "entity"}
                  onChange={() => setEligibility("entity")}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Investing via company/trust meeting the above thresholds
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Entity-based wholesale investor classification
                  </p>
                </div>
              </label>
            </div>

            {/* Acknowledgement */}
            {eligibility && (
              <label className="flex items-start gap-3 mt-4 ml-7 p-3 rounded-lg bg-amber-50 border border-amber-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                  className="mt-0.5"
                />
                <p className="text-xs text-gray-700 leading-relaxed">
                  I declare that I meet the selected criteria under Section 708
                  of the Corporations Act 2001 (Cth) and understand that F2K
                  Housing Token is offered exclusively to wholesale/sophisticated
                  investors. I acknowledge this is not financial advice and that
                  I should obtain independent professional advice.
                </p>
              </label>
            )}
          </div>

          {/* Divider */}
          <hr className="my-6 border-gray-100" />

          {/* Step 2: Account creation (only shown when eligible) */}
          <div
            className={
              eligible ? "" : "opacity-40 pointer-events-none select-none"
            }
          >
            <h2 className="text-sm font-semibold text-navy mb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-navy text-white text-xs flex items-center justify-center">
                2
              </span>
              Create Your Account
            </h2>
            <p className="text-xs text-gray-500 mb-4 ml-7">
              You&apos;ll complete full verification (KYC + wallet) after
              confirming your email
            </p>

            <form onSubmit={handleRegister} className="space-y-4 ml-7">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!eligible}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-f2k-blue focus:border-transparent outline-none disabled:bg-gray-50"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={!eligible}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-f2k-blue focus:border-transparent outline-none disabled:bg-gray-50"
                  placeholder="Min 8 characters"
                />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading || !eligible}
                className="w-full bg-f2k-blue hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>
          </div>

          {/* Not eligible notice */}
          {!eligibility && (
            <p className="text-center text-xs text-gray-400 mt-4">
              Please confirm your eligibility above to proceed
            </p>
          )}
        </div>

        {/* Footer links */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-f2k-blue hover:underline">
              Sign in
            </a>
          </p>
          <p className="text-sm text-gray-500">
            Not sure if you qualify?{" "}
            <a href="/invest" className="text-f2k-blue hover:underline">
              Learn about eligibility
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
