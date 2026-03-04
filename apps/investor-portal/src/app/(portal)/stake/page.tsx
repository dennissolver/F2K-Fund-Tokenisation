import dynamic from "next/dynamic";

const StakeFlow = dynamic(
  () => import("@/components/StakeFlow").then((mod) => mod.StakeFlow),
  { ssr: false }
);

export default function StakePage() {
  return <StakeFlow />;
}
