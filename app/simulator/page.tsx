"use client";

import { useState } from "react";
import { DISTRICTS } from "@/lib/mockData";
import { FlaskConical, Play, RotateCcw } from "lucide-react";
import type { SimulationResult } from "@/lib/types";

export default function SimulatorPage() {
  const [districtId, setDistrictId] = useState("d3");
  const [reroute, setReroute] = useState(15);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [running, setRunning] = useState(false);

  const selectedDistrict = DISTRICTS.find((d) => d.id === districtId)!;

  function runSim() {
    setRunning(true);
    setResult(null);
    setTimeout(() => {
      const simLoad = Math.max(0, selectedDistrict.load - reroute);
      const simRisk = Math.max(0, Math.round(selectedDistrict.load * 0.8 - reroute * 1.2));
      setResult({
        district: selectedDistrict.name,
        currentLoad: selectedDistrict.load,
        simulatedLoad: simLoad,
        currentRisk: Math.round(selectedDistrict.load * 0.9),
        simulatedRisk: simRisk,
        etaToStability: simLoad < 60 ? "~8 min" : simLoad < 75 ? "~22 min" : "~47 min",
      });
      setRunning(false);
    }, 1500);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(63,198,232,0.12)", border: "1px solid rgba(63,198,232,0.25)" }}
        >
          <FlaskConical size={17} style={{ color: "var(--accent-cyan)" }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--text-primary)" }}>
            Digital Twin Simulator
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Non-destructive sandbox — changes are not applied to the live grid
          </p>
        </div>
        <div
          className="ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={{ background: "rgba(250,204,21,0.08)", border: "1px solid rgba(250,204,21,0.2)", color: "#facc15" }}
        >
          ⚠ SIMULATION MODE — NOT APPLIED
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Controls */}
        <div className="glass-card p-6 space-y-5">
          <h2 className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
            SIMULATION PARAMETERS
          </h2>

          {/* District picker */}
          <div>
            <label className="text-xs font-medium block mb-2" style={{ color: "var(--text-muted)" }}>
              Select District
            </label>
            <select
              value={districtId}
              onChange={(e) => { setDistrictId(e.target.value); setResult(null); }}
              className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(63,198,232,0.2)",
                color: "var(--text-primary)",
              }}
            >
              {DISTRICTS.map((d) => (
                <option key={d.id} value={d.id} style={{ background: "#14132b" }}>
                  {d.name} — {d.load}% load ({d.status})
                </option>
              ))}
            </select>
          </div>

          {/* District current state */}
          <div
            className="p-3 rounded-lg space-y-1.5 text-xs"
            style={{ background: "rgba(63,198,232,0.04)", border: "1px solid rgba(63,198,232,0.1)" }}
          >
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>Current Load</span>
              <span style={{ color: selectedDistrict.load > 80 ? "#ef4444" : "#f39c3d" }}>{selectedDistrict.load}%</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>Status</span>
              <span style={{ color: "var(--text-primary)" }}>{selectedDistrict.status}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>Population</span>
              <span style={{ color: "var(--text-primary)" }}>{selectedDistrict.population.toLocaleString()}</span>
            </div>
          </div>

          {/* Reroute slider */}
          <div>
            <label className="text-xs font-medium flex justify-between mb-2" style={{ color: "var(--text-muted)" }}>
              <span>Reroute Load %</span>
              <span style={{ color: "var(--accent-cyan)" }}>{reroute}%</span>
            </label>
            <input
              type="range"
              min={0}
              max={50}
              value={reroute}
              onChange={(e) => { setReroute(Number(e.target.value)); setResult(null); }}
              className="w-full accent-cyan-400"
              style={{ accentColor: "var(--accent-cyan)" }}
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              <span>0%</span>
              <span>50%</span>
            </div>
          </div>

          {/* Target load preview */}
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Projected load after reroute:{" "}
            <span
              className="font-bold"
              style={{
                color: Math.max(0, selectedDistrict.load - reroute) > 80 ? "#ef4444"
                  : Math.max(0, selectedDistrict.load - reroute) > 65 ? "#f39c3d"
                  : "#4ade80",
              }}
            >
              {Math.max(0, selectedDistrict.load - reroute)}%
            </span>
          </div>

          {/* Run button */}
          <button
            onClick={runSim}
            disabled={running}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all"
            style={{
              background: running ? "rgba(63,198,232,0.06)" : "rgba(63,198,232,0.15)",
              border: "1px solid rgba(63,198,232,0.35)",
              color: "var(--accent-cyan)",
            }}
          >
            {running ? (
              <>
                <RotateCcw size={15} className="animate-spin" />
                Running simulation…
              </>
            ) : (
              <>
                <Play size={15} />
                Run Simulation
              </>
            )}
          </button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {result ? (
            <>
              <div className="glass-card p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
                  BEFORE vs AFTER — {result.district}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Current */}
                  <div
                    className="p-4 rounded-xl space-y-3"
                    style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}
                  >
                    <p className="text-xs font-semibold text-red-400">CURRENT STATE</p>
                    <div>
                      <p className="text-3xl font-bold text-red-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {result.currentLoad}%
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Grid Load</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-red-300">{result.currentRisk}%</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>Risk Score</p>
                    </div>
                  </div>
                  {/* Simulated */}
                  <div
                    className="p-4 rounded-xl space-y-3"
                    style={{
                      background: "rgba(74,222,128,0.06)",
                      border: "1px solid rgba(74,222,128,0.15)",
                    }}
                  >
                    <p className="text-xs font-semibold text-green-400">SIMULATED STATE</p>
                    <div>
                      <p className="text-3xl font-bold text-green-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {result.simulatedLoad}%
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Grid Load</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-green-300">{result.simulatedRisk}%</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>Risk Score</p>
                    </div>
                  </div>
                </div>

                <div
                  className="mt-4 p-3 rounded-lg flex items-center justify-between text-sm"
                  style={{ background: "rgba(63,198,232,0.06)", border: "1px solid rgba(63,198,232,0.15)" }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>ETA to Stability</span>
                  <span className="font-bold" style={{ color: "var(--accent-cyan)" }}>{result.etaToStability}</span>
                </div>
              </div>

              <div
                className="glass-card p-4 text-xs"
                style={{ background: "rgba(250,204,21,0.04)", borderColor: "rgba(250,204,21,0.15)" }}
              >
                <p className="font-semibold text-yellow-400 mb-1">⚠ Simulation Mode</p>
                <p style={{ color: "var(--text-secondary)" }}>
                  These results are projections only. No changes have been applied to the live grid. 
                  Use the Energy Grid page to approve or override ARIA actions.
                </p>
              </div>
            </>
          ) : (
            <div className="glass-card p-8 text-center">
              <FlaskConical size={40} className="mx-auto mb-3 opacity-20" style={{ color: "var(--accent-cyan)" }} />
              <p className="text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
                Configure parameters and run a simulation
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Results will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
