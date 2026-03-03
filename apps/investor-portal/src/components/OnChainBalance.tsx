"use client";

import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { CONTRACTS } from "@f2k/shared/contracts";
import { TOKEN_SYMBOL, TOKEN_DECIMALS, USDC_DECIMALS } from "@f2k/shared";

export function OnChainBalance() {
  const { address, isConnected } = useAccount();

  const { data: tokenBalance } = useReadContract({
    ...CONTRACTS.token,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: usdcBalance } = useReadContract({
    ...CONTRACTS.usdc,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  if (!isConnected) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <h3 className="text-sm font-medium text-gray-500 mb-4">On-Chain Balances</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">{TOKEN_SYMBOL}</span>
          <span className="font-semibold">
            {tokenBalance !== undefined
              ? formatUnits(tokenBalance as bigint, TOKEN_DECIMALS)
              : "—"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">USDC</span>
          <span className="font-semibold">
            {usdcBalance !== undefined
              ? formatUnits(usdcBalance as bigint, USDC_DECIMALS)
              : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
