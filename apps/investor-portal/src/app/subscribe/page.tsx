"use client";

import dynamic from "next/dynamic";

const SubscribeFlow = dynamic(
  () => import("@/components/SubscribeFlow").then((m) => m.SubscribeFlow),
  { ssr: false }
);

export default function SubscribePage() {
  return <SubscribeFlow />;
}
