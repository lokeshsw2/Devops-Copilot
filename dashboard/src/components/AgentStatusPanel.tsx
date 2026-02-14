"use client";

import { Bot, Cpu, Zap, Clock } from "lucide-react";
import { type AgentConfig } from "@/types";
import { statusColor, cn } from "@/lib/utils";

export function AgentStatusPanel({ agents }: { agents: AgentConfig[] }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <Bot className="h-5 w-5 text-violet-400" />
        <h2 className="text-lg font-semibold text-white">Active Agents</h2>
      </div>
      <div className="space-y-3">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3 transition-colors hover:border-zinc-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    agent.status === "active"
                      ? "bg-emerald-500"
                      : agent.status === "idle"
                      ? "bg-zinc-500"
                      : "bg-red-500"
                  )}
                />
                <span className="font-medium text-white">{agent.name}</span>
              </div>
              <span
                className={cn(
                  "text-xs font-medium capitalize",
                  statusColor(agent.status)
                )}
              >
                {agent.status}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded bg-zinc-900 p-2 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Zap className="h-3 w-3 text-zinc-500" />
                  <span className="text-xs text-zinc-500">Actions</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-white">
                  {agent.totalActions}
                </p>
              </div>
              <div className="rounded bg-zinc-900 p-2 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Cpu className="h-3 w-3 text-zinc-500" />
                  <span className="text-xs text-zinc-500">Success</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-emerald-400">
                  {agent.successRate}%
                </p>
              </div>
              <div className="rounded bg-zinc-900 p-2 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Clock className="h-3 w-3 text-zinc-500" />
                  <span className="text-xs text-zinc-500">Avg</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-white">
                  {agent.avgResponseTime}s
                </p>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-1">
              {agent.mcpServers.map((server) => (
                <span
                  key={server}
                  className="rounded-full bg-violet-950/50 px-2 py-0.5 text-xs text-violet-400"
                >
                  {server.split("__")[0]}
                </span>
              ))}
              <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                {agent.model}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
