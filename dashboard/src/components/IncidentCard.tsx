"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Clock,
  GitBranch,
  MessageSquare,
  Globe,
  Shield,
  CheckCircle2,
  XCircle,
  Ban,
} from "lucide-react";
import { type Incident } from "@/types";
import { severityColor, severityDot, formatTime, cn } from "@/lib/utils";

export function IncidentCard({ incident }: { incident: Incident }) {
  const [expanded, setExpanded] = useState(false);

  const toolIcon = (tool: string) => {
    if (tool.includes("playwright")) return <Globe className="h-4 w-4" />;
    if (tool.includes("github")) return <GitBranch className="h-4 w-4" />;
    if (tool.includes("slack")) return <MessageSquare className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  const statusIcon = (status: string) => {
    if (status === "success")
      return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
    if (status === "failed")
      return <XCircle className="h-4 w-4 text-red-400" />;
    return <Ban className="h-4 w-4 text-amber-400" />;
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border transition-all duration-200",
        severityColor(incident.severity)
      )}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={cn(
                "h-2.5 w-2.5 rounded-full",
                severityDot(incident.severity)
              )}
            />
            {incident.status !== "resolved" && (
              <div
                className={cn(
                  "absolute inset-0 h-2.5 w-2.5 animate-ping rounded-full opacity-75",
                  severityDot(incident.severity)
                )}
              />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-zinc-500">
                {incident.id}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                  incident.status === "open"
                    ? "bg-red-950 text-red-400"
                    : incident.status === "investigating"
                    ? "bg-amber-950 text-amber-400"
                    : "bg-emerald-950 text-emerald-400"
                )}
              >
                {incident.status}
              </span>
            </div>
            <h3 className="mt-1 font-semibold text-white">
              {incident.title}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-1 text-xs text-zinc-500 sm:flex">
            <Clock className="h-3 w-3" />
            {formatTime(incident.detectedAt)}
          </div>
          <div className="flex items-center gap-1 text-xs text-zinc-400">
            {incident.agentActions.length} actions
          </div>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-zinc-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-zinc-500" />
          )}
        </div>
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-zinc-800 bg-zinc-950/50 p-4">
          <p className="mb-4 text-sm text-zinc-400">
            {incident.description}
          </p>

          {/* Root Cause */}
          {incident.rootCause && (
            <div className="mb-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Root Cause Identified
              </p>
              <p className="text-sm text-zinc-300">{incident.rootCause}</p>
            </div>
          )}

          {/* Agent Action Timeline */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Agent Decision Log
            </p>
            <div className="relative space-y-0">
              {incident.agentActions.map((action, idx) => (
                <div key={action.id} className="relative flex gap-3 pb-4">
                  {/* Timeline line */}
                  {idx < incident.agentActions.length - 1 && (
                    <div className="absolute left-[11px] top-6 h-full w-px bg-zinc-800" />
                  )}
                  {/* Timeline dot */}
                  <div className="relative z-10 mt-0.5 flex-shrink-0">
                    {statusIcon(action.status)}
                  </div>
                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 rounded bg-zinc-800 px-2 py-0.5">
                        {toolIcon(action.tool)}
                        <span className="text-xs font-medium text-zinc-300">
                          {action.mcpServer.split("__")[0]}
                        </span>
                      </div>
                      <span className="text-xs text-zinc-600">
                        {formatTime(action.timestamp)}
                      </span>
                      <span className="rounded bg-zinc-800/50 px-1.5 py-0.5 text-xs text-zinc-500">
                        {action.model}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-zinc-300">
                      {action.action}
                    </p>
                    <div className="mt-1.5 rounded border border-zinc-800 bg-zinc-900 p-2">
                      <p className="text-xs text-zinc-400">{action.result}</p>
                    </div>
                    {action.status === "blocked" && (
                      <div className="mt-1.5 flex items-center gap-1.5 rounded border border-amber-900 bg-amber-950/50 px-2 py-1">
                        <Shield className="h-3 w-3 text-amber-400" />
                        <p className="text-xs text-amber-400">
                          {action.blockedReason}
                        </p>
                      </div>
                    )}
                    <div className="mt-1 text-xs text-zinc-600">
                      {action.tokenCost.toLocaleString()} tokens
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Saved */}
          {incident.costSaved && (
            <div className="mt-3 flex items-center justify-between rounded-lg bg-emerald-950/30 px-3 py-2 text-sm">
              <span className="text-zinc-400">
                Estimated time saved by AI triage
              </span>
              <span className="font-semibold text-emerald-400">
                ~${incident.costSaved.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
