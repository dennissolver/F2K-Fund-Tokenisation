"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface RedemptionActionsProps {
  redemptionId: string;
}

export default function RedemptionActions({ redemptionId }: RedemptionActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleAction(action: "approve" | "reject") {
    const reason =
      action === "reject" ? prompt("Reason for rejection (optional):") : undefined;

    setLoading(true);
    try {
      const res = await fetch(`/api/redemptions/${redemptionId}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || `Failed to ${action}`);
        return;
      }

      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-1">
      <button
        onClick={() => handleAction("approve")}
        disabled={loading}
        className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded disabled:opacity-50"
      >
        Approve
      </button>
      <button
        onClick={() => handleAction("reject")}
        disabled={loading}
        className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}
