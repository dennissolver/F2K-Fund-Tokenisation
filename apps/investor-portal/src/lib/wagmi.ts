import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "F2K Housing Token",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "placeholder",
  chains: [sepolia],
  ssr: true,
});
