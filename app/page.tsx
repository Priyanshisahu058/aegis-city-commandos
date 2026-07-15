"use client";

import { useState } from "react";
import CityMap from "@/components/overview/CityMap";
import QuickStats from "@/components/overview/QuickStats";
import { DISTRICTS } from "@/lib/mockData";
import type { District } from "@/lib/types";
import { AlertTriangle, TrendingUp, Activity } from "lucide-react";

export default function OverviewPage() {
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  const criticalDistricts = DISTRICTS.filter((d) => d.status === "critical" || d.status === "blackout");
  const stableDistricts = DISTRICTS.filter((d) => d.status === "stable");

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-primary)" }}>
            City Overview
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
            Real-time ARIA monitoring across 8 districts
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
          style={{
            background: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            color: "#ef4444",
          }}
        >
          <AlertTriangle size={15} />
          {criticalDistricts.length} District{criticalDistricts.length !== 1 ? "s" : ""} Critical
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats />

      {/* Map + District Info */}
      <div className="grid grid-cols-3 gap-5">
        {/* City Map */}
        <div className="col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
              LIVE DISTRICT MAP
            </h2>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
              <Activity size={12} />
              Click a district to inspect
            </div>
          </div>
          <CityMap onSelectDistrict={setSelectedDistrict} selectedId={selectedDistrict?.id} />
        </div>

        {/* District Info Pane */}
        <div className="space-y-4">
          {/* Selected district info */}
          {selectedDistrict ? (
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold" style={{ color: "var(--accent-cyan)" }}>
                  {selectedDistrict.name}
                </h3>
                <span
                  className="text-xs px-2 py-0.5 rounded-full border font-medium"
                  style={{
                    color:
                      selectedDistrict.status === "stable" ? "#4ade80"
                      : selectedDistrict.status === "warning" ? "#facc15"
                      : selectedDistrict.status === "critical" ? "#fb923c"
                      : "#ef4444",
                    borderColor:
                      selectedDistrict.status === "stable" ? "rgba(74,222,128,0.3)"
                      : selectedDistrict.status === "warning" ? "rgba(250,204,21,0.3)"
                      : selectedDistrict.status === "critical" ? "rgba(251,146,60,0.3)"
                      : "rgba(239,68,68,0.3)",
                    background:
                      selectedDistrict.status === "stable" ? "rgba(74,222,128,0.08)"
                      : selectedDistrict.status === "warning" ? "rgba(250,204,21,0.08)"
                      : selectedDistrict.status === "critical" ? "rgba(251,146,60,0.08)"
                      : "rgba(239,68,68,0.08)",
                  }}
                >
                  {selectedDistrict.status.toUpperCase()}
                </span>
              </div>
              <div className="space-y-2 text-xs">
                {[
                  { label: "Grid Load", value: `${selectedDistrict.load}%`, bar: selectedDistrict.load, color: selectedDistrict.load > 80 ? "#ef4444" : selectedDistrict.load > 65 ? "#f39c3d" : "#4ade80" },
                  { label: "Traffic Load", value: `${selectedDistrict.trafficLoad}%`, bar: selectedDistrict.trafficLoad, color: "#3fc6e8" },
                  { label: "Trust Index", value: `${selectedDistrict.trustIndex}`, bar: selectedDistrict.trustIndex, color: "#9b59d4" },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="flex justify-between mb-1" style={{ color: "var(--text-secondary)" }}>
                      <span>{m.label}</span>
                      <span style={{ color: m.color }}>{m.value}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${m.bar}%`, background: m.color }} />
                    </div>
                  </div>
                ))}
                <div className="pt-2 border-t" style={{ borderColor: "rgba(63,198,232,0.1)" }}>
                  <p style={{ color: "var(--text-muted)" }}>Population</p>
                  <p style={{ color: "var(--text-primary)" }}>{selectedDistrict.population.toLocaleString()}</p>
                </div>
                <div>
                  <p style={{ color: "var(--text-muted)" }}>ARIA Recommendation</p>
                  <p className="mt-1 leading-relaxed" style={{ color: "var(--accent-cyan)" }}>
                    {selectedDistrict.ariaAction}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-4 text-center py-8">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Click a district on the map to inspect
              </p>
            </div>
          )}

          {/* Alert Districts */}
          <div className="glass-card p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
              Alert Districts
            </h3>
            <div className="space-y-2">
              {criticalDistricts.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDistrict(d)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all"
                  style={{
                    background: "rgba(239,68,68,0.05)",
                    border: "1px solid rgba(239,68,68,0.15)",
                  }}
                >
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{d.name}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{d.load}% load</p>
                  </div>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-medium"
                    style={{
                      background: d.status === "blackout" ? "rgba(239,68,68,0.15)" : "rgba(251,146,60,0.15)",
                      color: d.status === "blackout" ? "#ef4444" : "#fb923c",
                    }}
                  >
                    {d.status.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Stable Districts */}
          <div className="glass-card p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
              Stable Districts
            </h3>
            <div className="space-y-1">
              {stableDistricts.map((d) => (
                <div key={d.id} className="flex items-center justify-between py-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#4ade80" }} />
                    <span style={{ color: "var(--text-primary)" }}>{d.name}</span>
                  </div>
                  <span style={{ color: "#4ade80" }}>{d.load}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ARIA Insights row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} style={{ color: "var(--accent-cyan)" }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Cascade Risk Model
            </span>
          </div>
          <p className="text-2xl font-bold mb-1 glow-orange" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>68%</p>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            District 4 (Southvale) in ~3 hours. Weather + event load pattern detected.
          </p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={14} style={{ color: "#9b59d4" }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              ARIA Decisions Today
            </span>
          </div>
          <p className="text-2xl font-bold mb-1" style={{ color: "#9b59d4", fontFamily: "'Space Grotesk', sans-serif" }}>47</p>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            43 autonomous · 4 human-overridden · avg 81% confidence
          </p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} style={{ color: "#f39c3d" }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Equity Alert
            </span>
          </div>
          <p className="text-xs font-semibold mb-1" style={{ color: "#f39c3d" }}>Industrial Fringe Flagged</p>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            3 blackouts in 7 days vs city avg 0.4. Trust index at 29/100.
          </p>
        </div>
      </div>
    </div>
  );
}
