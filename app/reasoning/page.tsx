"use client";

import { useState } from "react";
import { useIssueStore } from "@/lib/issueStore";
import { getConfidenceBg, formatTimestamp } from "@/lib/utils";
import type { ARIALogEntry } from "@/lib/types";
import { Brain, AlertTriangle, RotateCcw } from "lucide-react";

type Filter = "all" | "high" | "low" | "overridden";

export default function ReasoningPage() {
  const { state } = useIssueStore();
  const [filter, setFilter] = useState<Filter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = state.ariaLog.filter((entry) => {
    if (filter === "high") return entry.confidence >= 80;
    if (filter === "low") return entry.confidence < 65;
    if (filter === "overridden") return entry.overridden;
    return true;
  });

  const CATEGORY_COLORS: Record<string, string> = {
    energy: "#3fc6e8",
    routing: "#9b59d4",
    emergency: "#ef4444",
    issue: "#f39c3d",
    override: "#facc15",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(155,89,212,0.12)", border: "1px solid rgba(155,89,212,0.25)" }}
          >
            <Brain size={17} style={{ color: "#9b59d4" }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-primary)" }}>
              ARIA Reasoning Log
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Explainable AI decision timeline — {state.ariaLog.length} entries
            </p>
          </div>
        </div>
        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(63,198,232,0.1)" }}>
          {(["all", "high", "low", "overridden"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: filter === f ? "rgba(63,198,232,0.12)" : "transparent",
                color: filter === f ? "var(--accent-cyan)" : "var(--text-secondary)",
                border: filter === f ? "1px solid rgba(63,198,232,0.3)" : "1px solid transparent",
              }}
            >
              {f === "all" ? "All" : f === "high" ? "High Confidence" : f === "low" ? "Low Confidence" : "Overridden"}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div
          className="absolute left-5 top-0 bottom-0 w-px"
          style={{ background: "rgba(63,198,232,0.12)" }}
        />
        <div className="space-y-3">
          {filtered.map((entry) => (
            <div
              key={entry.id}
              className="relative pl-12 cursor-pointer"
              onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
            >
              {/* Timeline dot */}
              <div
                className="absolute left-3.5 top-4 w-3 h-3 rounded-full border-2"
                style={{
                  background: entry.overridden ? "#facc15" : CATEGORY_COLORS[entry.category] ?? "#3fc6e8",
                  borderColor: "var(--bg-deep)",
                }}
              />
              <div
                className="glass-card p-4 transition-all"
                style={{
                  borderColor: expandedId === entry.id ? "rgba(63,198,232,0.3)" : undefined,
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span
                        className="text-xs px-2 py-0.5 rounded font-medium"
                        style={{
                          background: `${CATEGORY_COLORS[entry.category] ?? "#3fc6e8"}15`,
                          color: CATEGORY_COLORS[entry.category] ?? "#3fc6e8",
                          border: `1px solid ${CATEGORY_COLORS[entry.category] ?? "#3fc6e8"}30`,
                        }}
                      >
                        {entry.category.toUpperCase()}
                      </span>
                      {entry.overridden && (
                        <span className="text-xs px-2 py-0.5 rounded font-medium bg-yellow-400/10 border border-yellow-400/25 text-yellow-400 flex items-center gap-1">
                          <RotateCcw size={10} />
                          OVERRIDDEN
                        </span>
                      )}
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {formatTimestamp(entry.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {entry.action}
                    </p>
                    {expandedId === entry.id && (
                      <div className="mt-3 space-y-2">
                        <div
                          className="p-3 rounded-lg text-xs"
                          style={{ background: "rgba(63,198,232,0.04)", border: "1px solid rgba(63,198,232,0.1)" }}
                        >
                          <p className="font-semibold mb-1" style={{ color: "var(--accent-cyan)" }}>Reasoning</p>
                          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>{entry.reasoning}</p>
                        </div>
                        <div
                          className="p-3 rounded-lg text-xs"
                          style={{ background: "rgba(243,156,61,0.04)", border: "1px solid rgba(243,156,61,0.1)" }}
                        >
                          <p className="font-semibold mb-1" style={{ color: "var(--accent-orange)" }}>Alternative Considered</p>
                          <p style={{ color: "var(--text-secondary)" }}>{entry.alternativeConsidered}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Confidence Badge */}
                  <div
                    className={`text-xs px-2.5 py-1 rounded-lg border font-bold flex-shrink-0 ${getConfidenceBg(entry.confidence)}`}
                  >
                    {entry.confidence}%
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="glass-card p-8 text-center">
              <AlertTriangle size={24} className="mx-auto mb-2 opacity-40" style={{ color: "var(--text-muted)" }} />
              <p style={{ color: "var(--text-muted)" }}>No entries match this filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
