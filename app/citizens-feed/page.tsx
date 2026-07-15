"use client";

import { useState } from "react";
import { CITIZEN_FEED } from "@/lib/mockData";
import { MessageSquare, Search, ThumbsUp, ThumbsDown, Minus } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";
import type { Sentiment } from "@/lib/types";

const SENTIMENT_STYLES: Record<Sentiment, { icon: React.ElementType; cls: string }> = {
  positive: { icon: ThumbsUp, cls: "text-green-400 bg-green-400/10 border-green-400/25" },
  neutral: { icon: Minus, cls: "text-yellow-400 bg-yellow-400/10 border-yellow-400/25" },
  negative: { icon: ThumbsDown, cls: "text-red-400 bg-red-400/10 border-red-400/25" },
};

const CATEGORIES = ["all", "energy", "traffic", "safety", "other"];

export default function CitizensFeedPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sentiment, setSentiment] = useState<"all" | Sentiment>("all");

  const filtered = CITIZEN_FEED.filter((r) => {
    const matchSearch = r.message.toLowerCase().includes(search.toLowerCase()) || r.citizen.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || r.category === category;
    const matchSentiment = sentiment === "all" || r.sentiment === sentiment;
    return matchSearch && matchCategory && matchSentiment;
  });

  const positiveCount = CITIZEN_FEED.filter((r) => r.sentiment === "positive").length;
  const negativeCount = CITIZEN_FEED.filter((r) => r.sentiment === "negative").length;
  const neutralCount = CITIZEN_FEED.filter((r) => r.sentiment === "neutral").length;

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(63,198,232,0.12)", border: "1px solid rgba(63,198,232,0.25)" }}
        >
          <MessageSquare size={17} style={{ color: "var(--accent-cyan)" }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-primary)" }}>
            Citizen Reports Feed
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {CITIZEN_FEED.length} community reports · Sentiment analysis by ARIA
          </p>
        </div>
      </div>

      {/* Sentiment Overview */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Positive", count: positiveCount, color: "#4ade80", pct: Math.round((positiveCount / CITIZEN_FEED.length) * 100) },
          { label: "Neutral", count: neutralCount, color: "#facc15", pct: Math.round((neutralCount / CITIZEN_FEED.length) * 100) },
          { label: "Negative", count: negativeCount, color: "#ef4444", pct: Math.round((negativeCount / CITIZEN_FEED.length) * 100) },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold" style={{ color: s.color }}>{s.label}</span>
              <span className="text-2xl font-bold" style={{ color: s.color, fontFamily: "'Space Grotesk', sans-serif" }}>{s.count}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${s.pct}%`, background: s.color }} />
            </div>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{s.pct}% of total</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-48">
          <Search size={14} style={{ color: "var(--text-muted)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports…"
            className="flex-1 bg-transparent text-sm focus:outline-none"
            style={{ color: "var(--text-primary)" }}
          />
        </div>
        <div className="flex items-center gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
              style={{
                background: category === c ? "rgba(63,198,232,0.12)" : "transparent",
                color: category === c ? "var(--accent-cyan)" : "var(--text-secondary)",
                border: category === c ? "1px solid rgba(63,198,232,0.3)" : "1px solid transparent",
              }}
            >
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          {(["all", "positive", "neutral", "negative"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSentiment(s)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
              style={{
                background: sentiment === s ? "rgba(63,198,232,0.1)" : "transparent",
                color: sentiment === s ? "var(--accent-cyan)" : "var(--text-secondary)",
                border: sentiment === s ? "1px solid rgba(63,198,232,0.25)" : "1px solid transparent",
              }}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-3">
        {filtered.map((report) => {
          const sent = SENTIMENT_STYLES[report.sentiment];
          const SentIcon = sent.icon;
          return (
            <div key={report.id} className="glass-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: "rgba(63,198,232,0.12)", color: "var(--accent-cyan)" }}
                    >
                      {report.citizen.charAt(0)}
                    </div>
                    <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{report.citizen}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ background: "rgba(63,198,232,0.08)", color: "var(--accent-cyan)", border: "1px solid rgba(63,198,232,0.15)" }}
                    >
                      {report.district}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ background: "rgba(155,89,212,0.08)", color: "#9b59d4", border: "1px solid rgba(155,89,212,0.15)" }}
                    >
                      {report.category}
                    </span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {formatTimestamp(report.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {report.message}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-lg border flex-shrink-0 flex items-center gap-1 ${sent.cls}`}>
                  <SentIcon size={11} />
                  {report.sentiment}
                </span>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="glass-card p-8 text-center">
            <p style={{ color: "var(--text-muted)" }}>No reports match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
