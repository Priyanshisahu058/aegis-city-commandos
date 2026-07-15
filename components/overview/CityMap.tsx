"use client";

import { DISTRICTS } from "@/lib/mockData";
import type { District } from "@/lib/types";

const STATUS_COLORS: Record<string, { fill: string; stroke: string; glow: string }> = {
  stable: { fill: "rgba(74, 222, 128, 0.15)", stroke: "#4ade80", glow: "#4ade80" },
  warning: { fill: "rgba(250, 204, 21, 0.15)", stroke: "#facc15", glow: "#facc15" },
  critical: { fill: "rgba(251, 146, 60, 0.15)", stroke: "#fb923c", glow: "#fb923c" },
  blackout: { fill: "rgba(239, 68, 68, 0.15)", stroke: "#ef4444", glow: "#ef4444" },
};

interface CityMapProps {
  onSelectDistrict?: (d: District) => void;
  selectedId?: string;
}

export default function CityMap({ onSelectDistrict, selectedId }: CityMapProps) {
  return (
    <div className="relative w-full" style={{ aspectRatio: "1.4/1" }}>
      <svg
        viewBox="0 0 560 400"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 0 20px rgba(63,198,232,0.12))" }}
      >
        {/* Grid lines */}
        <defs>
          <pattern id="cityGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(63,198,232,0.06)" strokeWidth="1"/>
          </pattern>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect width="560" height="400" fill="url(#cityGrid)" />

        {/* Connection lines between districts */}
        {DISTRICTS.map((d, i) =>
          DISTRICTS.slice(i + 1)
            .filter((_, j) => j < 2)
            .map((d2) => (
              <line
                key={`${d.id}-${d2.id}`}
                x1={d.coordinates.x}
                y1={d.coordinates.y}
                x2={d2.coordinates.x}
                y2={d2.coordinates.y}
                stroke="rgba(63,198,232,0.08)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            ))
        )}

        {/* District nodes */}
        {DISTRICTS.map((district) => {
          const col = STATUS_COLORS[district.status];
          const isSelected = selectedId === district.id;
          const isCritical = district.status === "critical" || district.status === "blackout";

          return (
            <g
              key={district.id}
              onClick={() => onSelectDistrict?.(district)}
              style={{ cursor: "pointer" }}
              filter="url(#glow)"
            >
              {/* Outer ring */}
              <circle
                cx={district.coordinates.x}
                cy={district.coordinates.y}
                r={isSelected ? 22 : 18}
                fill={col.fill}
                stroke={col.stroke}
                strokeWidth={isSelected ? 2 : 1}
                opacity={0.6}
                className={isCritical ? "map-node-critical" : ""}
              />
              {/* Inner dot */}
              <circle
                cx={district.coordinates.x}
                cy={district.coordinates.y}
                r={7}
                fill={col.stroke}
                opacity={0.9}
              />
              {/* Load % label */}
              <text
                x={district.coordinates.x}
                y={district.coordinates.y + 30}
                textAnchor="middle"
                fontSize="9"
                fill={col.stroke}
                opacity={0.9}
                fontFamily="Inter, sans-serif"
                fontWeight="600"
              >
                {district.load}%
              </text>
              {/* District name */}
              <text
                x={district.coordinates.x}
                y={district.coordinates.y + 41}
                textAnchor="middle"
                fontSize="8"
                fill="rgba(232,244,248,0.7)"
                fontFamily="Inter, sans-serif"
              >
                {district.name}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        {[
          { color: "#4ade80", label: "Stable" },
          { color: "#facc15", label: "Warning" },
          { color: "#fb923c", label: "Critical" },
          { color: "#ef4444", label: "Blackout" },
        ].map((l, i) => (
          <g key={l.label} transform={`translate(${12 + i * 78}, 375)`}>
            <circle cx={5} cy={5} r={4} fill={l.color} opacity={0.8} />
            <text x={13} y={9} fontSize="8" fill="rgba(232,244,248,0.6)" fontFamily="Inter, sans-serif">
              {l.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
