"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: { value: number; positive: boolean };
  className?: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-400">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-white">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-zinc-500">{subtitle}</p>
          )}
          {trend && (
            <div
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                trend.positive
                  ? "bg-emerald-950 text-emerald-400"
                  : "bg-red-950 text-red-400"
              )}
            >
              {trend.positive ? "↓" : "↑"} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        <div className="rounded-lg bg-zinc-800/50 p-2.5 text-zinc-400">
          {icon}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
    </div>
  );
}
