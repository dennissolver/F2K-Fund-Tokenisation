import { sepolia } from "viem/chains";
import { F2KSubscriptionABI } from "./abis/F2KSubscription";
import { F2KNavAttestationABI } from "./abis/F2KNavAttestation";
import { F2KDistributionABI } from "./abis/F2KDistribution";
import { F2KRedemptionABI } from "./abis/F2KRedemption";
import { F2KMarketplaceABI } from "./abis/F2KMarketplace";
import { ERC20ABI } from "./abis/ERC20";

// Contract addresses — update after deploying to Sepolia
// For now uses placeholder zeros; replace with real addresses after `npx hardhat run scripts/deploy.ts --network sepolia`
const ADDRESSES = {
  token: (process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? "0x0000000000000000000000000000000000000000") as `0x${string}`,
  navAttestation: (process.env.NEXT_PUBLIC_NAV_ADDRESS ?? "0x0000000000000000000000000000000000000000") as `0x${string}`,
  distribution: (process.env.NEXT_PUBLIC_DISTRIBUTION_ADDRESS ?? "0x0000000000000000000000000000000000000000") as `0x${string}`,
  subscription: (process.env.NEXT_PUBLIC_SUBSCRIPTION_ADDRESS ?? "0x0000000000000000000000000000000000000000") as `0x${string}`,
  redemption: (process.env.NEXT_PUBLIC_REDEMPTION_ADDRESS ?? "0x0000000000000000000000000000000000000000") as `0x${string}`,
  marketplace: (process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS ?? "0x0000000000000000000000000000000000000000") as `0x${string}`,
  usdc: (process.env.NEXT_PUBLIC_USDC_ADDRESS ?? "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238") as `0x${string}`,
  identityRegistry: (process.env.NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS ?? "0x0000000000000000000000000000000000000000") as `0x${string}`,
};

export const CONTRACTS = {
  subscription: { address: ADDRESSES.subscription, abi: F2KSubscriptionABI },
  navAttestation: { address: ADDRESSES.navAttestation, abi: F2KNavAttestationABI },
  distribution: { address: ADDRESSES.distribution, abi: F2KDistributionABI },
  redemption: { address: ADDRESSES.redemption, abi: F2KRedemptionABI },
  marketplace: { address: ADDRESSES.marketplace, abi: F2KMarketplaceABI },
  usdc: { address: ADDRESSES.usdc, abi: ERC20ABI },
  token: { address: ADDRESSES.token, abi: ERC20ABI },
} as const;

export const CHAIN = sepolia;
export const EXPLORER_URL = "https://sepolia.etherscan.io";

export function txUrl(hash: string): string {
  return `${EXPLORER_URL}/tx/${hash}`;
}

export function addressUrl(addr: string): string {
  return `${EXPLORER_URL}/address/${addr}`;
}
