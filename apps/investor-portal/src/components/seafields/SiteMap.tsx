"use client";

import { useState, useEffect, useCallback } from "react";
import { LOTS, CATEGORY_INFO, type LotData } from "@/lib/seafields-lots";

interface LotCounts {
  [lotId: string]: number;
}

interface SiteMapProps {
  selectedLots: string[];
  onToggleLot: (lotId: string) => void;
}

/**
 * Percentage-based (x%, y%) positions for each lot hotspot
 * overlaid on the Seafields subdivision plan image.
 * Coordinates represent the centre of each lot on the full image.
 */
const LOT_POSITIONS: Record<string, { x: number; y: number }> = {
  // ── Collins Road North (top strip, left to right) ──
  L1:  { x: 38, y: 12 },
  L2:  { x: 42, y: 12 },
  L3:  { x: 46, y: 11 },
  L4:  { x: 50, y: 10 },
  L5:  { x: 54, y: 10 },
  L6:  { x: 58, y: 10 },
  L7:  { x: 62, y: 10 },
  L8:  { x: 66, y: 10 },

  // ── North Internal (below Collins Road) ──
  L9:  { x: 38, y: 18 },
  L10: { x: 42, y: 18 },
  L11: { x: 46, y: 17 },
  L12: { x: 50, y: 17 },
  L13: { x: 54, y: 16 },
  L14: { x: 58, y: 16 },
  L15: { x: 62, y: 16 },
  L16: { x: 66, y: 15 },
  L17: { x: 70, y: 14 },
  L18: { x: 74, y: 13 },
  L19: { x: 78, y: 12 },
  L20: { x: 82, y: 11 },

  // ── Central North ──
  L21: { x: 38, y: 24 },
  L22: { x: 42, y: 24 },
  L23: { x: 46, y: 23 },
  L24: { x: 50, y: 23 },
  L25: { x: 54, y: 22 },
  L26: { x: 58, y: 22 },
  L27: { x: 62, y: 22 },
  L28: { x: 66, y: 21 },
  L29: { x: 70, y: 20 },
  L30: { x: 74, y: 19 },
  L31: { x: 78, y: 18 },
  L32: { x: 82, y: 17 },
  L33: { x: 86, y: 16 },
  L34: { x: 42, y: 28 },
  L35: { x: 46, y: 28 },

  // ── Central (around POS) ──
  L36: { x: 50, y: 28 },
  L37: { x: 54, y: 28 },
  L38: { x: 58, y: 28 },
  L39: { x: 50, y: 33 },
  L40: { x: 54, y: 33 },
  L41: { x: 58, y: 33 },
  L42: { x: 50, y: 38 },
  L43: { x: 54, y: 38 },
  L44: { x: 58, y: 38 },
  L45: { x: 75, y: 28 },
  L46: { x: 79, y: 28 },
  L47: { x: 75, y: 33 },
  L48: { x: 79, y: 33 },
  L49: { x: 75, y: 38 },
  L50: { x: 79, y: 38 },

  // ── Central South ──
  L51: { x: 42, y: 42 },
  L52: { x: 46, y: 42 },
  L53: { x: 50, y: 42 },
  L54: { x: 54, y: 42 },
  L55: { x: 58, y: 42 },
  L56: { x: 62, y: 42 },
  L57: { x: 42, y: 47 },
  L58: { x: 46, y: 47 },
  L59: { x: 50, y: 47 },
  L60: { x: 54, y: 47 },

  // ── South Internal ──
  L61: { x: 58, y: 47 },
  L62: { x: 62, y: 47 },
  L63: { x: 66, y: 47 },
  L64: { x: 70, y: 47 },
  L65: { x: 74, y: 47 },
  L66: { x: 78, y: 47 },
  L67: { x: 42, y: 52 },
  L68: { x: 46, y: 52 },
  L69: { x: 50, y: 52 },
  L70: { x: 54, y: 52 },

  // ── South Central (near Half Moon / Pepper Gate) ──
  L85: { x: 58, y: 66 },
  L86: { x: 62, y: 66 },
  L87: { x: 66, y: 66 },
  L88: { x: 70, y: 66 },
  L89: { x: 74, y: 66 },
  L90: { x: 78, y: 66 },
  L91: { x: 72, y: 70 },
  L92: { x: 76, y: 70 },
  L111: { x: 68, y: 72 },

  // ── David Road Cluster (west section) ──
  L71: { x: 10, y: 50 },
  L72: { x: 14, y: 50 },
  L73: { x: 18, y: 50 },
  L74: { x: 22, y: 50 },
  L75: { x: 10, y: 55 },
  L76: { x: 14, y: 55 },
  L77: { x: 18, y: 55 },
  L78: { x: 22, y: 55 },
  L79: { x: 26, y: 53 },
  L80: { x: 30, y: 53 },
  L93: { x: 10, y: 60 },
  L94: { x: 14, y: 60 },
  L95: { x: 18, y: 60 },
  L96: { x: 22, y: 60 },
  L97: { x: 10, y: 65 },
  L98: { x: 14, y: 65 },
  L99: { x: 18, y: 65 },
  L100: { x: 22, y: 65 },
  L105: { x: 26, y: 58 },
  L110: { x: 30, y: 58 },
  L442: { x: 18, y: 78 },

  // ── Pepper Gate (south-east, right to left) ──
  L201: { x: 74, y: 74 },
  L202: { x: 71, y: 74 },
  L203: { x: 68, y: 74 },
  L204: { x: 65, y: 74 },
  L205: { x: 62, y: 74 },
  L206: { x: 59, y: 74 },
  L207: { x: 76, y: 70 },
  L208: { x: 73, y: 70 },

  // ── Pead Fairway (horizontal road, center-south) ──
  L209: { x: 56, y: 58 },
  L210: { x: 60, y: 57 },
  L211: { x: 64, y: 56 },
  L212: { x: 68, y: 55 },
  L213: { x: 72, y: 55 },
  L214: { x: 60, y: 62 },
  L215: { x: 64, y: 61 },
  L216: { x: 68, y: 60 },
  L217: { x: 72, y: 60 },
  L218: { x: 76, y: 59 },

  // ── Pirrotta Link (vertical, SE) ──
  L219: { x: 82, y: 68 },
  L220: { x: 82, y: 64 },
  L221: { x: 82, y: 60 },
  L222: { x: 82, y: 56 },

  // ── Sutcliffe Road North (east edge, top to bottom) ──
  L225: { x: 90, y: 20 },
  L226: { x: 90, y: 25 },
  L227: { x: 90, y: 30 },
  L228: { x: 90, y: 35 },
  L229: { x: 90, y: 40 },
  L230: { x: 90, y: 45 },
  L231: { x: 90, y: 50 },
  L232: { x: 90, y: 55 },
  L233: { x: 90, y: 60 },
  L234: { x: 86, y: 68 },

  // ── Half Moon Drive (bottom strip) ──
  L426: { x: 36, y: 78 },
  L427: { x: 40, y: 78 },
  L428: { x: 44, y: 78 },
  L429: { x: 48, y: 78 },
  L430: { x: 52, y: 78 },
  L431: { x: 56, y: 78 },
  L432: { x: 52, y: 83 },
  L433: { x: 48, y: 83 },
  L434: { x: 44, y: 83 },
};

function getStatusColor(count: number, isSelected: boolean): string {
  if (isSelected) return "rgba(26, 39, 68, 0.92)";
  if (count >= 3) return "rgba(232, 93, 74, 0.88)";
  if (count >= 2) return "rgba(200, 169, 81, 0.88)";
  if (count === 1) return "rgba(232, 165, 55, 0.88)";
  return "rgba(0, 181, 173, 0.85)";
}

function getBorderColor(count: number, isSelected: boolean): string {
  if (isSelected) return "#FFFFFF";
  if (count >= 3) return "#C0392B";
  if (count >= 2) return "#B8941A";
  if (count === 1) return "#CC8A1E";
  return "#009E97";
}

export default function SiteMap({ selectedLots, onToggleLot }: SiteMapProps) {
  const [counts, setCounts] = useState<LotCounts>({});
  const [hoveredLot, setHoveredLot] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const fetchCounts = useCallback(async () => {
    try {
      const res = await fetch("/api/seafields/lots");
      if (res.ok) {
        const data = await res.json();
        setCounts(data.counts || {});
      }
    } catch {
      // silently fail
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  const hoveredData = hoveredLot
    ? LOTS.find((l) => l.id === hoveredLot)
    : null;

  return (
    <div className="w-full">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm font-archivo">
        {[
          { color: "rgba(0,181,173,0.85)", border: "#009E97", label: "Available" },
          { color: "rgba(232,165,55,0.88)", border: "#CC8A1E", label: "1 registration" },
          { color: "rgba(200,169,81,0.88)", border: "#B8941A", label: "2 registrations" },
          { color: "rgba(232,93,74,0.88)", border: "#C0392B", label: "3+ registrations" },
          { color: "rgba(26,39,68,0.92)", border: "#FFFFFF", label: "Your selection" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-sm border-2"
              style={{ backgroundColor: item.color, borderColor: item.border }}
            />
            <span className="text-slate text-xs">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Lot size categories */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs font-archivo">
        {(["compact", "standard", "large", "premium"] as const).map((cat) => (
          <span key={cat} className="bg-white border border-black/5 px-2 py-1 text-slate/70">
            {CATEGORY_INFO[cat].label}: {CATEGORY_INFO[cat].size}
          </span>
        ))}
      </div>

      {/* Interactive site plan */}
      <div className="relative w-full overflow-x-auto border border-black/10 bg-white">
        <div className="relative" style={{ minWidth: "1000px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/seafields/site-plan.jpg"
            alt="Seafields Estate subdivision plan — 141 residential lots"
            className="w-full h-auto block"
            draggable={false}
          />

          {/* Clickable lot hotspots */}
          {LOTS.map((lot) => {
            const pos = LOT_POSITIONS[lot.id];
            if (!pos) return null;

            const count = counts[lot.id] || 0;
            const isSelected = selectedLots.includes(lot.id);
            const isHovered = hoveredLot === lot.id;
            const bg = getStatusColor(count, isSelected);
            const border = getBorderColor(count, isSelected);

            return (
              <button
                key={lot.id}
                type="button"
                onClick={() => onToggleLot(lot.id)}
                onMouseEnter={() => setHoveredLot(lot.id)}
                onMouseLeave={() => setHoveredLot(null)}
                className="absolute flex flex-col items-center justify-center transition-all duration-150"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: `translate(-50%, -50%) scale(${isHovered ? 1.2 : 1})`,
                  width: "clamp(28px, 2.5vw, 40px)",
                  height: "clamp(22px, 2vw, 32px)",
                  backgroundColor: bg,
                  border: `2px solid ${border}`,
                  borderRadius: "3px",
                  zIndex: isHovered || isSelected ? 20 : 10,
                  boxShadow: isHovered
                    ? "0 4px 12px rgba(0,0,0,0.3)"
                    : isSelected
                    ? "0 0 0 3px rgba(0,181,173,0.5), 0 2px 8px rgba(0,0,0,0.2)"
                    : "0 1px 4px rgba(0,0,0,0.2)",
                  opacity: loaded ? 1 : 0.5,
                  cursor: "pointer",
                }}
                aria-label={`Lot ${lot.lotNumber}, ${lot.area}m², ${count} registrations${isSelected ? ", selected" : ""}`}
              >
                <span
                  className="font-archivo font-bold text-white leading-none"
                  style={{ fontSize: "clamp(7px, 0.8vw, 11px)" }}
                >
                  {lot.lotNumber}
                </span>
                {count > 0 && !isSelected && (
                  <span
                    className="absolute -top-1.5 -right-1.5 bg-[#1A2744] text-white rounded-full flex items-center justify-center font-archivo font-bold"
                    style={{ width: "14px", height: "14px", fontSize: "8px" }}
                  >
                    {count}
                  </span>
                )}
                {isSelected && (
                  <span
                    className="absolute -top-1.5 -right-1.5 bg-[#00B5AD] text-white rounded-full flex items-center justify-center"
                    style={{ width: "14px", height: "14px", fontSize: "9px" }}
                  >
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hover tooltip */}
      {hoveredData && (
        <div className="mt-4 text-center font-archivo text-sm text-slate bg-white border border-black/5 py-3 px-4">
          <strong className="text-deep-blue">Lot {hoveredData.lotNumber}</strong>
          {" — "}
          {hoveredData.area}m² | {CATEGORY_INFO[hoveredData.category].label} |{" "}
          {hoveredData.zone} |{" "}
          <span className="font-semibold">
            {counts[hoveredData.id] || 0} registration
            {(counts[hoveredData.id] || 0) !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      <p className="text-xs text-slate/50 font-archivo mt-2 text-center">
        Click a lot on the subdivision plan to select it. Click again to deselect.
      </p>
    </div>
  );
}
