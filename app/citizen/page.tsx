"use client";

import { useState } from "react";
import { useIssueStore, useIssueActions } from "@/lib/issueStore";
import { User, Plus, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import { formatTimestamp, getStatusBg } from "@/lib/utils";
import type { IssueCategory, UrgencyLevel, IssueStatus } from "@/lib/types";

const STAGES: IssueStatus[] = [
  "Submitted",
  "Under Admin Review",
  "Approved & Routed",
  "In Progress",
  "Resolved",
];

const DISTRICTS = ["Central Hub", "Northgate", "Eastport", "Southvale", "Westbridge", "Midtown", "Harbor Zone", "Industrial Fringe"];

function ProgressTracker({ status }: { status: IssueStatus }) {
  if (status === "Rejected") {
    return (
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs px-2 py-0.5 rounded-lg border bg-red-400/10 border-red-400/25 text-red-400">
          ✗ Rejected
        </span>
      </div>
    );
  }
  const currentIdx = STAGES.indexOf(status);
  return (
    <div className="flex items-center gap-1 mt-2">
      {STAGES.map((stage, i) => {
        const done = i <= currentIdx;
        const active = i === currentIdx;
        return (
          <div key={stage} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center border transition-all"
                style={{
                  background: done ? "rgba(63,198,232,0.2)" : "rgba(255,255,255,0.04)",
                  borderColor: done ? "var(--accent-cyan)" : "rgba(255,255,255,0.1)",
                  boxShadow: active ? "0 0 8px rgba(63,198,232,0.4)" : "none",
                }}
              >
                {done && <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent-cyan)" }} />}
              </div>
              <span className="text-xs mt-1 text-center" style={{ color: done ? "var(--accent-cyan)" : "var(--text-muted)", fontSize: "9px", maxWidth: "60px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {stage === "Under Admin Review" ? "Admin Review" : stage === "Approved & Routed" ? "Routed" : stage}
              </span>
            </div>
            {i < STAGES.length - 1 && (
              <div
                className="h-px w-6 mb-4"
                style={{ background: i < currentIdx ? "var(--accent-cyan)" : "rgba(255,255,255,0.08)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function CitizenPage() {
  const { state } = useIssueStore();
  const { submitIssue } = useIssueActions();
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [category, setCategory] = useState<IssueCategory>("energy");
  const [district, setDistrict] = useState("Central Hub");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState<UrgencyLevel>(3);

  const myIssues = state.issues.filter((i) => i.citizenId === state.citizenId);
  const activeCount = myIssues.filter((i) => !["Resolved", "Rejected"].includes(i.status)).length;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;
    submitIssue({
      citizenId: state.citizenId,
      citizenName: "Maya Chen",
      category,
      district,
      description,
      urgency,
      routedTo: null,
    });
    setDescription("");
    setUrgency(3);
    setShowForm(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  const trustIndex = 74;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(63,198,232,0.12)", border: "1px solid rgba(63,198,232,0.25)" }}
          >
            <User size={17} style={{ color: "var(--accent-cyan)" }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-primary)" }}>
              Citizen Portal
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Logged in as Maya Chen · {activeCount} active issue{activeCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Trust Index Widget */}
        <div className="glass-card px-4 py-2.5 flex items-center gap-3">
          <div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Your District Trust</p>
            <p className="text-xl font-bold" style={{ color: "var(--accent-cyan)", fontFamily: "'Space Grotesk', sans-serif" }}>
              {trustIndex}
            </p>
          </div>
          <div className="w-16 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="h-full rounded-full" style={{ width: `${trustIndex}%`, background: "var(--accent-cyan)" }} />
          </div>
        </div>
      </div>

      {/* Success toast */}
      {submitted && (
        <div
          className="flex items-center gap-2 p-3 rounded-xl text-sm"
          style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ade80" }}
        >
          <CheckCircle size={16} />
          Issue submitted! ARIA is scoring it now — check your reports below.
        </div>
      )}

      {/* Report Form */}
      <div className="glass-card overflow-hidden">
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full flex items-center justify-between px-5 py-4"
          style={{ color: "var(--text-primary)" }}
        >
          <div className="flex items-center gap-2">
            <Plus size={16} style={{ color: "var(--accent-cyan)" }} />
            <span className="font-semibold">Report an Issue</span>
          </div>
          {showForm ? <ChevronUp size={16} style={{ color: "var(--text-muted)" }} /> : <ChevronDown size={16} style={{ color: "var(--text-muted)" }} />}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="px-5 pb-5 space-y-4 border-t" style={{ borderColor: "rgba(63,198,232,0.1)" }}>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--text-muted)" }}>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as IssueCategory)}
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(63,198,232,0.2)", color: "var(--text-primary)" }}
                >
                  <option value="energy" style={{ background: "#14132b" }}>Energy</option>
                  <option value="traffic" style={{ background: "#14132b" }}>Traffic</option>
                  <option value="safety" style={{ background: "#14132b" }}>Safety</option>
                  <option value="other" style={{ background: "#14132b" }}>Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--text-muted)" }}>District</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(63,198,232,0.2)", color: "var(--text-primary)" }}
                >
                  {DISTRICTS.map((d) => <option key={d} value={d} style={{ background: "#14132b" }}>{d}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--text-muted)" }}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe the issue in detail…"
                className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none resize-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(63,198,232,0.2)", color: "var(--text-primary)" }}
              />
            </div>

            <div>
              <label className="text-xs font-medium flex justify-between mb-1.5" style={{ color: "var(--text-muted)" }}>
                <span>Urgency</span>
                <span style={{ color: urgency >= 4 ? "#ef4444" : urgency === 3 ? "#f39c3d" : "#4ade80" }}>
                  {urgency === 1 ? "Low" : urgency === 2 ? "Moderate" : urgency === 3 ? "Medium" : urgency === 4 ? "High" : "Critical"} ({urgency}/5)
                </span>
              </label>
              <input
                type="range" min={1} max={5} value={urgency}
                onChange={(e) => setUrgency(Number(e.target.value) as UrgencyLevel)}
                className="w-full" style={{ accentColor: urgency >= 4 ? "#ef4444" : urgency === 3 ? "#f39c3d" : "var(--accent-cyan)" }}
              />
            </div>

            <button type="submit" className="btn-cyan w-full py-2">
              Submit Issue to ARIA Queue
            </button>
          </form>
        )}
      </div>

      {/* My Reports */}
      <div>
        <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>
          MY REPORTS ({myIssues.length})
        </h2>
        <div className="space-y-3">
          {myIssues.length === 0 && (
            <div className="glass-card p-8 text-center">
              <p style={{ color: "var(--text-muted)" }}>No reports yet. Submit an issue above.</p>
            </div>
          )}
          {myIssues.map((issue) => (
            <div key={issue.id} className="glass-card p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{issue.id}</span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded font-medium"
                      style={{ background: "rgba(155,89,212,0.1)", color: "#9b59d4", border: "1px solid rgba(155,89,212,0.2)" }}
                    >
                      {issue.category}
                    </span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{issue.district}</span>
                  </div>
                  <p className="text-sm" style={{ color: "var(--text-primary)" }}>{issue.description}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-lg border font-medium flex-shrink-0 ${getStatusBg(issue.status)}`}>
                  {issue.status}
                </span>
              </div>

              <ProgressTracker status={issue.status} />

              {issue.rejectionReason && (
                <div
                  className="mt-2 p-2 rounded-lg text-xs"
                  style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", color: "#fca5a5" }}
                >
                  Rejection reason: {issue.rejectionReason}
                </div>
              )}

              {issue.assignedResource && (
                <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                  Assigned resource: <span style={{ color: "var(--accent-cyan)" }}>{issue.assignedResource}</span>
                </p>
              )}

              <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                Submitted {formatTimestamp(issue.submittedAt)} · Updated {formatTimestamp(issue.updatedAt)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
