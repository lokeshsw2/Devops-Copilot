"use client";

import { Play, Zap, Terminal, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SimulationControlProps {
  isSimulating: boolean;
  onStart: () => void;
  onTrigger: () => void;
  canTrigger: boolean;
  simLog: string[];
}

export function SimulationControl({
  isSimulating,
  onStart,
  onTrigger,
  canTrigger,
  simLog,
}: SimulationControlProps) {
  const [showLog, setShowLog] = useState(false);

  return (
    <div className="rounded-xl border border-dashed border-violet-800/50 bg-violet-950/10 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-violet-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">
              Live Simulation Mode
            </h3>
            <p className="text-xs text-zinc-500">
              Test the full incident → agent → resolution pipeline
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isSimulating ? (
            <button
              onClick={onStart}
              className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500"
            >
              <Play className="h-4 w-4" />
              Start Simulation
            </button>
          ) : (
            <>
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-950 px-3 py-1">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-emerald-400">
                  Running
                </span>
              </div>
              <button
                onClick={onTrigger}
                disabled={!canTrigger}
                className="flex items-center gap-1.5 rounded-lg border border-violet-700 bg-violet-900/50 px-3 py-1.5 text-xs font-medium text-violet-300 transition-colors hover:bg-violet-800/50 disabled:opacity-40"
              >
                <Zap className="h-3.5 w-3.5" />
                Trigger Next Incident
              </button>
            </>
          )}
        </div>
      </div>

      {/* Simulation Log */}
      {simLog.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setShowLog(!showLog)}
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300"
          >
            {showLog ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
            Simulation Log ({simLog.length} entries)
          </button>
          {showLog && (
            <div className="mt-2 max-h-40 overflow-y-auto rounded-lg bg-zinc-950 p-3 font-mono text-xs scrollbar-thin">
              {simLog.map((entry, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "py-0.5",
                    entry.includes("BLOCKED")
                      ? "text-amber-400"
                      : entry.includes("OK")
                      ? "text-emerald-400"
                      : entry.includes("FAIL")
                      ? "text-red-400"
                      : entry.includes("detected")
                      ? "text-red-300"
                      : entry.includes("Root cause")
                      ? "text-cyan-400"
                      : "text-zinc-500"
                  )}
                >
                  {entry}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
