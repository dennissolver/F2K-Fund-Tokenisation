"use client";

import { useState } from "react";

interface CancelListingButtonProps {
  listingId: string;
}

export default function CancelListingButton({ listingId }: CancelListingButtonProps) {
  const [submitting, setSubmitting] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCancel() {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/marketplace/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: listingId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Cancel failed");
      }

      setCancelled(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (cancelled) {
    return <span className="text-gray-500 text-xs">Cancelled</span>;
  }

  return (
    <>
      <button
        onClick={handleCancel}
        disabled={submitting}
        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs rounded transition-colors disabled:opacity-50"
      >
        {submitting ? "..." : "Cancel"}
      </button>
      {error && <span className="text-red-600 text-xs ml-2">{error}</span>}
    </>
  );
}
