"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { CONTRACTS } from "@f2k/shared/contracts";
import { MIN_INVESTMENT_USDC, TOKEN_SYMBOL, USDC_DECIMALS } from "@f2k/shared";

type Step = "input" | "approve" | "subscribe" | "confirm" | "success";

export function SubscribeFlow() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<Step>("input");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [navPerToken, setNavPerToken] = useState(1.0);

  const amountNum = parseFloat(amount) || 0;
  const amountWei = parseUnits(amount || "0", USDC_DECIMALS);
  const tokensToReceive = amountNum / navPerToken;

  // Fetch latest NAV
  useEffect(() => {
    async function fetchNav() {
      const res = await fetch("/api/nav/latest");
      if (res.ok) {
        const data = await res.json();
        if (data.nav_per_token) setNavPerToken(Number(data.nav_per_token));
      }
    }
    fetchNav();
  }, []);

  // Read USDC balance
  const { data: usdcBalance } = useReadContract({
    ...CONTRACTS.usdc,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Read current allowance
  const { data: currentAllowance } = useReadContract({
    ...CONTRACTS.usdc,
    functionName: "allowance",
    args: address ? [address, CONTRACTS.subscription.address] : undefined,
    query: { enabled: !!address },
  });

  // Approve USDC
  const { writeContract: approveUsdc, data: approveTxHash, isPending: isApproving } = useWriteContract();
  const { isSuccess: approveConfirmed } = useWaitForTransactionReceipt({ hash: approveTxHash });

  // Subscribe
  const { writeContract: subscribeTx, data: subscribeTxHash, isPending: isSubscribing } = useWriteContract();
  const { isSuccess: subscribeConfirmed } = useWaitForTransactionReceipt({ hash: subscribeTxHash });

  // Handle approve confirmation
  useEffect(() => {
    if (approveConfirmed && step === "approve") {
      setStep("subscribe");
      // Trigger subscription
      subscribeTx({
        ...CONTRACTS.subscription,
        functionName: "subscribe",
        args: [amountWei],
      });
    }
  }, [approveConfirmed, step, subscribeTx, amountWei]);

  // Handle subscribe confirmation
  useEffect(() => {
    if (subscribeConfirmed && step === "subscribe") {
      setStep("confirm");
      // Store tx_hash in DB
      fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount_usdc: amountNum,
          tx_hash: subscribeTxHash,
        }),
      }).then(() => setStep("success"));
    }
  }, [subscribeConfirmed, step, amountNum, subscribeTxHash]);

  function handleReview() {
    if (amountNum < MIN_INVESTMENT_USDC) {
      setError(`Minimum investment is $${MIN_INVESTMENT_USDC.toLocaleString()} USDC`);
      return;
    }
    if (usdcBalance !== undefined && amountWei > (usdcBalance as bigint)) {
      setError("Insufficient USDC balance");
      return;
    }
    setError(null);
    setStep("approve");

    // Check if already approved enough
    if (currentAllowance !== undefined && (currentAllowance as bigint) >= amountWei) {
      setStep("subscribe");
      subscribeTx({
        ...CONTRACTS.subscription,
        functionName: "subscribe",
        args: [amountWei],
      });
    } else {
      approveUsdc({
        ...CONTRACTS.usdc,
        functionName: "approve",
        args: [CONTRACTS.subscription.address, amountWei],
      });
    }
  }

  if (!isConnected) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
        <p className="text-gray-500 mb-4">Connect your wallet to subscribe.</p>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <div className="bg-white rounded-xl p-8 shadow-sm border">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">&#10003;</span>
          </div>
          <h2 className="text-xl font-bold text-navy mb-2">Subscription Submitted</h2>
          <p className="text-gray-500 text-sm mb-4">
            Your USDC has been sent to the fund treasury. Tokens will be minted after admin confirmation.
          </p>
          {subscribeTxHash && (
            <a
              href={`https://sepolia.etherscan.io/tx/${subscribeTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-f2k-blue text-sm hover:underline block mb-4"
            >
              View transaction on Etherscan
            </a>
          )}
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
      <div className="bg-white rounded-xl p-6 shadow-sm border space-y-4">
        {/* Balance display */}
        {usdcBalance !== undefined && (
          <div className="text-right text-sm text-gray-500">
            Balance: {formatUnits(usdcBalance as bigint, USDC_DECIMALS)} USDC
          </div>
        )}

        {/* Amount input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USDC)</label>
          <input
            type="number"
            min={MIN_INVESTMENT_USDC}
            step="1000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Min $${MIN_INVESTMENT_USDC.toLocaleString()}`}
            disabled={step !== "input"}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-f2k-blue focus:border-transparent outline-none disabled:opacity-50"
          />
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Current NAV</span>
            <span>${navPerToken.toFixed(2)} / token</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tokens to receive</span>
            <span className="font-semibold">
              {tokensToReceive.toLocaleString(undefined, { maximumFractionDigits: 2 })} {TOKEN_SYMBOL}
            </span>
          </div>
        </div>

        {/* Terms */}
        {step === "input" && (
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5"
            />
            <span>I confirm I am a wholesale investor and understand the risks.</span>
          </label>
        )}

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {/* Status messages */}
        {step === "approve" && (
          <div className="text-center py-2">
            <div className="animate-spin h-6 w-6 border-2 border-f2k-blue border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-sm text-gray-600">{isApproving ? "Confirm USDC approval in wallet..." : "Waiting for approval confirmation..."}</p>
          </div>
        )}
        {step === "subscribe" && (
          <div className="text-center py-2">
            <div className="animate-spin h-6 w-6 border-2 border-f2k-blue border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-sm text-gray-600">{isSubscribing ? "Confirm subscription in wallet..." : "Waiting for subscription confirmation..."}</p>
          </div>
        )}
        {step === "confirm" && (
          <div className="text-center py-2">
            <div className="animate-spin h-6 w-6 border-2 border-f2k-blue border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-sm text-gray-600">Saving subscription record...</p>
          </div>
        )}

        {/* Submit button */}
        {step === "input" && (
          <button
            onClick={handleReview}
            disabled={!termsAccepted || amountNum < MIN_INVESTMENT_USDC}
            className="w-full bg-f2k-blue hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            Subscribe with USDC
          </button>
        )}
      </div>
    </div>
  );
}
