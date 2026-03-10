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

function getUnitColor(count: number, isSelected: boolean): string {
  if (isSelected) return "#1A2744"; // deep-blue when selected
  if (count >= 3) return "#E85D4A"; // coral/red — high interest
  if (count >= 2) return "#C8A951"; // gold — moderate interest
  if (count === 1) return "#E8A537"; // amber — one registration
  return "#00B5AD"; // teal — available
}

function getTextColor(count: number, isSelected: boolean): string {
  if (isSelected) return "#FFFFFF";
  if (count >= 3) return "#FFFFFF";
  return "#1A2744";
}

const CELL_W = 100;
const CELL_H = 80;
const GAP = 8;
const PAD = 40;
const COLS = 6;
const ROWS = 9;

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
      // silently fail — counts just show 0
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  const svgW = PAD * 2 + COLS * (CELL_W + GAP) - GAP;
  const svgH = PAD * 2 + ROWS * (CELL_H + GAP) - GAP + 60; // extra space for road label

  const unitX = (col: number) => PAD + col * (CELL_W + GAP);
  const unitY = (row: number) => PAD + row * (CELL_H + GAP);

  // Build a set of occupied cells to draw road paths between clusters
  const occupied = new Set(UNITS.map((u) => `${u.col},${u.row}`));

  return (
    <div className="w-full">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm font-archivo">
        {[
          { color: "#00B5AD", label: "Available" },
          { color: "#E8A537", label: "1 registration" },
          { color: "#C8A951", label: "2 registrations" },
          { color: "#E85D4A", label: "3+ registrations" },
          { color: "#1A2744", label: "Your selection" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-slate text-xs">{item.label}</span>
          </div>
        ))}
      </div>

      {/* SVG Site Map */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="w-full max-w-[750px] mx-auto"
          style={{ minWidth: "480px" }}
        >
          {/* Background */}
          <rect x="0" y="0" width={svgW} height={svgH} rx="8" fill="#F5F3EE" />

          {/* Site boundary — L-shaped approximation */}
          <path
            d={`M ${PAD - 10} ${PAD - 10}
                L ${svgW - PAD + 10} ${PAD - 10}
                L ${svgW - PAD + 10} ${svgH - 60}
                L ${PAD - 10} ${svgH - 60}
                Z`}
            fill="none"
            stroke="#D4D0C8"
            strokeWidth="2"
            strokeDasharray="8 4"
          />

          {/* North arrow */}
          <g transform={`translate(${svgW - 50}, ${PAD + 10})`}>
            <polygon points="0,-18 -6,0 6,0" fill="#1A2744" opacity="0.5" />
            <text
              x="0"
              y="12"
              textAnchor="middle"
              fontSize="10"
              fill="#1A2744"
              opacity="0.5"
              fontFamily="monospace"
            >
              N
            </text>
          </g>

          {/* Internal road paths */}
          {/* Road 1 — main loop left side */}
          <line
            x1={unitX(0) + CELL_W / 2}
            y1={unitY(8) + CELL_H + 4}
            x2={unitX(0) + CELL_W / 2}
            y2={unitY(2) - 4}
            stroke="#C8C4BB"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Road 2 — upper spur */}
          <line
            x1={unitX(0) + CELL_W + 4}
            y1={unitY(2) + CELL_H / 2}
            x2={unitX(5) - 4}
            y2={unitY(2) + CELL_H / 2}
            stroke="#C8C4BB"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Road 3 — right side */}
          <line
            x1={unitX(5) + CELL_W / 2}
            y1={unitY(2) + CELL_H + 4}
            x2={unitX(5) + CELL_W / 2}
            y2={unitY(8) + CELL_H + 4}
            stroke="#C8C4BB"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Unit tiles */}
          {UNITS.map((unit) => {
            const count = counts[unit.id] || 0;
            const isSelected = selectedUnits.includes(unit.id);
            const isHovered = hoveredUnit === unit.id;
            const x = unitX(unit.col);
            const y = unitY(unit.row);
            const fill = getUnitColor(count, isSelected);
            const textFill = getTextColor(count, isSelected);
            const info = HOUSE_TYPE_INFO[unit.type];

            return (
              <g
                key={unit.id}
                onClick={() => onToggleUnit(unit.id)}
                onMouseEnter={() => setHoveredUnit(unit.id)}
                onMouseLeave={() => setHoveredUnit(null)}
                className="cursor-pointer"
                role="button"
                aria-label={`Unit ${unit.id}, Type ${unit.type}, ${count} registrations${isSelected ? ", selected" : ""}`}
              >
                {/* Shadow */}
                <rect
                  x={x + 2}
                  y={y + 2}
                  width={CELL_W}
                  height={CELL_H}
                  rx="6"
                  fill="rgba(0,0,0,0.08)"
                />
                {/* Main tile */}
                <rect
                  x={x}
                  y={y}
                  width={CELL_W}
                  height={CELL_H}
                  rx="6"
                  fill={fill}
                  stroke={isHovered ? "#1A2744" : "rgba(0,0,0,0.1)"}
                  strokeWidth={isHovered || isSelected ? 2.5 : 1}
                  opacity={loaded ? 1 : 0.5}
                >
                  {isSelected && (
                    <animate
                      attributeName="stroke-opacity"
                      values="1;0.4;1"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  )}
                </rect>

                {/* Unit number */}
                <text
                  x={x + CELL_W / 2}
                  y={y + 22}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="700"
                  fill={textFill}
                  fontFamily="var(--font-archivo), sans-serif"
                >
                  {unit.id}
                </text>

                {/* Type label */}
                <text
                  x={x + CELL_W / 2}
                  y={y + 38}
                  textAnchor="middle"
                  fontSize="9"
                  fill={textFill}
                  opacity="0.7"
                  fontFamily="var(--font-ibm-mono), monospace"
                >
                  Type {unit.type}
                </text>

                {/* Size */}
                <text
                  x={x + CELL_W / 2}
                  y={y + 52}
                  textAnchor="middle"
                  fontSize="9"
                  fill={textFill}
                  opacity="0.6"
                  fontFamily="var(--font-ibm-mono), monospace"
                >
                  {info.size}
                </text>

                {/* Registration count badge */}
                {count > 0 && !isSelected && (
                  <g>
                    <circle
                      cx={x + CELL_W - 10}
                      cy={y + 10}
                      r="10"
                      fill="#1A2744"
                    />
                    <text
                      x={x + CELL_W - 10}
                      y={y + 14}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="700"
                      fill="#FFFFFF"
                      fontFamily="var(--font-archivo), sans-serif"
                    >
                      {count}
                    </text>
                  </g>
                )}

                {/* Selected checkmark */}
                {isSelected && (
                  <g>
                    <circle
                      cx={x + CELL_W - 10}
                      cy={y + 10}
                      r="10"
                      fill="#00B5AD"
                    />
                    <path
                      d={`M ${x + CELL_W - 15} ${y + 10} l 3 4 l 7 -7`}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                )}
              </g>
            );
          })}

          {/* Branscombe Road label at bottom */}
          <g>
            <line
              x1={PAD}
              y1={svgH - 30}
              x2={svgW / 2 - 80}
              y2={svgH - 30}
              stroke="#1A2744"
              strokeWidth="2"
              opacity="0.3"
            />
            <text
              x={svgW / 2}
              y={svgH - 25}
              textAnchor="middle"
              fontSize="12"
              fontWeight="600"
              fill="#1A2744"
              opacity="0.5"
              fontFamily="var(--font-archivo), sans-serif"
            >
              BRANSCOMBE ROAD
            </text>
            <line
              x1={svgW / 2 + 80}
              y1={svgH - 30}
              x2={svgW - PAD}
              y2={svgH - 30}
              stroke="#1A2744"
              strokeWidth="2"
              opacity="0.3"
            />
            {/* Entry arrow */}
            <polygon
              points={`${PAD + 20},${svgH - 15} ${PAD + 10},${svgH - 20} ${PAD + 10},${svgH - 10}`}
              fill="#1A2744"
              opacity="0.4"
            />
            <text
              x={PAD + 30}
              y={svgH - 12}
              fontSize="8"
              fill="#1A2744"
              opacity="0.4"
              fontFamily="var(--font-ibm-mono), monospace"
            >
              ENTRY
            </text>
          </g>
        </svg>
      </div>

      {/* Hovered unit tooltip */}
      {hoveredUnit && (
        <div className="mt-4 text-center font-archivo text-sm text-slate">
          {(() => {
            const unit = UNITS.find((u) => u.id === hoveredUnit);
            if (!unit) return null;
            const info = HOUSE_TYPE_INFO[unit.type];
            const count = counts[unit.id] || 0;
            return (
              <span>
                <strong className="text-deep-blue">{unit.id}</strong> — Type{" "}
                {unit.type} | {info.size} + {info.deck} | {info.beds} bed |{" "}
                {unit.zone} |{" "}
                <span className="font-semibold">
                  {count} registration{count !== 1 ? "s" : ""}
                </span>
              </span>
            );
          })()}
        </div>
      )}
    </div>
  );
}
