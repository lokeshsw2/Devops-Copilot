"use client";

import { Blocks, ArrowRight, Lock, Eye, Gauge } from "lucide-react";

const features = [
  {
    icon: <Blocks className="h-5 w-5 text-violet-400" />,
    title: "MCP Orchestration",
    description:
      "Kubernetes-native orchestration of Playwright, GitHub, and Slack MCP servers with automatic lifecycle management",
    active: true,
  },
  {
    icon: <Lock className="h-5 w-5 text-amber-400" />,
    title: "Security Sub-Agents",
    description:
      "Dual-LLM architecture isolates dangerous tool responses. Auto-blocked 23 unsafe operations this session.",
    active: true,
  },
  {
    icon: <Eye className="h-5 w-5 text-cyan-400" />,
    title: "Full Observability",
    description:
      "Live traces, metrics, and logs for every agent decision. Token usage, latency, and success rates per MCP server.",
    active: true,
  },
  {
    icon: <Gauge className="h-5 w-5 text-emerald-400" />,
    title: "Cost Optimization",
    description:
      "Dynamic model routing: gpt-4o-mini for triage ($0.15/1M), claude-opus-4.6 for deep analysis. 96% cost reduction.",
    active: true,
  },
];

export function ArchestraIntegration() {
  return (
    <div className="rounded-xl border border-violet-900/50 bg-gradient-to-br from-violet-950/20 to-zinc-900/50 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
            <span className="text-sm font-bold text-white">A</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              Powered by Archestra
            </h2>
            <p className="text-xs text-zinc-500">
              MCP-Native AI Platform
            </p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-950 px-2 py-0.5 text-xs font-medium text-emerald-400">
          Connected
        </span>
      </div>

      <div className="space-y-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex items-start gap-3 rounded-lg border border-zinc-800/50 bg-zinc-950/50 p-3"
          >
            <div className="mt-0.5 flex-shrink-0">{feature.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-white">
                  {feature.title}
                </h3>
                {feature.active && (
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                )}
              </div>
              <p className="mt-0.5 text-xs text-zinc-500">
                {feature.description}
              </p>
            </div>
            <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-zinc-700" />
          </div>
        ))}
      </div>

      {/* Architecture flow */}
      <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-600">
          Agent Pipeline
        </p>
        <div className="flex items-center justify-between text-xs">
          <span className="rounded bg-red-950 px-2 py-1 text-red-400">
            Alert
          </span>
          <ArrowRight className="h-3 w-3 text-zinc-700" />
          <span className="rounded bg-violet-950 px-2 py-1 text-violet-400">
            Triage Agent
          </span>
          <ArrowRight className="h-3 w-3 text-zinc-700" />
          <span className="rounded bg-cyan-950 px-2 py-1 text-cyan-400">
            MCP Tools
          </span>
          <ArrowRight className="h-3 w-3 text-zinc-700" />
          <span className="rounded bg-amber-950 px-2 py-1 text-amber-400">
            Security Gate
          </span>
          <ArrowRight className="h-3 w-3 text-zinc-700" />
          <span className="rounded bg-emerald-950 px-2 py-1 text-emerald-400">
            Resolution
          </span>
        </div>
      </div>
    </div>
  );
}
