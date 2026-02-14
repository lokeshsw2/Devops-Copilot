"use client";

import { useState, useMemo } from "react";
import {
  AlertTriangle,
  Activity,
  Clock,
  DollarSign,
  Zap,
  ShieldCheck,
  Github,
  ExternalLink,
  Search,
} from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { IncidentCard } from "@/components/IncidentCard";
import { AgentStatusPanel } from "@/components/AgentStatusPanel";
import { SystemHealthBar } from "@/components/SystemHealthBar";
import { CostPanel } from "@/components/CostPanel";
import { IncidentChart } from "@/components/IncidentChart";
import { LiveActivityFeed } from "@/components/LiveActivityFeed";
import { ArchestraIntegration } from "@/components/ArchestraIntegration";
import { ChatPanel } from "@/components/ChatPanel";
import { SimulationControl } from "@/components/SimulationControl";
import { useSimulation } from "@/hooks/useSimulation";
import {
  agentConfigs,
  incidentTrend,
  responseTimes,
  costBreakdown,
  systemHealth,
} from "@/lib/mock-data";
import type { Severity } from "@/types";

type FilterType = "all" | Severity;

export default function Home() {
  const {
    incidents,
    stats,
    isSimulating,
    simLog,
    startSimulation,
    triggerIncident,
    canTrigger,
  } = useSimulation();

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIncidents = useMemo(() => {
    let result = incidents;

    if (activeFilter !== "all") {
      result = result.filter((i) => i.severity === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.source.toLowerCase().includes(q) ||
          (i.rootCause && i.rootCause.toLowerCase().includes(q))
      );
    }

    return result;
  }, [incidents, activeFilter, searchQuery]);

  const filterCounts = useMemo(() => {
    return {
      all: incidents.length,
      critical: incidents.filter((i) => i.severity === "critical").length,
      warning: incidents.filter((i) => i.severity === "warning").length,
      info: incidents.filter((i) => i.severity === "info").length,
    };
  }, [incidents]);

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
                {agentConfigs.filter((a) => a.status === "active").length} Agents
                Active
              </span>
            </div>
            <a
              href="https://github.com/lokeshsw2/Devops-Copilot"
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
        {/* Simulation Control */}
        <div className="mb-6">
          <SimulationControl
            isSimulating={isSimulating}
            onStart={startSimulation}
            onTrigger={triggerIncident}
            canTrigger={canTrigger}
            simLog={simLog}
          />
        </div>

        {/* Stats Row */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <StatsCard
            title="Total Incidents"
            value={stats.totalIncidents}
            icon={<AlertTriangle className="h-5 w-5" />}
            subtitle="Last 30 days"
          />
          <StatsCard
            title="Active Now"
            value={stats.activeIncidents}
            icon={<Activity className="h-5 w-5" />}
            trend={{ value: 25, positive: true }}
            className="glow-red"
          />
          <StatsCard
            title="MTTR"
            value={`${stats.mttr}m`}
            icon={<Clock className="h-5 w-5" />}
            subtitle="Mean time to resolve"
            trend={{ value: 38, positive: true }}
          />
          <StatsCard
            title="Cost Saved"
            value={`$${(stats.costSaved / 1000).toFixed(1)}k`}
            icon={<DollarSign className="h-5 w-5" />}
            subtitle="By AI triage"
            className="glow-emerald"
          />
          <StatsCard
            title="Agent Actions"
            value={stats.agentActions.toLocaleString()}
            icon={<Zap className="h-5 w-5" />}
            subtitle="Total executed"
          />
          <StatsCard
            title="Security Blocked"
            value={stats.securityBlocked}
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
              <div className="mb-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">
                    Recent Incidents
                  </h2>
                  <span className="text-xs text-zinc-500">
                    {filteredIncidents.length} of {incidents.length}
                  </span>
                </div>

                {/* Search bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search incidents by title, ID, source, or root cause..."
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-violet-600"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                  {(
                    [
                      "all",
                      "critical",
                      "warning",
                      "info",
                    ] as FilterType[]
                  ).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`rounded-full border px-3 py-1 text-xs capitalize transition-colors ${
                        activeFilter === filter
                          ? "border-violet-600 bg-violet-950/50 text-violet-400"
                          : "border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white"
                      }`}
                    >
                      {filter}
                      <span className="ml-1.5 text-zinc-600">
                        {filterCounts[filter as keyof typeof filterCounts]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredIncidents.length > 0 ? (
                  filteredIncidents.map((incident) => (
                    <IncidentCard key={incident.id} incident={incident} />
                  ))
                ) : (
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
                    <p className="text-zinc-500">
                      No incidents match your filters.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Panels */}
          <div className="space-y-6">
            <LiveActivityFeed />
            <AgentStatusPanel agents={agentConfigs} />
            <CostPanel
              costs={costBreakdown}
              totalSaved={stats.costSaved}
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

      {/* Chat Panel */}
      <ChatPanel incidents={incidents} />
    </div>
  );
}
