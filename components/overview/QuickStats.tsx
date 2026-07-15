"use client";

import { useEffect, useState } from "react";
import { Zap, AlertTriangle, Heart, Cpu } from "lucide-react";
import { DISTRICTS } from "@/lib/mockData";

interface Stat {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  color: string;
  trend: "up" | "down" | "stable";
}

export default function QuickStats() {
  const [gridLoad, setGridLoad] = useState(
    Math.round(DISTRICTS.reduce((s, d) => s + d.load, 0) / DISTRICTS.length)
  );
  const [trustIndex, setTrustIndex] = useState(
    Math.round(DISTRICTS.reduce((s, d) => s + d.trustIndex, 0) / DISTRICTS.length)
  );

  useEffect(() => {
    const t = setInterval(() => {
      setGridLoad((prev) => Math.min(100, Math.max(50, prev + Math.round((Math.random() - 0.5) * 2))));
      setTrustIndex((prev) => Math.min(100, Math.max(30, prev + Math.round((Math.random() - 0.5) * 1))));
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const stats: Stat[] = [
    {
      label: "Grid Load Avg",
      value: `${gridLoad}%`,
      sub: "Citywide average",
      icon: Zap,
      color: gridLoad > 80 ? "#ef4444" : gridLoad > 65 ? "#f39c3d" : "#4ade80",
      trend: gridLoad > 80 ? "up" : "stable",
    },
    {
      label: "Active Incidents",
      value: "5",
      sub: "2 critical · 3 high",
      icon: AlertTriangle,
      color: "#f39c3d",
      trend: "up",
    },
    {
      label: "Citizen Trust Index",
      value: `${trustIndex}`,
      sub: "↑ 3pts vs yesterday",
      icon: Heart,
      color: "#3fc6e8",
      trend: "up",
    },
    {
      label: "ARIA Confidence Avg",
      value: "81%",
      sub: "Across 15 decisions",
      icon: Cpu,
      color: "#9b59d4",
      trend: "stable",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="glass-card p-4">
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: `${stat.color}18`, border: `1px solid ${stat.color}30` }}
              >
                <Icon size={17} style={{ color: stat.color }} />
              </div>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {stat.trend === "up" ? "↑" : stat.trend === "down" ? "↓" : "—"}
              </span>
            </div>
            <p className="text-2xl font-bold mb-0.5" style={{ color: stat.color, fontFamily: "'Space Grotesk', sans-serif" }}>
              {stat.value}
            </p>
            <p className="text-xs font-medium mb-0.5" style={{ color: "var(--text-primary)" }}>
              {stat.label}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {stat.sub}
            </p>
          </div>
        );
      })}
    </div>
  );
}
