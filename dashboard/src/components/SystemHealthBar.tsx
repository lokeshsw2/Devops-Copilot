"use client";

import { Activity, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { type SystemHealth } from "@/types";
import { cn } from "@/lib/utils";

export function SystemHealthBar({ services }: { services: SystemHealth[] }) {
  const statusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />;
      case "degraded":
        return <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />;
      case "down":
        return <XCircle className="h-3.5 w-3.5 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="h-5 w-5 text-cyan-400" />
        <h2 className="text-lg font-semibold text-white">
          System Health
        </h2>
      </div>
      <div className="space-y-2">
        {services.map((service) => (
          <div
            key={service.service}
            className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2"
          >
            <div className="flex items-center gap-2">
              {statusIcon(service.status)}
              <span className="text-sm text-zinc-300">
                {service.service}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-zinc-500">
                {service.latency}ms
              </span>
              <span
                className={cn(
                  "text-xs font-medium",
                  service.uptime >= 99.9
                    ? "text-emerald-400"
                    : service.uptime >= 99
                    ? "text-amber-400"
                    : "text-red-400"
                )}
              >
                {service.uptime}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
