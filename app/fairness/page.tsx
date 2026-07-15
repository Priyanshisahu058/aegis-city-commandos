"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Scale, AlertTriangle, Flag } from "lucide-react";
import { FAIRNESS_DATA, TRUST_HISTORY, ACCOUNTABILITY_LOG } from "@/lib/mockData";
import { formatTimestamp } from "@/lib/utils";

export default function FairnessPage() {
  const avgTrust = Math.round(TRUST_HISTORY.reduce((s, d) => s + d.trust, 0) / TRUST_HISTORY.length);
  const flagged = FAIRNESS_DATA.filter((d) => d.flagged);

  // Radial gauge component
  const radius = 70;
  const stroke = 12;
  const cx = 80;
  const cy = 80;
  const circumference = Math.PI * radius; // half circle
  const dash = (avgTrust / 100) * circumference;

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(155,89,212,0.12)", border: "1px solid rgba(155,89,212,0.25)" }}
        >
          <Scale size={17} style={{ color: "#9b59d4" }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-primary)" }}>
            Fairness & Trust Panel
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Equity monitoring · {flagged.length} district{flagged.length !== 1 ? "s" : ""} flagged for disproportionate impact
          </p>
        </div>
      </div>

      {/* Fairness Flag Alert */}
      {flagged.map((d) => (
        <div
          key={d.district}
          className="flex items-center gap-3 p-4 rounded-xl"
          style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          <AlertTriangle size={18} className="text-red-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-400">
              Equity Alert: {d.district}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
              Energy impact score {d.energyImpact}/100 · Service level {d.serviceLevel}/100 · Report rejection rate {d.reportRejectionRate}% (city avg: 7%)
            </p>
          </div>
          <span
            className="ml-auto text-xs px-2.5 py-1 rounded-lg font-semibold"
            style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)" }}
          >
            <Flag size={11} className="inline mr-1" />
            AUTO-FLAGGED
          </span>
        </div>
      ))}

      <div className="grid grid-cols-3 gap-5">
        {/* Trust Gauge */}
        <div className="glass-card p-5 flex flex-col items-center">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-4 self-start" style={{ color: "var(--text-muted)" }}>
            CITIZEN TRUST INDEX
          </h2>
          <svg width="160" height="100" viewBox="0 0 160 100">
            <path
              d={`M ${cx - radius},${cy} A ${radius},${radius} 0 0 1 ${cx + radius},${cy}`}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
            <path
              d={`M ${cx - radius},${cy} A ${radius},${radius} 0 0 1 ${cx + radius},${cy}`}
              fill="none"
              stroke={avgTrust >= 70 ? "#4ade80" : avgTrust >= 50 ? "#f39c3d" : "#ef4444"}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`}
              style={{ transition: "stroke-dasharray 1s ease" }}
            />
            <text x={cx} y={cy - 10} textAnchor="middle" fontSize="28" fontWeight="700" fill={avgTrust >= 70 ? "#4ade80" : avgTrust >= 50 ? "#f39c3d" : "#ef4444"} fontFamily="Space Grotesk, sans-serif">
              {avgTrust}
            </text>
            <text x={cx} y={cy + 10} textAnchor="middle" fontSize="11" fill="rgba(139,168,186,0.6)" fontFamily="Inter, sans-serif">
              / 100
            </text>
          </svg>
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>7-day citywide average</p>

          {/* 7-day trend */}
          <div className="w-full mt-4">
            <ResponsiveContainer width="100%" height={60}>
              <LineChart data={TRUST_HISTORY}>
                <Line type="monotone" dataKey="trust" stroke="#3fc6e8" strokeWidth={2} dot={false} />
                <XAxis dataKey="day" tick={{ fill: "rgba(139,168,186,0.5)", fontSize: 9 }} tickLine={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Energy Impact Bar */}
        <div className="col-span-2 glass-card p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
            ENERGY IMPACT BY DISTRICT (higher = worse)
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={FAIRNESS_DATA} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="district" tick={{ fill: "rgba(139,168,186,0.6)", fontSize: 9 }} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: "rgba(139,168,186,0.6)", fontSize: 9 }} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "rgba(22,20,54,0.95)",
                  border: "1px solid rgba(63,198,232,0.3)",
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: "#e8f4f8",
                }}
              />
              <Bar
                dataKey="energyImpact"
                name="Energy Impact"
                radius={[4, 4, 0, 0]}
                fill="#3fc6e8"
                label={false}
              >
                {FAIRNESS_DATA.map((entry) => (
                  <rect
                    key={entry.district}
                    fill={entry.flagged ? "#ef4444" : "#3fc6e8"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            🔴 Red bar = auto-flagged district (Industrial Fringe)
          </p>
        </div>
      </div>

      {/* Service Level Comparison */}
      <div className="glass-card p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
          SERVICE LEVEL vs. REPORT REJECTION RATE BY DISTRICT
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {FAIRNESS_DATA.map((d) => (
            <div
              key={d.district}
              className="p-3 rounded-xl"
              style={{
                background: d.flagged ? "rgba(239,68,68,0.06)" : "rgba(255,255,255,0.03)",
                border: d.flagged ? "1px solid rgba(239,68,68,0.2)" : "1px solid rgba(63,198,232,0.08)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold" style={{ color: d.flagged ? "#ef4444" : "var(--text-primary)" }}>
                  {d.district}
                </p>
                {d.flagged && <Flag size={11} className="text-red-400" />}
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-muted)" }}>Service</span>
                  <span style={{ color: d.serviceLevel >= 70 ? "#4ade80" : d.serviceLevel >= 50 ? "#f39c3d" : "#ef4444" }}>
                    {d.serviceLevel}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-muted)" }}>Rejection</span>
                  <span style={{ color: d.reportRejectionRate > 15 ? "#ef4444" : "var(--text-secondary)" }}>
                    {d.reportRejectionRate}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accountability Log */}
      <div className="glass-card p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
          ACCOUNTABILITY LOG — HUMAN OVERRIDES & DECISIONS
        </h2>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b" style={{ borderColor: "rgba(63,198,232,0.08)", color: "var(--text-muted)" }}>
              <th className="text-left py-2 px-3 font-semibold">Action</th>
              <th className="text-left py-2 px-3 font-semibold">Actor</th>
              <th className="text-left py-2 px-3 font-semibold">District</th>
              <th className="text-left py-2 px-3 font-semibold">Justification</th>
              <th className="text-left py-2 px-3 font-semibold">Time</th>
            </tr>
          </thead>
          <tbody>
            {ACCOUNTABILITY_LOG.map((entry) => (
              <tr key={entry.id} className="border-b" style={{ borderColor: "rgba(63,198,232,0.04)" }}>
                <td className="py-2.5 px-3 font-medium" style={{ color: "var(--text-primary)" }}>{entry.action}</td>
                <td className="py-2.5 px-3" style={{ color: "var(--accent-cyan)" }}>{entry.actor}</td>
                <td className="py-2.5 px-3" style={{ color: "var(--text-secondary)" }}>{entry.district ?? "—"}</td>
                <td className="py-2.5 px-3 max-w-xs" style={{ color: "var(--text-secondary)" }}>{entry.justification}</td>
                <td className="py-2.5 px-3 font-mono" style={{ color: "var(--text-muted)" }}>{formatTimestamp(entry.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
