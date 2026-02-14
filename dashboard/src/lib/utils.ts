import { type Severity } from "@/types";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function severityColor(severity: Severity) {
  switch (severity) {
    case "critical":
      return "text-red-400 bg-red-950 border-red-800";
    case "warning":
      return "text-amber-400 bg-amber-950 border-amber-800";
    case "info":
      return "text-blue-400 bg-blue-950 border-blue-800";
    case "resolved":
      return "text-emerald-400 bg-emerald-950 border-emerald-800";
  }
}

export function severityDot(severity: Severity) {
  switch (severity) {
    case "critical":
      return "bg-red-500";
    case "warning":
      return "bg-amber-500";
    case "info":
      return "bg-blue-500";
    case "resolved":
      return "bg-emerald-500";
  }
}

export function statusColor(status: string) {
  switch (status) {
    case "healthy":
      return "text-emerald-400";
    case "degraded":
      return "text-amber-400";
    case "down":
      return "text-red-400";
    case "active":
      return "text-emerald-400";
    case "idle":
      return "text-zinc-400";
    case "error":
      return "text-red-400";
    default:
      return "text-zinc-400";
  }
}

export function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function timeAgo(iso: string) {
  const seconds = Math.floor(
    (Date.now() - new Date(iso).getTime()) / 1000
  );
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function formatCost(cost: number) {
  return `$${cost.toFixed(2)}`;
}
