"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createSupabaseBrowser();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // Check KYC status to decide redirect
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: investor } = await supabase
        .from("investors")
        .select("kyc_status")
        .eq("auth_user_id", user.id)
        .single();

      if (!investor) {
        // Investor record doesn't exist yet (e.g. email confirmed via Site URL redirect)
        // Create it now
        const meta = user.user_metadata || {};
        await supabase.from("investors").insert({
          auth_user_id: user.id,
          email: user.email!,
          investor_type: meta.investor_type || null,
          net_assets_declared: meta.net_assets_declared || false,
          income_declared: meta.income_declared || false,
        });
        window.location.href = "/onboarding";
      } else if (investor.kyc_status === "approved") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/onboarding";
      }
    }

    setLoading(false);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-sm border p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-navy mb-2">Sign In</h1>
        <p className="text-gray-500 text-sm mb-6">
          Access your F2K Housing Token dashboard.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-f2k-blue focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-f2k-blue focus:border-transparent outline-none"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-f2k-blue hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-f2k-blue hover:underline">
            Apply to invest
          </a>
        </p>
      </div>
    </div>
  );
}
