"use client";

import { useState } from "react";

export default function StatementsPage() {
  const [quarter, setQuarter] = useState("2024-Q4");
  const [loading, setLoading] = useState(false);

  async function handleDownload(format: "csv" | "pdf") {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/statements?quarter=${quarter}&format=${format}`
      );
      if (!res.ok) throw new Error("Failed to generate statement");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `f2k-statement-${quarter}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to generate statement. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-navy mb-6">Statements</h1>

      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Quarter
          </label>
          <select
            value={quarter}
            onChange={(e) => setQuarter(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-f2k-blue focus:border-transparent outline-none"
          >
            <option value="2025-Q1">2025 Q1</option>
            <option value="2024-Q4">2024 Q4</option>
            <option value="2024-Q3">2024 Q3</option>
            <option value="2024-Q2">2024 Q2</option>
            <option value="2024-Q1">2024 Q1</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleDownload("csv")}
            disabled={loading}
            className="flex-1 bg-f2k-blue hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            Download CSV
          </button>
          <button
            onClick={() => handleDownload("pdf")}
            disabled={loading}
            className="flex-1 border border-f2k-blue text-f2k-blue py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
