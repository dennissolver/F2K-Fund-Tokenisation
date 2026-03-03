"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { useAccount, useSignMessage } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

type Step = "eligibility" | "details" | "kyc" | "wallet" | "complete";

const STEPS: Step[] = ["eligibility", "details", "kyc", "wallet", "complete"];

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><p>Loading...</p></div>}>
      <OnboardingContent />
    </Suspense>
  );
}

function OnboardingContent() {
  const searchParams = useSearchParams();
  const currentStep = (searchParams.get("step") as Step) || "eligibility";
  const stepIndex = STEPS.indexOf(currentStep);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="bg-white rounded-xl shadow-sm border p-8 w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-2 flex-1">
              <div
                className={`h-2 flex-1 rounded-full ${
                  i <= stepIndex ? "bg-f2k-blue" : "bg-gray-200"
                }`}
              />
            </div>
          ))}
        </div>

        {currentStep === "eligibility" && <EligibilityStep />}
        {currentStep === "details" && <DetailsStep />}
        {currentStep === "kyc" && <KYCStep />}
        {currentStep === "wallet" && <WalletStep />}
        {currentStep === "complete" && <CompleteStep />}
      </div>
    </div>
  );
}

function EligibilityStep() {
  const [netAssets, setNetAssets] = useState(false);
  const [income, setIncome] = useState(false);
  const [entity, setEntity] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canProceed = netAssets || income || entity;

  async function handleNext() {
    setLoading(true);
    setError(null);

    const supabase = createSupabaseBrowser();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const investorType = netAssets || entity ? "wholesale" : "sophisticated";

    const { error: updateError } = await supabase
      .from("investors")
      .update({
        investor_type: investorType,
        net_assets_declared: netAssets || entity,
        income_declared: income,
      })
      .eq("auth_user_id", user.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    window.location.href = "/onboarding?step=details";
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-navy mb-2">
        Investor Eligibility
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Under s708 of the Corporations Act, you must qualify as a wholesale or
        sophisticated investor.
      </p>

      <div className="space-y-3 mb-6">
        <label className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            type="checkbox"
            checked={netAssets}
            onChange={(e) => setNetAssets(e.target.checked)}
            className="mt-0.5"
          />
          <span className="text-sm">
            I have net assets of at least <strong>$2.5 million</strong>{" "}
            (wholesale)
          </span>
        </label>
        <label className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            type="checkbox"
            checked={income}
            onChange={(e) => setIncome(e.target.checked)}
            className="mt-0.5"
          />
          <span className="text-sm">
            I have gross income of at least <strong>$250,000/year</strong> for
            each of the last 2 years (sophisticated)
          </span>
        </label>
        <label className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            type="checkbox"
            checked={entity}
            onChange={(e) => setEntity(e.target.checked)}
            className="mt-0.5"
          />
          <span className="text-sm">
            I am investing through a <strong>company/trust</strong> that meets
            the above criteria
          </span>
        </label>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <button
        onClick={handleNext}
        disabled={!canProceed || loading}
        className="w-full bg-f2k-blue hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50"
      >
        {loading ? "Saving..." : "Continue"}
      </button>
    </div>
  );
}

function DetailsStep() {
  const [fullName, setFullName] = useState("");
  const [entityName, setEntityName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleNext() {
    if (!fullName.trim()) return;
    setLoading(true);
    setError(null);

    const supabase = createSupabaseBrowser();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { error: updateError } = await supabase
      .from("investors")
      .update({
        full_name: fullName,
        entity_name: entityName || null,
        country_code: "AU",
      })
      .eq("auth_user_id", user.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    window.location.href = "/onboarding?step=kyc";
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-navy mb-2">Personal Details</h2>
      <p className="text-gray-500 text-sm mb-6">
        Provide your details for regulatory compliance.
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-f2k-blue focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Entity Name (if investing via company/trust)
          </label>
          <input
            type="text"
            value={entityName}
            onChange={(e) => setEntityName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-f2k-blue focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <select
            disabled
            className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-600"
          >
            <option>Australia</option>
          </select>
          <p className="text-xs text-gray-400 mt-1">
            MVP restricted to Australian investors.
          </p>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <button
        onClick={handleNext}
        disabled={!fullName.trim() || loading}
        className="w-full bg-f2k-blue hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50"
      >
        {loading ? "Saving..." : "Continue"}
      </button>
    </div>
  );
}

function KYCStep() {
  const [status, setStatus] = useState<string>("not_started");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchStatus() {
      const supabase = createSupabaseBrowser();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("investors")
          .select("kyc_status")
          .eq("auth_user_id", user.id)
          .single();
        if (data) setStatus(data.kyc_status);
      }
    }
    fetchStatus();
  }, []);

  async function simulateApproval() {
    setLoading(true);
    const supabase = createSupabaseBrowser();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("investors")
      .update({
        kyc_status: "approved",
        kyc_completed_at: new Date().toISOString(),
      })
      .eq("auth_user_id", user.id);

    setStatus("approved");
    setLoading(false);
  }

  if (status === "approved") {
    return (
      <div>
        <h2 className="text-xl font-bold text-navy mb-2">KYC Verification</h2>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 font-medium">KYC Approved</p>
          <p className="text-green-600 text-sm">
            Your identity has been verified.
          </p>
        </div>
        <a
          href="/onboarding?step=wallet"
          className="block w-full bg-f2k-blue hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition-colors text-center"
        >
          Continue
        </a>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-navy mb-2">KYC Verification</h2>
      <p className="text-gray-500 text-sm mb-6">
        Complete identity verification to proceed. In production, this embeds
        the Sumsub KYC widget.
      </p>

      {status === "pending" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 font-medium">KYC Pending</p>
          <p className="text-yellow-600 text-sm">
            Your verification is being reviewed.
          </p>
        </div>
      )}

      {status === "rejected" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-medium">KYC Rejected</p>
          <p className="text-red-600 text-sm">
            Please contact support for assistance.
          </p>
        </div>
      )}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center">
        <p className="text-gray-400 text-sm mb-2">
          Sumsub KYC Widget (Sandbox)
        </p>
        <p className="text-gray-300 text-xs">
          Will embed iframe in production
        </p>
      </div>

      <button
        onClick={simulateApproval}
        disabled={loading}
        className="w-full bg-gold hover:bg-gold-light text-navy py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50"
      >
        {loading ? "Simulating..." : "Simulate KYC Approval (Dev)"}
      </button>
    </div>
  );
}

function WalletStep() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function verifyWallet() {
    if (!address) return;
    setLoading(true);
    setError(null);

    try {
      const supabase = createSupabaseBrowser();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const timestamp = new Date().toISOString();
      const message = `I am connecting wallet ${address} to my F2K investor account ${user.email} at ${timestamp}`;

      const signature = await signMessageAsync({ message });

      const res = await fetch("/api/wallet/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet_address: address,
          message,
          signature,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Verification failed");
      }

      setVerified(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    }

    setLoading(false);
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-navy mb-2">Connect Wallet</h2>
      <p className="text-gray-500 text-sm mb-6">
        Connect your Ethereum wallet on Sepolia testnet and verify ownership.
      </p>

      <div className="mb-6 flex justify-center">
        <ConnectButton />
      </div>

      {isConnected && !verified && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            Connected: <code className="text-xs">{address}</code>
          </p>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            onClick={verifyWallet}
            disabled={loading}
            className="w-full bg-f2k-blue hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Sign Message to Verify"}
          </button>
        </div>
      )}

      {verified && (
        <div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-medium">Wallet Verified</p>
          </div>
          <a
            href="/onboarding?step=complete"
            className="block w-full bg-f2k-blue hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition-colors text-center"
          >
            Continue
          </a>
        </div>
      )}
    </div>
  );
}

function CompleteStep() {
  return (
    <div className="text-center">
      <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-green-600 text-2xl">&#10003;</span>
      </div>
      <h2 className="text-xl font-bold text-navy mb-2">You&apos;re All Set!</h2>
      <p className="text-gray-500 text-sm mb-6">
        Your account is ready. You can now view your dashboard and subscribe to
        F2K Housing Tokens.
      </p>
      <a
        href="/dashboard"
        className="inline-block bg-f2k-blue hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-semibold transition-colors"
      >
        Go to Dashboard
      </a>
    </div>
  );
}
