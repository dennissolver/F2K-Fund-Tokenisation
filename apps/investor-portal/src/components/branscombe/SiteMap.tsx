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
 * SVG-based positions for each unit on the schematic site map.
 * Coordinates are in SVG viewBox units (0-1000 x, 0-900 y).
 * Mapped from the Unison architectural site plan drawing.
 * North is top-right, Branscombe Road is at the bottom-left.
 */
const UNIT_POSITIONS: Record<string, { x: number; y: number }> = {
  // North cluster (top of site)
  U14: { x: 380, y: 80 },
  U16: { x: 530, y: 60 },
  U13: { x: 340, y: 170 },
  U12: { x: 210, y: 180 },
  U15: { x: 490, y: 160 },
  U18: { x: 630, y: 120 },

  // Upper-mid
  U10: { x: 300, y: 260 },
  U11: { x: 170, y: 290 },
  U17: { x: 490, y: 250 },
  U19: { x: 580, y: 240 },
  U20: { x: 710, y: 190 },

  // Mid zone
  U9:  { x: 360, y: 345 },
  U3:  { x: 220, y: 380 },
  U8:  { x: 430, y: 400 },
  U21: { x: 620, y: 320 },
  U22: { x: 720, y: 310 },
  U37: { x: 810, y: 340 },

  // Mid-east
  U23: { x: 680, y: 410 },
  U24: { x: 730, y: 470 },
  U36: { x: 850, y: 400 },
  U35: { x: 880, y: 470 },

  // Mid-lower
  U2:  { x: 160, y: 470 },
  U4:  { x: 250, y: 520 },
  U7:  { x: 370, y: 470 },
  U25: { x: 610, y: 490 },
  U26: { x: 680, y: 510 },
  U33: { x: 790, y: 530 },
  U34: { x: 860, y: 545 },

  // Lower
  U1:  { x: 190, y: 580 },
  U5:  { x: 300, y: 610 },
  U27: { x: 590, y: 590 },
  U28: { x: 710, y: 590 },

  // Bottom
  U6:  { x: 250, y: 690 },
  U30: { x: 410, y: 720 },
  U29: { x: 530, y: 690 },
  U31: { x: 790, y: 720 },
  U32: { x: 850, y: 650 },
};

/** Colour by house type for schematic */
const TYPE_FILL: Record<string, string> = {
  "1A": "#00B5AD",
  "1B": "#0097A7",
  "2A": "#7B1FA2",
  "2B": "#512DA8",
  "2C": "#303F9F",
};

function getStatusColor(count: number, isSelected: boolean, type: string): string {
  if (isSelected) return "#1A2744";
  if (count >= 3) return "#E85D4A";
  if (count >= 2) return "#C8A951";
  if (count === 1) return "#E8A537";
  return TYPE_FILL[type] || "#00B5AD";
}

function getBorderColor(count: number, isSelected: boolean): string {
  if (isSelected) return "#00B5AD";
  if (count >= 3) return "#C0392B";
  if (count >= 2) return "#B8941A";
  if (count === 1) return "#CC8A1E";
  return "rgba(255,255,255,0.6)";
}

const UNIT_W = 70;
const UNIT_H = 44;

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
      <div className="flex flex-wrap gap-4 mb-4 text-sm font-archivo">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {Object.entries(TYPE_FILL).map(([type, fill]) => (
              <div key={type} className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: fill }} />
                <span className="text-slate text-[0.6rem]">{type}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="w-px bg-black/10" />
        {[
          { color: "#E8A537", label: "1 registration" },
          { color: "#C8A951", label: "2 registrations" },
          { color: "#E85D4A", label: "3+" },
          { color: "#1A2744", label: "Your selection" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-slate text-xs">{item.label}</span>
          </div>
        ))}
      </div>

      {/* SVG Schematic Site Map */}
      <div className="border border-black/10 bg-[#F8F7F4] rounded overflow-hidden">
        <svg
          viewBox="0 0 1000 820"
          className="w-full h-auto"
          role="img"
          aria-label="Branscombe Estate interactive site map — click a unit to select"
        >
          {/* Background */}
          <rect width="1000" height="820" fill="#F8F7F4" />

          {/* Site boundary */}
          <path
            d="M 90,770 L 60,350 130,120 350,30 600,15 870,100 950,350 930,700 850,780 Z"
            fill="#E8E6E0"
            stroke="#C5C0B8"
            strokeWidth="2"
            strokeDasharray="8,4"
          />

          {/* Internal roads (simplified curves) */}
          <path
            d="M 90,770 C 100,600 120,450 170,350 Q 220,260 300,200 Q 400,130 500,100 Q 620,65 750,120"
            fill="none"
            stroke="#D5D0C8"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <path
            d="M 300,200 Q 380,280 400,380 Q 420,480 380,580 Q 340,680 350,770"
            fill="none"
            stroke="#D5D0C8"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            d="M 500,100 Q 560,200 600,350 Q 640,500 680,600 Q 720,700 800,770"
            fill="none"
            stroke="#D5D0C8"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Road labels */}
          <text x="100" y="795" fontSize="11" fill="#999" fontFamily="sans-serif" fontWeight="600" letterSpacing="2">
            BRANSCOMBE ROAD
          </text>

          {/* North arrow */}
          <g transform="translate(940,50)">
            <line x1="0" y1="40" x2="0" y2="0" stroke="#999" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <text x="0" y="55" fontSize="10" fill="#999" fontFamily="sans-serif" textAnchor="middle">N</text>
          </g>
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#999" />
            </marker>
          </defs>

          {/* Unit blocks */}
          {UNITS.map((unit) => {
            const pos = UNIT_POSITIONS[unit.id];
            if (!pos) return null;

            const count = counts[unit.id] || 0;
            const isSelected = selectedUnits.includes(unit.id);
            const isHovered = hoveredUnit === unit.id;
            const bg = getStatusColor(count, isSelected, unit.type);
            const border = getBorderColor(count, isSelected);
            const scale = isHovered ? 1.1 : 1;

            return (
              <g
                key={unit.id}
                transform={`translate(${pos.x}, ${pos.y}) scale(${scale})`}
                style={{
                  transformOrigin: `${pos.x}px ${pos.y}px`,
                  cursor: "pointer",
                  opacity: loaded ? 1 : 0.5,
                  transition: "transform 0.15s ease",
                }}
                onClick={() => onToggleUnit(unit.id)}
                onMouseEnter={() => setHoveredUnit(unit.id)}
                onMouseLeave={() => setHoveredUnit(null)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onToggleUnit(unit.id); }}
                aria-label={`${unit.id}, Type ${unit.type}, ${count} registrations${isSelected ? ", selected" : ""}`}
              >
                {/* Shadow */}
                <rect
                  x={-UNIT_W / 2 + 2}
                  y={-UNIT_H / 2 + 2}
                  width={UNIT_W}
                  height={UNIT_H}
                  rx="4"
                  fill="rgba(0,0,0,0.15)"
                />
                {/* Main rect */}
                <rect
                  x={-UNIT_W / 2}
                  y={-UNIT_H / 2}
                  width={UNIT_W}
                  height={UNIT_H}
                  rx="4"
                  fill={bg}
                  stroke={border}
                  strokeWidth={isSelected ? 3 : isHovered ? 2 : 1.5}
                />
                {/* Unit label */}
                <text
                  x={0}
                  y={-3}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="bold"
                  fill="white"
                  fontFamily="sans-serif"
                >
                  {unit.id}
                </text>
                {/* Type label */}
                <text
                  x={0}
                  y={11}
                  textAnchor="middle"
                  fontSize="9"
                  fill="rgba(255,255,255,0.7)"
                  fontFamily="sans-serif"
                >
                  Type {unit.type}
                </text>
                {/* Registration count badge */}
                {count > 0 && !isSelected && (
                  <g>
                    <circle cx={UNIT_W / 2 - 2} cy={-UNIT_H / 2 + 2} r="9" fill="#1A2744" />
                    <text
                      x={UNIT_W / 2 - 2}
                      y={-UNIT_H / 2 + 6}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="bold"
                      fill="white"
                      fontFamily="sans-serif"
                    >
                      {count}
                    </text>
                  </g>
                )}
                {/* Selected checkmark */}
                {isSelected && (
                  <g>
                    <circle cx={UNIT_W / 2 - 2} cy={-UNIT_H / 2 + 2} r="9" fill="#00B5AD" />
                    <text
                      x={UNIT_W / 2 - 2}
                      y={-UNIT_H / 2 + 6}
                      textAnchor="middle"
                      fontSize="11"
                      fill="white"
                      fontFamily="sans-serif"
                    >
                      ✓
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
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

      {/* Original site plan link */}
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-slate/50 font-archivo">
          Click a unit to select it. Click again to deselect.
          Units are colour-coded by house type.
        </p>
        <a
          href="/branscombe/site-plan.jpg"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#00B5AD] hover:underline font-archivo shrink-0 ml-4"
        >
          View full architectural site plan →
        </a>
      </div>
    </div>
  );
}
