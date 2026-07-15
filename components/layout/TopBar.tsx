"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AlertTriangle, Clock, User, Shield, Landmark } from "lucide-react";
import { useIssueStore, useIssueActions } from "@/lib/issueStore";
import { formatTime, formatDate } from "@/lib/utils";
import type { UserRole } from "@/lib/types";

const ROLE_CONFIG: Record<UserRole, { label: string; icon: React.ElementType; href: string; color: string }> = {
  citizen: { label: "Citizen", icon: User, href: "/citizen", color: "#3fc6e8" },
  admin: { label: "Admin", icon: Shield, href: "/admin", color: "#f39c3d" },
  official: { label: "Gov. Official", icon: Landmark, href: "/official", color: "#9b59d4" },
};

export default function TopBar() {
  const [now, setNow] = useState(new Date());
  const { state } = useIssueStore();
  const { setRole } = useIssueActions();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  function handleRoleSwitch(role: UserRole) {
    setRole(role);
    router.push(ROLE_CONFIG[role].href);
  }

  return (
    <header
      className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0"
      style={{
        background: "rgba(14, 13, 35, 0.92)",
        borderColor: "rgba(63, 198, 232, 0.12)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Left — Risk Alert */}
      <div
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg"
        style={{
          background: "rgba(239, 68, 68, 0.08)",
          border: "1px solid rgba(239, 68, 68, 0.25)",
        }}
      >
        <div className="pulse-dot relative">
          <div
            className="w-2 h-2 rounded-full status-blink"
            style={{ background: "#ef4444" }}
          />
        </div>
        <AlertTriangle size={13} className="text-red-400" />
        <span className="text-xs font-medium text-red-400">
          PREDICTIVE RISK: 68% cascade — District 4, ~3hr
        </span>
      </div>

      {/* Center — Role Switcher */}
      <div
        className="flex items-center gap-1 p-1 rounded-xl"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(63,198,232,0.12)",
        }}
      >
        {(Object.keys(ROLE_CONFIG) as UserRole[]).map((role) => {
          const cfg = ROLE_CONFIG[role];
          const Icon = cfg.icon;
          const active = state.role === role;
          return (
            <button
              key={role}
              onClick={() => handleRoleSwitch(role)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
              style={{
                background: active ? `${cfg.color}18` : "transparent",
                color: active ? cfg.color : "var(--text-secondary)",
                border: active ? `1px solid ${cfg.color}40` : "1px solid transparent",
              }}
            >
              <Icon size={13} />
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Right — Time + Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
          <Clock size={13} />
          <span className="font-mono" style={{ color: "var(--accent-cyan)" }}>
            {formatTime(now)}
          </span>
          <span style={{ color: "var(--text-muted)" }}>{formatDate(now)}</span>
        </div>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs"
          style={{
            background: "rgba(74, 222, 128, 0.08)",
            border: "1px solid rgba(74, 222, 128, 0.2)",
            color: "#4ade80",
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full status-blink" style={{ background: "#4ade80" }} />
          ARIA ONLINE
        </div>
      </div>
    </header>
  );
}
