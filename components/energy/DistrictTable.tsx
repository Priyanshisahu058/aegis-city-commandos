"use client";

import { useState } from "react";
import { DISTRICTS } from "@/lib/mockData";
import type { District } from "@/lib/types";
import { X, CheckCircle, RotateCcw, MessageSquare } from "lucide-react";
import LoadChart from "./LoadChart";

const STATUS_STYLES: Record<string, string> = {
  stable: "bg-green-400/10 border-green-400/25 text-green-400",
  warning: "bg-yellow-400/10 border-yellow-400/25 text-yellow-400",
  critical: "bg-orange-400/10 border-orange-400/25 text-orange-400",
  blackout: "bg-red-400/10 border-red-400/25 text-red-400",
};

export default function DistrictTable() {
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [approved, setApproved] = useState<Set<string>>(new Set());
  const [overridden, setOverridden] = useState<Set<string>>(new Set());

  return (
    <div className="flex gap-5">
      {/* Table */}
      <div className="flex-1 glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr
              className="text-left text-xs font-semibold uppercase tracking-wider border-b"
              style={{ color: "var(--text-muted)", borderColor: "rgba(63,198,232,0.1)" }}
            >
              <th className="px-4 py-3">District</th>
              <th className="px-4 py-3">Load</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">ARIA Recommendation</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {DISTRICTS.map((d, i) => (
              <tr
                key={d.id}
                className="border-b transition-colors cursor-pointer"
                style={{
                  borderColor: "rgba(63,198,232,0.06)",
                  background:
                    selectedDistrict?.id === d.id
                      ? "rgba(63,198,232,0.05)"
                      : i % 2 === 0
                      ? "transparent"
                      : "rgba(255,255,255,0.01)",
                }}
                onClick={() => setSelectedDistrict(selectedDistrict?.id === d.id ? null : d)}
              >
                <td className="px-4 py-3 font-medium" style={{ color: "var(--text-primary)" }}>
                  {d.name}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${d.load}%`,
                          background: d.load > 90 ? "#ef4444" : d.load > 75 ? "#f39c3d" : "#4ade80",
                        }}
                      />
                    </div>
                    <span
                      className="text-xs font-mono font-bold"
                      style={{ color: d.load > 90 ? "#ef4444" : d.load > 75 ? "#f39c3d" : "#4ade80" }}
                    >
                      {d.load}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLES[d.status]}`}>
                    {d.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 max-w-xs">
                  <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                    {d.ariaAction}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="btn-green"
                      onClick={() => setApproved((prev) => new Set([...prev, d.id]))}
                    >
                      <CheckCircle size={11} className="inline mr-1" />
                      {approved.has(d.id) ? "Approved" : "Approve"}
                    </button>
                    <button className="btn-orange" onClick={() => setOverridden((prev) => new Set([...prev, d.id]))}>
                      <RotateCcw size={11} className="inline mr-1" />
                      Override
                    </button>
                    <button className="btn-cyan" onClick={() => setSelectedDistrict(d)}>
                      <MessageSquare size={11} className="inline mr-1" />
                      Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Side Panel */}
      {selectedDistrict && (
        <div className="w-72 glass-card p-4 space-y-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm" style={{ color: "var(--accent-cyan)" }}>
              {selectedDistrict.name}
            </h3>
            <button onClick={() => setSelectedDistrict(null)} style={{ color: "var(--text-muted)" }}>
              <X size={14} />
            </button>
          </div>

          <LoadChart districtId={selectedDistrict.id} districtName={selectedDistrict.name} />

          <div className="space-y-2 text-xs">
            {[
              { l: "Population", v: selectedDistrict.population.toLocaleString(), c: "var(--text-primary)" },
              { l: "Traffic Load", v: `${selectedDistrict.trafficLoad}%`, c: "#3fc6e8" },
              { l: "Trust Index", v: `${selectedDistrict.trustIndex}/100`, c: "#9b59d4" },
            ].map((m) => (
              <div key={m.l} className="flex justify-between">
                <span style={{ color: "var(--text-muted)" }}>{m.l}</span>
                <span style={{ color: m.c }}>{m.v}</span>
              </div>
            ))}
          </div>

          <div
            className="p-3 rounded-lg text-xs"
            style={{
              background: "rgba(63,198,232,0.06)",
              border: "1px solid rgba(63,198,232,0.15)",
            }}
          >
            <p className="font-semibold mb-1" style={{ color: "var(--accent-cyan)" }}>ARIA Action</p>
            <p style={{ color: "var(--text-secondary)" }}>{selectedDistrict.ariaAction}</p>
          </div>
        </div>
      )}
    </div>
  );
}
