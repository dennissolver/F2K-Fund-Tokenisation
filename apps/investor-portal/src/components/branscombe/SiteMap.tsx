"use client";

import { useState, useEffect, useCallback } from "react";
import { UNITS, HOUSE_TYPE_INFO, type UnitData } from "@/lib/branscombe-units";

interface UnitCounts {
  [unitId: string]: number;
}

interface SiteMapProps {
  selectedUnits: string[];
  onToggleUnit: (unitId: string) => void;
}

/**
 * Percentage-based (x%, y%) positions for each unit hotspot
 * overlaid on the actual site plan image (site-plan.jpg).
 * Coordinates represent the centre of each unit on the full image.
 */
const UNIT_POSITIONS: Record<string, { x: number; y: number }> = {
  // North cluster
  U14: { x: 63, y: 10 },
  U13: { x: 55, y: 17 },
  U12: { x: 42, y: 19 },
  U16: { x: 74, y: 14 },
  U15: { x: 64, y: 22 },

  // Upper-mid / west
  U11: { x: 36, y: 30 },
  U10: { x: 50, y: 27 },
  U17: { x: 63, y: 26 },
  U18: { x: 76, y: 21 },
  U19: { x: 67, y: 30 },
  U20: { x: 83, y: 25 },

  // Mid zone
  U9:  { x: 55, y: 36 },
  U3:  { x: 42, y: 38 },
  U8:  { x: 60, y: 42 },
  U21: { x: 72, y: 33 },
  U22: { x: 81, y: 34 },

  // Right edge
  U37: { x: 86, y: 38 },
  U36: { x: 90, y: 43 },
  U35: { x: 90, y: 49 },
  U34: { x: 89, y: 56 },

  // Mid-lower
  U2:  { x: 38, y: 46 },
  U4:  { x: 43, y: 50 },
  U7:  { x: 57, y: 48 },
  U23: { x: 75, y: 41 },
  U24: { x: 78, y: 47 },
  U25: { x: 67, y: 54 },
  U26: { x: 75, y: 52 },
  U33: { x: 83, y: 53 },

  // Lower
  U5:  { x: 50, y: 56 },
  U1:  { x: 39, y: 58 },
  U6:  { x: 47, y: 65 },
  U27: { x: 69, y: 62 },
  U28: { x: 78, y: 60 },

  // Bottom
  U30: { x: 55, y: 73 },
  U29: { x: 63, y: 70 },
  U31: { x: 83, y: 74 },
  U32: { x: 88, y: 67 },
};

function getStatusColor(count: number, isSelected: boolean): string {
  if (isSelected) return "rgba(26, 39, 68, 0.92)";   // deep-blue
  if (count >= 3) return "rgba(232, 93, 74, 0.88)";   // coral
  if (count >= 2) return "rgba(200, 169, 81, 0.88)";  // gold
  if (count === 1) return "rgba(232, 165, 55, 0.88)";  // amber
  return "rgba(0, 181, 173, 0.85)";                    // teal
}

function getBorderColor(count: number, isSelected: boolean): string {
  if (isSelected) return "#FFFFFF";
  if (count >= 3) return "#C0392B";
  if (count >= 2) return "#B8941A";
  if (count === 1) return "#CC8A1E";
  return "#009E97";
}

export default function SiteMap({ selectedUnits, onToggleUnit }: SiteMapProps) {
  const [counts, setCounts] = useState<UnitCounts>({});
  const [hoveredUnit, setHoveredUnit] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const fetchCounts = useCallback(async () => {
    try {
      const res = await fetch("/api/branscombe/units");
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

  const hoveredData = hoveredUnit
    ? UNITS.find((u) => u.id === hoveredUnit)
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

      {/* Interactive site plan */}
      <div className="relative w-full overflow-x-auto border border-black/10 bg-white">
        <div className="relative" style={{ minWidth: "700px" }}>
          {/* Site plan image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/branscombe/site-plan.jpg"
            alt="Branscombe Estate site plan — 37 dwelling layout"
            className="w-full h-auto block"
            draggable={false}
          />

          {/* Clickable unit hotspots */}
          {UNITS.map((unit) => {
            const pos = UNIT_POSITIONS[unit.id];
            if (!pos) return null;

            const count = counts[unit.id] || 0;
            const isSelected = selectedUnits.includes(unit.id);
            const isHovered = hoveredUnit === unit.id;
            const bg = getStatusColor(count, isSelected);
            const border = getBorderColor(count, isSelected);

            return (
              <button
                key={unit.id}
                type="button"
                onClick={() => onToggleUnit(unit.id)}
                onMouseEnter={() => setHoveredUnit(unit.id)}
                onMouseLeave={() => setHoveredUnit(null)}
                className="absolute flex flex-col items-center justify-center transition-all duration-150"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: `translate(-50%, -50%) scale(${isHovered ? 1.15 : 1})`,
                  width: "clamp(36px, 3.5vw, 52px)",
                  height: "clamp(28px, 2.8vw, 40px)",
                  backgroundColor: bg,
                  border: `2px solid ${border}`,
                  borderRadius: "4px",
                  zIndex: isHovered || isSelected ? 20 : 10,
                  boxShadow: isHovered
                    ? "0 4px 12px rgba(0,0,0,0.3)"
                    : isSelected
                    ? "0 0 0 3px rgba(0,181,173,0.5), 0 2px 8px rgba(0,0,0,0.2)"
                    : "0 1px 4px rgba(0,0,0,0.2)",
                  opacity: loaded ? 1 : 0.5,
                  cursor: "pointer",
                }}
                aria-label={`Unit ${unit.id}, Type ${unit.type}, ${count} registrations${isSelected ? ", selected" : ""}`}
              >
                <span
                  className="font-archivo font-bold text-white leading-none"
                  style={{ fontSize: "clamp(9px, 1vw, 13px)" }}
                >
                  {unit.id}
                </span>
                {/* Registration count badge */}
                {count > 0 && !isSelected && (
                  <span
                    className="absolute -top-1.5 -right-1.5 bg-[#1A2744] text-white rounded-full flex items-center justify-center font-archivo font-bold"
                    style={{
                      width: "16px",
                      height: "16px",
                      fontSize: "9px",
                    }}
                  >
                    {count}
                  </span>
                )}
                {/* Selected checkmark */}
                {isSelected && (
                  <span
                    className="absolute -top-1.5 -right-1.5 bg-[#00B5AD] text-white rounded-full flex items-center justify-center"
                    style={{
                      width: "16px",
                      height: "16px",
                      fontSize: "10px",
                    }}
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
          <strong className="text-deep-blue">{hoveredData.id}</strong>
          {" — "}
          Type {hoveredData.type} | {HOUSE_TYPE_INFO[hoveredData.type].size} +{" "}
          {HOUSE_TYPE_INFO[hoveredData.type].deck} | 3 bed / 2 bath | {hoveredData.zone} |{" "}
          <span className="font-semibold">
            {counts[hoveredData.id] || 0} registration
            {(counts[hoveredData.id] || 0) !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      <p className="text-xs text-slate/50 font-archivo mt-2 text-center">
        Click a unit on the site plan to select it. Click again to deselect.
      </p>
    </div>
  );
}
