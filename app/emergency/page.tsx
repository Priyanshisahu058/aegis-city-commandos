"use client";

import { useState } from "react";
import { EMERGENCY_ASSETS, INCIDENTS } from "@/lib/mockData";
import { useIssueStore } from "@/lib/issueStore";
import { Radio, Plane, Car, Activity, MapPin } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";
import type { EmergencyAsset } from "@/lib/types";

const ASSET_ICONS: Record<string, React.ElementType> = {
  drone: Plane,
  vehicle: Car,
  sensor: Activity,
};

const ASSET_COLORS: Record<string, string> = {
  drone: "#3fc6e8",
  vehicle: "#f39c3d",
  sensor: "#9b59d4",
};

const STATUS_STYLES: Record<string, string> = {
  "En Route": "bg-yellow-400/10 border-yellow-400/25 text-yellow-400",
  "On Site": "bg-green-400/10 border-green-400/25 text-green-400",
  Returning: "bg-blue-400/10 border-blue-400/25 text-blue-400",
  Standby: "bg-slate-400/10 border-slate-400/25 text-slate-400",
};

const SEV_COLORS: Record<string, string> = {
  critical: "text-red-400 bg-red-400/10 border-red-400/25",
  high: "text-orange-400 bg-orange-400/10 border-orange-400/25",
  medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/25",
  low: "text-green-400 bg-green-400/10 border-green-400/25",
};

export default function EmergencyPage() {
  const [dispatched, setDispatched] = useState<Set<string>>(new Set());
  const [selectedAsset, setSelectedAsset] = useState<EmergencyAsset | null>(null);
  const { state } = useIssueStore();

  // Merge in any "In Progress" issues from the pipeline as live incidents
  const pipelineIncidents = state.issues
    .filter((i) => i.status === "In Progress" && i.assignedResource)
    .map((i) => ({
      id: i.id,
      title: i.description.slice(0, 60) + "…",
      severity: (i.urgency >= 5 ? "critical" : i.urgency >= 4 ? "high" : "medium") as "critical" | "high" | "medium" | "low",
      district: i.district,
      description: i.description,
      reportedAt: i.submittedAt,
      assignedAssets: i.assignedResource ? [i.assignedResource] : [],
    }));

  const allIncidents = [...INCIDENTS, ...pipelineIncidents.filter((p) => !INCIDENTS.find((inc) => inc.issueId === p.id))];

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}
        >
          <Radio size={17} className="text-red-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-primary)" }}>
            Emergency Response Mesh
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {allIncidents.filter((i) => i.severity === "critical").length} critical ·{" "}
            {EMERGENCY_ASSETS.filter((a) => a.status === "En Route" || a.status === "On Site").length} assets deployed
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Map */}
        <div className="col-span-2 glass-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
            LIVE ASSET MAP
          </p>
          <svg viewBox="0 0 560 400" className="w-full" style={{ aspectRatio: "1.4/1" }}>
            <defs>
              <pattern id="emGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(63,198,232,0.05)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="560" height="400" fill="url(#emGrid)" />

            {/* District regions */}
            {[
              { x: 220, y: 100, name: "Northgate" },
              { x: 310, y: 200, name: "Central Hub" },
              { x: 440, y: 190, name: "Eastport" },
              { x: 320, y: 330, name: "Southvale" },
              { x: 160, y: 255, name: "Westbridge" },
              { x: 290, y: 270, name: "Midtown" },
              { x: 420, y: 320, name: "Harbor Zone" },
              { x: 130, y: 160, name: "Industrial" },
            ].map((d) => (
              <g key={d.name}>
                <circle cx={d.x} cy={d.y} r={28} fill="rgba(63,198,232,0.03)" stroke="rgba(63,198,232,0.08)" strokeWidth={1} />
                <text x={d.x} y={d.y + 40} textAnchor="middle" fontSize="8" fill="rgba(232,244,248,0.4)" fontFamily="Inter">
                  {d.name}
                </text>
              </g>
            ))}

            {/* Assets */}
            {EMERGENCY_ASSETS.map((asset) => {
              const color = ASSET_COLORS[asset.type];
              const isSelected = selectedAsset?.id === asset.id;
              return (
                <g
                  key={asset.id}
                  transform={`translate(${asset.coordinates.x}, ${asset.coordinates.y})`}
                  onClick={() => setSelectedAsset(isSelected ? null : asset)}
                  style={{ cursor: "pointer" }}
                >
                  <circle r={isSelected ? 14 : 10} fill={`${color}20`} stroke={color} strokeWidth={isSelected ? 2 : 1} />
                  <text textAnchor="middle" dominantBaseline="central" fontSize="11" fill={color}>
                    {asset.type === "drone" ? "✈" : asset.type === "vehicle" ? "🚗" : "📡"}
                  </text>
                  {asset.status === "En Route" && (
                    <circle r={16} fill="none" stroke={color} strokeWidth={1} opacity={0.4} className="map-node-critical" />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Incident List */}
        <div className="space-y-3 overflow-y-auto max-h-[450px]">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            ACTIVE INCIDENTS ({allIncidents.length})
          </p>
          {allIncidents.map((inc) => (
            <div key={inc.id} className="glass-card p-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-xs font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
                  {inc.title}
                </p>
                <span className={`text-xs px-1.5 py-0.5 rounded border flex-shrink-0 font-medium ${SEV_COLORS[inc.severity]}`}>
                  {inc.severity.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs mb-2">
                <MapPin size={10} style={{ color: "var(--text-muted)" }} />
                <span style={{ color: "var(--text-secondary)" }}>{inc.district}</span>
                <span style={{ color: "var(--text-muted)" }}>· {formatTimestamp(inc.reportedAt)}</span>
              </div>
              <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
                {inc.description.slice(0, 80)}…
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 flex-wrap">
                  {inc.assignedAssets.map((a) => (
                    <span
                      key={a}
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{ background: "rgba(63,198,232,0.08)", color: "var(--accent-cyan)", border: "1px solid rgba(63,198,232,0.2)" }}
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Asset Grid */}
      <div className="glass-card p-5">
        <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
          ASSET ROSTER ({EMERGENCY_ASSETS.length} total)
        </p>
        <div className="grid grid-cols-4 gap-3">
          {EMERGENCY_ASSETS.map((asset) => {
            const Icon = ASSET_ICONS[asset.type];
            const color = ASSET_COLORS[asset.type];
            return (
              <div
                key={asset.id}
                className="p-3 rounded-xl"
                style={{
                  background: selectedAsset?.id === asset.id ? `${color}10` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${selectedAsset?.id === asset.id ? `${color}30` : "rgba(63,198,232,0.08)"}`,
                  cursor: "pointer",
                }}
                onClick={() => setSelectedAsset(selectedAsset?.id === asset.id ? null : asset)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={13} style={{ color }} />
                  <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{asset.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{asset.district}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded border ${STATUS_STYLES[asset.status]}`}>
                    {asset.status}
                  </span>
                </div>
                {asset.status === "Standby" && (
                  <button
                    className="btn-cyan mt-2 w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDispatched((prev) => new Set([...prev, asset.id]));
                    }}
                  >
                    {dispatched.has(asset.id) ? "Dispatched ✓" : "Dispatch"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
