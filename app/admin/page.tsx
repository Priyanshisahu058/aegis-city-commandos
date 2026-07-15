"use client";

import { useState } from "react";
import { useIssueStore, useIssueActions } from "@/lib/issueStore";
import { Shield, Flag, ChevronDown, ChevronUp, CheckCircle, X, MessageSquare } from "lucide-react";
import { formatTimestamp, getStatusBg, getConfidenceBg } from "@/lib/utils";
import type { Department, Issue } from "@/lib/types";
import { FAIRNESS_DATA } from "@/lib/mockData";

const DEPARTMENTS: Department[] = [
  "Energy Management",
  "Traffic Control",
  "Public Safety",
  "General Services",
  "Emergency Response",
];

const PRIORITY_COLORS: Record<string, string> = {
  High: "bg-red-400/10 border-red-400/25 text-red-400",
  Medium: "bg-yellow-400/10 border-yellow-400/25 text-yellow-400",
  Low: "bg-green-400/10 border-green-400/25 text-green-400",
};

function ReviewCard({ issue, onApprove, onReject, onInfo }: {
  issue: Issue;
  onApprove: (dept: Department, notes: string) => void;
  onReject: (reason: string) => void;
  onInfo: (notes: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [mode, setMode] = useState<"idle" | "approve" | "reject" | "info">("idle");
  const [selectedDept, setSelectedDept] = useState<Department>("Energy Management");
  const [notes, setNotes] = useState("");
  const [reason, setReason] = useState("");

  return (
    <div className="glass-card overflow-hidden">
      {/* Header row */}
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
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{issue.district}</span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>· {formatTimestamp(issue.submittedAt)}</span>
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {issue.description.slice(0, 90)}{issue.description.length > 90 ? "…" : ""}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Citizen: {issue.citizenName} · Urgency: {issue.urgency}/5
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-lg border font-semibold ${PRIORITY_COLORS[issue.ariaPriority]}`}>
            {issue.ariaPriority}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-lg border font-semibold ${getConfidenceBg(issue.ariaConfidence)}`}>
            {issue.ariaConfidence}%
          </span>
          {expanded ? <ChevronUp size={14} style={{ color: "var(--text-muted)" }} /> : <ChevronDown size={14} style={{ color: "var(--text-muted)" }} />}
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div
          className="border-t px-4 pb-4 pt-3 space-y-3"
          style={{ borderColor: "rgba(63,198,232,0.1)" }}
        >
          {/* ARIA assessment */}
          <div
            className="p-3 rounded-lg text-xs"
            style={{ background: "rgba(63,198,232,0.04)", border: "1px solid rgba(63,198,232,0.12)" }}
          >
            <p className="font-semibold mb-1" style={{ color: "var(--accent-cyan)" }}>
              ARIA Assessment — {issue.ariaPriority} Priority ({issue.ariaConfidence}% confidence)
            </p>
            <p style={{ color: "var(--text-secondary)" }}>
              Recommended resource: <span style={{ color: "var(--accent-orange)" }}>{issue.ariaRecommendedResource}</span>
            </p>
            {issue.adminNotes && (
              <p className="mt-1 italic" style={{ color: "var(--text-muted)" }}>Note: {issue.adminNotes}</p>
            )}
          </div>

          {/* Actions */}
          {mode === "idle" && (
            <div className="flex items-center gap-2">
              <button className="btn-green" onClick={() => setMode("approve")}>
                <CheckCircle size={12} className="inline mr-1" />
                Approve & Route
              </button>
              <button className="btn-red" onClick={() => setMode("reject")}>
                <X size={12} className="inline mr-1" />
                Reject
              </button>
              <button className="btn-cyan" onClick={() => setMode("info")}>
                <MessageSquare size={12} className="inline mr-1" />
                Request More Info
              </button>
            </div>
          )}

          {mode === "approve" && (
            <div className="space-y-2">
              <label className="text-xs font-medium block" style={{ color: "var(--text-muted)" }}>
                Route to Department
              </label>
              <select
                value={selectedDept ?? ""}
                onChange={(e) => setSelectedDept(e.target.value as Department)}
                className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(63,198,232,0.2)", color: "var(--text-primary)" }}
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d ?? ""} style={{ background: "#14132b" }}>{d}</option>
                ))}
              </select>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Admin notes (optional)…"
                rows={2}
                className="w-full px-3 py-2 rounded-lg text-xs focus:outline-none resize-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(63,198,232,0.12)", color: "var(--text-primary)" }}
              />
              <div className="flex gap-2">
                <button className="btn-green" onClick={() => onApprove(selectedDept, notes)}>Confirm Route</button>
                <button className="btn-cyan" onClick={() => setMode("idle")}>Cancel</button>
              </div>
            </div>
          )}

          {mode === "reject" && (
            <div className="space-y-2">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Rejection reason (required)…"
                rows={2}
                className="w-full px-3 py-2 rounded-lg text-xs focus:outline-none resize-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(239,68,68,0.2)", color: "var(--text-primary)" }}
              />
              <div className="flex gap-2">
                <button className="btn-red" onClick={() => reason.trim() && onReject(reason)}>Confirm Reject</button>
                <button className="btn-cyan" onClick={() => setMode("idle")}>Cancel</button>
              </div>
            </div>
          )}

          {mode === "info" && (
            <div className="space-y-2">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What additional info is needed?…"
                rows={2}
                className="w-full px-3 py-2 rounded-lg text-xs focus:outline-none resize-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(63,198,232,0.12)", color: "var(--text-primary)" }}
              />
              <div className="flex gap-2">
                <button className="btn-cyan" onClick={() => { onInfo(notes); setMode("idle"); }}>Send Request</button>
                <button className="btn-cyan" onClick={() => setMode("idle")}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { state } = useIssueStore();
  const { approveAndRoute, rejectIssue, requestInfo } = useIssueActions();
  const [filter, setFilter] = useState<"all" | "Submitted" | "Under Admin Review">("all");

  const queue = state.issues.filter((i) =>
    filter === "all"
      ? i.status === "Submitted" || i.status === "Under Admin Review"
      : i.status === filter
  ).sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  // Fairness flag
  const flaggedDistrict = FAIRNESS_DATA.find((d) => d.flagged);

  // Stats
  const totalQueue = state.issues.filter((i) => i.status === "Submitted" || i.status === "Under Admin Review").length;
  const resolved = state.issues.filter((i) => i.status === "Resolved").length;
  const rejected = state.issues.filter((i) => i.status === "Rejected").length;
  const inProgress = state.issues.filter((i) => i.status === "In Progress").length;

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(243,156,61,0.12)", border: "1px solid rgba(243,156,61,0.25)" }}
        >
          <Shield size={17} style={{ color: "var(--accent-orange)" }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-primary)" }}>
            Admin Command View
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Issue review queue · ARIA-assisted prioritization
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "In Queue", value: totalQueue, color: "#f39c3d" },
          { label: "In Progress", value: inProgress, color: "#3fc6e8" },
          { label: "Resolved", value: resolved, color: "#4ade80" },
          { label: "Rejected", value: rejected, color: "#ef4444" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className="text-2xl font-bold mb-0.5" style={{ color: s.color, fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Fairness Flag */}
      {flaggedDistrict && (
        <div
          className="flex items-center gap-3 p-4 rounded-xl"
          style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          <Flag size={16} className="text-red-400 flex-shrink-0" />
          <div className="flex-1 text-xs">
            <span className="font-semibold text-red-400">Fairness Alert: </span>
            <span style={{ color: "var(--text-secondary)" }}>
              {flaggedDistrict.district} has a {flaggedDistrict.reportRejectionRate}% report rejection rate
              vs city avg 7%. ARIA recommends equity review before further rejections from this district.
            </span>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Filter:
        </p>
        {(["all", "Submitted", "Under Admin Review"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: filter === f ? "rgba(243,156,61,0.12)" : "transparent",
              color: filter === f ? "var(--accent-orange)" : "var(--text-secondary)",
              border: filter === f ? "1px solid rgba(243,156,61,0.3)" : "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {f === "all" ? `All Pending (${totalQueue})` : f}
          </button>
        ))}
      </div>

      {/* Queue */}
      <div className="space-y-3">
        {queue.length === 0 && (
          <div className="glass-card p-8 text-center">
            <CheckCircle size={24} className="mx-auto mb-2 opacity-30" style={{ color: "#4ade80" }} />
            <p style={{ color: "var(--text-muted)" }}>Queue is clear — no pending issues.</p>
          </div>
        )}
        {queue.map((issue) => (
          <ReviewCard
            key={issue.id}
            issue={issue}
            onApprove={(dept, notes) => approveAndRoute(issue.id, dept, notes)}
            onReject={(reason) => rejectIssue(issue.id, reason)}
            onInfo={(notes) => requestInfo(issue.id, notes)}
          />
        ))}
      </div>

      {/* Recently actioned */}
      <div className="glass-card p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
          RECENTLY ACTIONED
        </h2>
        <div className="space-y-2">
          {state.issues
            .filter((i) => !["Submitted", "Under Admin Review"].includes(i.status))
            .slice(0, 8)
            .map((issue) => (
              <div key={issue.id} className="flex items-center justify-between text-xs py-1.5 border-b" style={{ borderColor: "rgba(63,198,232,0.06)" }}>
                <span className="font-mono" style={{ color: "var(--text-muted)" }}>{issue.id}</span>
                <span style={{ color: "var(--text-secondary)" }} className="flex-1 mx-3 truncate">{issue.citizenName} · {issue.district}</span>
                <span className={`px-2 py-0.5 rounded border text-xs ${getStatusBg(issue.status)}`}>{issue.status}</span>
                <span className="ml-3" style={{ color: "var(--text-muted)" }}>{formatTimestamp(issue.updatedAt)}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
