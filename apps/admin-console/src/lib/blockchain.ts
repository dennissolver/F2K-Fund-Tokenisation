import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

const ALCHEMY_URL = `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;

export function getPublicClient() {
  return createPublicClient({
    chain: sepolia,
    transport: http(ALCHEMY_URL),
  });
}

export function getWalletClient() {
  const key = process.env.DEPLOYER_PRIVATE_KEY;
  if (!key) throw new Error("DEPLOYER_PRIVATE_KEY not set");

  const account = privateKeyToAccount(key as `0x${string}`);
  return createWalletClient({
    account,
    chain: sepolia,
    transport: http(ALCHEMY_URL),
  });
}

export function getDeployerAccount() {
  const key = process.env.DEPLOYER_PRIVATE_KEY;
  if (!key) throw new Error("DEPLOYER_PRIVATE_KEY not set");
  return privateKeyToAccount(key as `0x${string}`);
}
