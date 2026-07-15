"use client";

import { useState } from "react";
import { useIssueStore, useIssueActions } from "@/lib/issueStore";
import { Landmark, CheckCircle, Zap, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { formatTimestamp, getStatusBg, getConfidenceBg } from "@/lib/utils";
import type { Issue } from "@/lib/types";
import { EMERGENCY_ASSETS } from "@/lib/mockData";

const RESOURCES = [
  "DRN-01 Falcon (Drone)",
  "DRN-02 Hawk (Drone)",
  "DRN-03 Eagle (Drone)",
  "DRN-04 Osprey (Drone)",
  "VEH-01 Rapid Response",
  "VEH-02 Repair Unit",
  "VEH-03 Crew Alpha",
  "VEH-04 Hazmat Unit",
  "Repair Crew Alpha",
  "Grid Engineers Team",
  "Traffic Signal Crew",
  "Hazmat Team",
  "Environmental Sensor Team",
];

function IssueDetailCard({ issue }: { issue: Issue }) {
  const { assignResource, markInProgress, markResolved } = useIssueActions();
  const [expanded, setExpanded] = useState(false);
  const [selectedResource, setSelectedResource] = useState(issue.ariaRecommendedResource ?? RESOURCES[0]);

  return (
    <div className="glass-card overflow-hidden">
      <div
        className="flex items-start justify-between gap-3 p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-mono font-bold" style={{ color: "var(--accent-cyan)" }}>{issue.id}</span>
            <span
              className="text-xs px-1.5 py-0.5 rounded border font-medium"
              style={{ background: "rgba(155,89,212,0.08)", color: "#9b59d4", borderColor: "rgba(155,89,212,0.2)" }}
            >
              {issue.category}
            </span>
            <div className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
              <MapPin size={10} />
              {issue.district}
            </div>
            <span
              className="text-xs px-1.5 py-0.5 rounded border font-medium"
              style={{ background: "rgba(243,156,61,0.08)", color: "#f39c3d", borderColor: "rgba(243,156,61,0.2)" }}
            >
              Routed to: {issue.routedTo}
            </span>
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {issue.description.slice(0, 100)}{issue.description.length > 100 ? "…" : ""}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Citizen: {issue.citizenName} · Urgency: {issue.urgency}/5 · Submitted {formatTimestamp(issue.submittedAt)}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-lg border ${getStatusBg(issue.status)}`}>
            {issue.status}
          </span>
          {expanded ? <ChevronUp size={14} style={{ color: "var(--text-muted)" }} /> : <ChevronDown size={14} style={{ color: "var(--text-muted)" }} />}
        </div>
      </div>

      {expanded && (
        <div
          className="border-t px-4 pb-4 pt-3 space-y-3"
          style={{ borderColor: "rgba(63,198,232,0.1)" }}
        >
          {/* Full description */}
          <div
            className="p-3 rounded-lg text-xs"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(63,198,232,0.08)" }}
          >
            <p className="font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>Full Description</p>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>{issue.description}</p>
          </div>

          {/* ARIA Recommendation */}
          <div
            className="p-3 rounded-lg text-xs"
            style={{ background: "rgba(63,198,232,0.04)", border: "1px solid rgba(63,198,232,0.12)" }}
          >
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold" style={{ color: "var(--accent-cyan)" }}>
                ARIA Recommended Resource
              </p>
              <span className={`px-2 py-0.5 rounded border ${getConfidenceBg(issue.ariaConfidence)}`}>
                {issue.ariaConfidence}% confidence
              </span>
            </div>
            <p style={{ color: "var(--accent-orange)" }}>{issue.ariaRecommendedResource}</p>
          </div>

          {/* Assign Resource */}
          {!issue.assignedResource && issue.status === "Approved & Routed" && (
            <div className="space-y-2">
              <label className="text-xs font-medium block" style={{ color: "var(--text-muted)" }}>
                Assign Resource
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedResource}
                  onChange={(e) => setSelectedResource(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg text-xs focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(63,198,232,0.2)", color: "var(--text-primary)" }}
                >
                  {RESOURCES.map((r) => (
                    <option key={r} value={r} style={{ background: "#14132b" }}>{r}</option>
                  ))}
                </select>
                <button
                  className="btn-cyan"
                  onClick={() => assignResource(issue.id, selectedResource)}
                >
                  Assign
                </button>
              </div>
            </div>
          )}

          {/* Assigned resource display */}
          {issue.assignedResource && (
            <div className="flex items-center justify-between text-xs p-2 rounded-lg" style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)" }}>
              <span style={{ color: "var(--text-muted)" }}>Assigned Resource</span>
              <span style={{ color: "#4ade80" }}>{issue.assignedResource}</span>
            </div>
          )}

          {/* Status Actions */}
          <div className="flex items-center gap-2">
            {issue.status === "Approved & Routed" && (
              <button className="btn-cyan" onClick={() => markInProgress(issue.id)}>
                <Zap size={12} className="inline mr-1" />
                Mark In Progress
              </button>
            )}
            {(issue.status === "In Progress" || issue.status === "Approved & Routed") && (
              <button className="btn-green" onClick={() => markResolved(issue.id)}>
                <CheckCircle size={12} className="inline mr-1" />
                Mark Resolved
              </button>
            )}
            {(issue.status === "Resolved") && (
              <span className="text-xs" style={{ color: "#4ade80" }}>
                ✓ Resolved {issue.resolvedAt ? formatTimestamp(issue.resolvedAt) : ""}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OfficialPage() {
  const { state } = useIssueStore();
  const [statusFilter, setStatusFilter] = useState<"all" | "Approved & Routed" | "In Progress" | "Resolved">("all");

  const assigned = state.issues.filter((i) =>
    ["Approved & Routed", "In Progress", "Resolved"].includes(i.status) &&
    (statusFilter === "all" || i.status === statusFilter)
  ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const routedCount = state.issues.filter((i) => i.status === "Approved & Routed").length;
  const inProgressCount = state.issues.filter((i) => i.status === "In Progress").length;
  const resolvedCount = state.issues.filter((i) => i.status === "Resolved").length;

  // Active assets in field
  const activeAssets = EMERGENCY_ASSETS.filter((a) => a.status === "En Route" || a.status === "On Site");

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(155,89,212,0.12)", border: "1px solid rgba(155,89,212,0.25)" }}
        >
          <Landmark size={17} style={{ color: "#9b59d4" }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-primary)" }}>
            Government Official View
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Assigned issue queue · Resource allocation · Field coordination
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Awaiting Action", value: routedCount, color: "#f39c3d" },
          { label: "In Progress", value: inProgressCount, color: "#3fc6e8" },
          { label: "Resolved", value: resolvedCount, color: "#4ade80" },
          { label: "Assets Deployed", value: activeAssets.length, color: "#9b59d4" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className="text-2xl font-bold mb-0.5" style={{ color: s.color, fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Active assets mini-list */}
      {activeAssets.length > 0 && (
        <div className="glass-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
            ASSETS IN FIELD ({activeAssets.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {activeAssets.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
                style={{
                  background: a.status === "On Site" ? "rgba(74,222,128,0.08)" : "rgba(250,204,21,0.08)",
                  border: `1px solid ${a.status === "On Site" ? "rgba(74,222,128,0.2)" : "rgba(250,204,21,0.2)"}`,
                  color: a.status === "On Site" ? "#4ade80" : "#facc15",
                }}
              >
                <span>{a.type === "drone" ? "✈" : a.type === "vehicle" ? "🚗" : "📡"}</span>
                <span>{a.name}</span>
                <span style={{ opacity: 0.7 }}>{a.status}</span>
                <span style={{ opacity: 0.5 }}>· {a.district}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Filter:
        </p>
        {(["all", "Approved & Routed", "In Progress", "Resolved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: statusFilter === f ? "rgba(155,89,212,0.12)" : "transparent",
              color: statusFilter === f ? "#9b59d4" : "var(--text-secondary)",
              border: statusFilter === f ? "1px solid rgba(155,89,212,0.3)" : "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {f === "all" ? `All Assigned (${routedCount + inProgressCount + resolvedCount})` : f}
          </button>
        ))}
      </div>

      {/* Issue list */}
      <div className="space-y-3">
        {assigned.length === 0 && (
          <div className="glass-card p-8 text-center">
            <Landmark size={24} className="mx-auto mb-2 opacity-30" style={{ color: "var(--text-muted)" }} />
            <p style={{ color: "var(--text-muted)" }}>No issues assigned to this view yet.</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Switch to Admin View to approve and route issues.</p>
          </div>
        )}
        {assigned.map((issue) => (
          <IssueDetailCard key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
}
