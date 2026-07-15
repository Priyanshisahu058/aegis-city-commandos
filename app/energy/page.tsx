import DistrictTable from "@/components/energy/DistrictTable";
import { Zap } from "lucide-react";

export default function EnergyPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(63,198,232,0.12)", border: "1px solid rgba(63,198,232,0.25)" }}
        >
          <Zap size={17} style={{ color: "var(--accent-cyan)" }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-primary)" }}>
            Energy Grid
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
            District-level load management · Approve, override or negotiate ARIA actions
          </p>
        </div>
      </div>
      <DistrictTable />
    </div>
  );
}
