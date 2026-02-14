"use client";

import { useEffect, useState } from "react";
import { Radio, GitBranch, Globe, MessageSquare, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedItem {
  id: string;
  agent: string;
  action: string;
  tool: string;
  timestamp: string;
  type: "scan" | "alert" | "action" | "blocked";
}

const feedItems: FeedItem[] = [
  {
    id: "f1",
    agent: "Incident Triage",
    action: "Scanning Grafana dashboard for anomalies",
    tool: "playwright",
    timestamp: "just now",
    type: "scan",
  },
  {
    id: "f2",
    agent: "Root Cause Analyzer",
    action: "Correlating PR #851 with memory leak pattern",
    tool: "github",
    timestamp: "12s ago",
    type: "action",
  },
  {
    id: "f3",
    agent: "Security Guardian",
    action: "Blocked auto-revert on production branch",
    tool: "security",
    timestamp: "35s ago",
    type: "blocked",
  },
  {
    id: "f4",
    agent: "Incident Triage",
    action: "Sent alert to #oncall-backend channel",
    tool: "slack",
    timestamp: "1m ago",
    type: "alert",
  },
  {
    id: "f5",
    agent: "Root Cause Analyzer",
    action: "Checking recent deployments in last 2 hours",
    tool: "github",
    timestamp: "2m ago",
    type: "action",
  },
  {
    id: "f6",
    agent: "Incident Triage",
    action: "Scraped Kubernetes pod restart events",
    tool: "playwright",
    timestamp: "3m ago",
    type: "scan",
  },
  {
    id: "f7",
    agent: "Security Guardian",
    action: "Validated tool call: read-only GitHub access approved",
    tool: "security",
    timestamp: "3m ago",
    type: "action",
  },
  {
    id: "f8",
    agent: "Incident Triage",
    action: "Monitoring SSL certificate expiry for api.production.com",
    tool: "playwright",
    timestamp: "5m ago",
    type: "scan",
  },
];

const toolIcon = (tool: string) => {
  switch (tool) {
    case "playwright":
      return <Globe className="h-3.5 w-3.5" />;
    case "github":
      return <GitBranch className="h-3.5 w-3.5" />;
    case "slack":
      return <MessageSquare className="h-3.5 w-3.5" />;
    case "security":
      return <Shield className="h-3.5 w-3.5" />;
    default:
      return <Radio className="h-3.5 w-3.5" />;
  }
};

const typeColor = (type: string) => {
  switch (type) {
    case "scan":
      return "text-cyan-400";
    case "alert":
      return "text-amber-400";
    case "action":
      return "text-violet-400";
    case "blocked":
      return "text-red-400";
    default:
      return "text-zinc-400";
  }
};

export function LiveActivityFeed() {
  const [visibleItems, setVisibleItems] = useState<string[]>([]);

  useEffect(() => {
    feedItems.forEach((item, idx) => {
      setTimeout(() => {
        setVisibleItems((prev) => [...prev, item.id]);
      }, idx * 200);
    });
  }, []);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="relative">
          <Radio className="h-5 w-5 text-red-400" />
          <div className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-pulse rounded-full bg-red-500" />
        </div>
        <h2 className="text-lg font-semibold text-white">Live Activity</h2>
      </div>
      <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin">
        {feedItems.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex items-start gap-3 rounded-lg border border-zinc-800/50 bg-zinc-950/50 p-2.5 transition-all duration-500",
              visibleItems.includes(item.id)
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-0"
            )}
          >
            <div className={cn("mt-0.5 flex-shrink-0", typeColor(item.type))}>
              {toolIcon(item.tool)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-zinc-300">
                  {item.agent}
                </span>
                <span className="text-xs text-zinc-600">{item.timestamp}</span>
              </div>
              <p className="mt-0.5 text-xs text-zinc-500 truncate">
                {item.action}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
