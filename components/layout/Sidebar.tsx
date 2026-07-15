"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Zap,
  Brain,
  FlaskConical,
  Scale,
  Radio,
  MessageSquare,
  User,
  Shield,
  Landmark,
  ChevronRight,
} from "lucide-react";
import { useIssueStore } from "@/lib/issueStore";

const NAV_ITEMS = [
  { href: "/", label: "Overview", icon: LayoutDashboard, group: "main" },
  { href: "/energy", label: "Energy Grid", icon: Zap, group: "main" },
  { href: "/reasoning", label: "ARIA Reasoning", icon: Brain, group: "main" },
  { href: "/simulator", label: "Digital Twin", icon: FlaskConical, group: "main" },
  { href: "/fairness", label: "Fairness & Trust", icon: Scale, group: "main" },
  { href: "/emergency", label: "Emergency Mesh", icon: Radio, group: "main" },
  { href: "/citizens-feed", label: "Citizen Reports", icon: MessageSquare, group: "main" },
  { href: "/citizen", label: "Citizen View", icon: User, group: "roles" },
  { href: "/admin", label: "Admin View", icon: Shield, group: "roles" },
  { href: "/official", label: "Gov. Official", icon: Landmark, group: "roles" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { state } = useIssueStore();

  const pendingAdmin = state.issues.filter(
    (i) => i.status === "Submitted" || i.status === "Under Admin Review"
  ).length;

  const pendingOfficial = state.issues.filter(
    (i) => i.status === "Approved & Routed"
  ).length;

  return (
    <aside
      className="w-60 flex-shrink-0 flex flex-col border-r overflow-y-auto"
      style={{
        background: "rgba(14, 13, 35, 0.95)",
        borderColor: "rgba(63, 198, 232, 0.12)",
      }}
    >
      {/* Logo */}
      <div className="p-5 border-b" style={{ borderColor: "rgba(63, 198, 232, 0.12)" }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{
              background: "linear-gradient(135deg, #3fc6e8, #9b59d4)",
              boxShadow: "0 0 16px rgba(63, 198, 232, 0.35)",
            }}
          >
            A
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest" style={{ color: "var(--accent-cyan)", fontFamily: "'Space Grotesk', sans-serif" }}>
              AEGIS CITY
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              ARIA Command v2.4
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest px-2 py-1.5" style={{ color: "var(--text-muted)" }}>
          Dashboard
        </p>
        {NAV_ITEMS.filter((i) => i.group === "main").map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item flex items-center gap-3 px-3 py-2.5 text-sm ${active ? "active" : ""}`}
              style={{ color: active ? "var(--accent-cyan)" : "var(--text-secondary)" }}
            >
              <Icon size={15} />
              <span>{item.label}</span>
              {active && <ChevronRight size={12} className="ml-auto opacity-60" />}
            </Link>
          );
        })}

        <div className="pt-3" />
        <p className="text-xs font-semibold uppercase tracking-widest px-2 py-1.5" style={{ color: "var(--text-muted)" }}>
          Role Views
        </p>
        {NAV_ITEMS.filter((i) => i.group === "roles").map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          const badge =
            item.href === "/admin"
              ? pendingAdmin
              : item.href === "/official"
              ? pendingOfficial
              : 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item flex items-center gap-3 px-3 py-2.5 text-sm ${active ? "active" : ""}`}
              style={{ color: active ? "var(--accent-cyan)" : "var(--text-secondary)" }}
            >
              <Icon size={15} />
              <span>{item.label}</span>
              {badge > 0 && (
                <span
                  className="ml-auto text-xs font-bold rounded-full px-1.5 py-0.5 min-w-5 text-center"
                  style={{
                    background: "rgba(243, 156, 61, 0.2)",
                    color: "var(--accent-orange)",
                    border: "1px solid rgba(243, 156, 61, 0.3)",
                  }}
                >
                  {badge}
                </span>
              )}
              {active && !badge && <ChevronRight size={12} className="ml-auto opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* System Status */}
      <div className="p-3 border-t" style={{ borderColor: "rgba(63, 198, 232, 0.12)" }}>
        <div
          className="glass-card p-3 space-y-2"
          style={{ background: "rgba(63, 198, 232, 0.04)" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full status-blink"
              style={{ background: "#4ade80" }}
            />
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
              ARIA Online
            </span>
          </div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>
            {state.issues.filter((i) => i.status === "In Progress").length} active
            · {state.issues.filter((i) => i.status === "Submitted").length} queued
          </div>
        </div>
      </div>
    </aside>
  );
}
