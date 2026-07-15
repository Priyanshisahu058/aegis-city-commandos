"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ENERGY_DATA } from "@/lib/mockData";

interface LoadChartProps {
  districtId: string;
  districtName: string;
}

export default function LoadChart({ districtId, districtName }: LoadChartProps) {
  const data = ENERGY_DATA[districtId] ?? [];

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
        24-Hour Load — {districtName}
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3fc6e8" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3fc6e8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="time"
            tick={{ fill: "rgba(139,168,186,0.6)", fontSize: 9 }}
            tickLine={false}
            interval={5}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "rgba(139,168,186,0.6)", fontSize: 9 }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(22,20,54,0.95)",
              border: "1px solid rgba(63,198,232,0.3)",
              borderRadius: "8px",
              fontSize: "11px",
              color: "#e8f4f8",
            }}
            formatter={(v) => [`${Number(v ?? 0)}%`, "Load"]}
          />
          <Area
            type="monotone"
            dataKey="load"
            stroke="#3fc6e8"
            strokeWidth={2}
            fill="url(#loadGrad)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
