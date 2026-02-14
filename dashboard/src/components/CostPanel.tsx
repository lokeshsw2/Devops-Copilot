"use client";

import { DollarSign } from "lucide-react";
import { type CostBreakdown } from "@/types";
import { cn } from "@/lib/utils";

const modelColors: Record<string, string> = {
  "gpt-4o-mini": "bg-emerald-500",
  "claude-3.5-sonnet": "bg-violet-500",
  "gpt-4o": "bg-blue-500",
};

export function CostPanel({
  costs,
  totalSaved,
}: {
  costs: CostBreakdown[];
  totalSaved: number;
}) {
  const totalCost = costs.reduce((sum, c) => sum + c.cost, 0);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-emerald-400" />
          <h2 className="text-lg font-semibold text-white">Cost Intelligence</h2>
        </div>
        <span className="text-sm text-zinc-400">
          Total: ${totalCost.toFixed(2)}
        </span>
      </div>

      {/* Cost bar */}
      <div className="mb-4 flex h-3 overflow-hidden rounded-full bg-zinc-800">
        {costs.map((cost) => (
          <div
            key={cost.model}
            className={cn("h-full transition-all", modelColors[cost.model] || "bg-zinc-600")}
            style={{ width: `${cost.percentage}%` }}
          />
        ))}
      </div>

      {/* Breakdown */}
      <div className="space-y-2">
        {costs.map((cost) => (
          <div
            key={cost.model}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  modelColors[cost.model] || "bg-zinc-600"
                )}
              />
              <span className="text-zinc-300">{cost.model}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-zinc-500">
                {(cost.tokens / 1000).toFixed(1)}k tokens
              </span>
              <span className="font-medium text-white">
                ${cost.cost.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Optimization badge */}
      <div className="mt-4 rounded-lg border border-emerald-900 bg-emerald-950/30 p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-emerald-400">
              Smart Model Routing Active
            </p>
            <p className="mt-0.5 text-xs text-zinc-500">
              Using gpt-4o-mini for triage, claude-3.5-sonnet for analysis
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-emerald-400">96%</p>
            <p className="text-xs text-zinc-500">cost saved</p>
          </div>
        </div>
      </div>

      {/* Total saved */}
      <div className="mt-3 rounded-lg bg-zinc-800/50 p-3 text-center">
        <p className="text-xs text-zinc-500">Total Estimated Value from AI Triage</p>
        <p className="mt-1 text-2xl font-bold text-emerald-400">
          ${totalSaved.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
