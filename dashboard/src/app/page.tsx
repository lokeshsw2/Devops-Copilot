"use client";

import {
  AlertTriangle,
  Activity,
  Clock,
  DollarSign,
  Zap,
  ShieldCheck,
  Github,
  ExternalLink,
} from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { IncidentCard } from "@/components/IncidentCard";
import { AgentStatusPanel } from "@/components/AgentStatusPanel";
import { SystemHealthBar } from "@/components/SystemHealthBar";
import { CostPanel } from "@/components/CostPanel";
import { IncidentChart } from "@/components/IncidentChart";
import { LiveActivityFeed } from "@/components/LiveActivityFeed";
import { ArchestraIntegration } from "@/components/ArchestraIntegration";
import {
  dashboardStats,
  incidents,
  agentConfigs,
  incidentTrend,
  responseTimes,
  costBreakdown,
  systemHealth,
} from "@/lib/mock-data";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">
                DevOps Copilot
              </h1>
              <p className="text-xs text-zinc-500">
                AI-Powered Incident Response
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-emerald-900 bg-emerald-950/50 px-3 py-1">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-emerald-400">
                Agents Active
              </span>
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Stats Row */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <StatsCard
            title="Total Incidents"
            value={dashboardStats.totalIncidents}
            icon={<AlertTriangle className="h-5 w-5" />}
            subtitle="Last 30 days"
          />
          <StatsCard
            title="Active Now"
            value={dashboardStats.activeIncidents}
            icon={<Activity className="h-5 w-5" />}
            trend={{ value: 25, positive: true }}
            className="glow-red"
          />
          <StatsCard
            title="MTTR"
            value={`${dashboardStats.mttr}m`}
            icon={<Clock className="h-5 w-5" />}
            subtitle="Mean time to resolve"
            trend={{ value: 38, positive: true }}
          />
          <StatsCard
            title="Cost Saved"
            value={`$${(dashboardStats.costSaved / 1000).toFixed(1)}k`}
            icon={<DollarSign className="h-5 w-5" />}
            subtitle="By AI triage"
            className="glow-emerald"
          />
          <StatsCard
            title="Agent Actions"
            value={dashboardStats.agentActions.toLocaleString()}
            icon={<Zap className="h-5 w-5" />}
            subtitle="Total executed"
          />
          <StatsCard
            title="Security Blocked"
            value={dashboardStats.securityBlocked}
            icon={<ShieldCheck className="h-5 w-5" />}
            subtitle="Unsafe ops prevented"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Incidents */}
          <div className="space-y-6 lg:col-span-2">
            {/* Charts */}
            <div className="grid gap-4 sm:grid-cols-2">
              <IncidentChart
                data={incidentTrend}
                title="Incidents Today (Hourly)"
                color="#ef4444"
                gradientId="incident-gradient"
              />
              <IncidentChart
                data={responseTimes}
                title="Agent Response Time (s)"
                color="#8b5cf6"
                gradientId="response-gradient"
              />
            </div>

            {/* Incident List */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  Recent Incidents
                </h2>
                <div className="flex gap-2">
                  {(["all", "critical", "warning", "info"] as const).map(
                    (filter) => (
                      <button
                        key={filter}
                        className="rounded-full border border-zinc-800 px-3 py-1 text-xs capitalize text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white data-[active=true]:border-violet-600 data-[active=true]:bg-violet-950/50 data-[active=true]:text-violet-400"
                        data-active={filter === "all"}
                      >
                        {filter}
                      </button>
                    )
                  )}
                </div>
              </div>
              <div className="space-y-3">
                {incidents.map((incident) => (
                  <IncidentCard key={incident.id} incident={incident} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Panels */}
          <div className="space-y-6">
            <LiveActivityFeed />
            <AgentStatusPanel agents={agentConfigs} />
            <CostPanel
              costs={costBreakdown}
              totalSaved={dashboardStats.costSaved}
            />
            <SystemHealthBar services={systemHealth} />
            <ArchestraIntegration />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-zinc-800 bg-zinc-950/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <p className="text-xs text-zinc-600">
            DevOps Copilot - Built for 2 Fast 2 MCP Hackathon
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-600">Powered by</span>
            <span className="text-xs font-semibold text-violet-400">
              Archestra
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
