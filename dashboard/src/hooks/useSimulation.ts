"use client";

import { useState, useEffect, useCallback } from "react";
import type { Incident, AgentAction, DashboardStats } from "@/types";
import {
  incidents as baseIncidents,
  dashboardStats as baseStats,
} from "@/lib/mock-data";

const simulatedIncidents: Incident[] = [
  {
    id: "INC-006",
    title: "Redis Cluster Failover Detected",
    description:
      "Primary Redis node redis-cluster-01 unresponsive. Sentinel initiated automatic failover to replica redis-cluster-02.",
    severity: "critical",
    status: "open",
    source: "Redis Sentinel",
    detectedAt: new Date().toISOString(),
    agentActions: [],
    costSaved: 0,
  },
  {
    id: "INC-007",
    title: "CDN Cache Hit Ratio Dropped Below 70%",
    description:
      "CloudFront cache hit ratio dropped from 94% to 67% in the last 10 minutes. Origin server load increasing.",
    severity: "warning",
    status: "open",
    source: "CloudWatch Alarm",
    detectedAt: new Date().toISOString(),
    agentActions: [],
    costSaved: 0,
  },
  {
    id: "INC-008",
    title: "Anomalous Login Pattern Detected",
    description:
      "Auth service logged 2,400 failed login attempts from 15 IPs in 5 minutes. Possible credential stuffing attack.",
    severity: "critical",
    status: "open",
    source: "WAF Alert",
    detectedAt: new Date().toISOString(),
    agentActions: [],
    costSaved: 0,
  },
];

const simulatedActions: Record<string, AgentAction[]> = {
  "INC-006": [
    {
      id: "sim-act-001",
      incidentId: "INC-006",
      tool: "playwright-mcp",
      mcpServer: "microsoft__playwright-mcp",
      action: "Checking Redis cluster dashboard for node health status",
      result:
        "redis-cluster-01 marked as ODOWN by 3/3 sentinels. Failover to redis-cluster-02 completed at 11:52 UTC. 340ms downtime.",
      timestamp: new Date().toISOString(),
      status: "success",
      tokenCost: 1050,
      model: "gpt-4o-mini",
    },
    {
      id: "sim-act-002",
      incidentId: "INC-006",
      tool: "github-mcp",
      mcpServer: "github__github-mcp",
      action: "Checking for recent Redis config changes",
      result:
        'PR #863 "Increase Redis maxmemory to 8GB" merged 45min ago. Config change triggered OOM on redis-cluster-01 (host only has 6GB RAM).',
      timestamp: new Date(Date.now() + 5000).toISOString(),
      status: "success",
      tokenCost: 780,
      model: "gpt-4o-mini",
    },
    {
      id: "sim-act-003",
      incidentId: "INC-006",
      tool: "slack-mcp",
      mcpServer: "slack__slack-mcp",
      action: "Notifying #database-team with root cause and fix",
      result:
        'Sent alert: "Redis failover caused by maxmemory > host RAM in PR #863. Reduce maxmemory to 4GB or upgrade host to 8GB+ RAM."',
      timestamp: new Date(Date.now() + 10000).toISOString(),
      status: "success",
      tokenCost: 290,
      model: "gpt-4o-mini",
    },
  ],
  "INC-007": [
    {
      id: "sim-act-004",
      incidentId: "INC-007",
      tool: "playwright-mcp",
      mcpServer: "microsoft__playwright-mcp",
      action: "Analyzing CloudFront distribution cache behavior",
      result:
        "Cache miss spike on /api/v2/* endpoints. New query string parameter `_t` added in frontend v3.2.1 is busting cache for every request.",
      timestamp: new Date().toISOString(),
      status: "success",
      tokenCost: 920,
      model: "gpt-4o-mini",
    },
    {
      id: "sim-act-005",
      incidentId: "INC-007",
      tool: "github-mcp",
      mcpServer: "github__github-mcp",
      action: "Searching for cache-busting parameter in recent frontend deploys",
      result:
        'Found in PR #859: Added timestamp query param for "cache busting during dev". Should have been removed before merge.',
      timestamp: new Date(Date.now() + 6000).toISOString(),
      status: "success",
      tokenCost: 670,
      model: "gpt-4o-mini",
    },
  ],
  "INC-008": [
    {
      id: "sim-act-006",
      incidentId: "INC-008",
      tool: "playwright-mcp",
      mcpServer: "microsoft__playwright-mcp",
      action: "Scraping WAF dashboard for attack pattern analysis",
      result:
        "2,400 POST /auth/login requests from 15 IPs across 3 ASNs (AS14061, AS16509, AS13335). Credential pairs from known breach database.",
      timestamp: new Date().toISOString(),
      status: "success",
      tokenCost: 1180,
      model: "gpt-4o-mini",
    },
    {
      id: "sim-act-007",
      incidentId: "INC-008",
      tool: "slack-mcp",
      mcpServer: "slack__slack-mcp",
      action: "Alerting #security-team with IP list and attack details",
      result:
        "CRITICAL alert sent to #security-team with 15 attacker IPs. Recommended: enable rate limiting on /auth/login, block ASNs temporarily.",
      timestamp: new Date(Date.now() + 4000).toISOString(),
      status: "success",
      tokenCost: 410,
      model: "gpt-4o-mini",
    },
    {
      id: "sim-act-008",
      incidentId: "INC-008",
      tool: "github-mcp",
      mcpServer: "github__github-mcp",
      action: "Attempted to push WAF rule update to block attacker IPs",
      result:
        "BLOCKED: Security Guardian denied automatic WAF rule modification. Requires security team approval.",
      timestamp: new Date(Date.now() + 8000).toISOString(),
      status: "blocked",
      blockedReason:
        "Security policy: WAF/firewall rule modifications require human approval from security team",
      tokenCost: 150,
      model: "claude-opus-4.6",
    },
  ],
};

export function useSimulation() {
  const [incidents, setIncidents] = useState<Incident[]>(baseIncidents);
  const [stats, setStats] = useState<DashboardStats>(baseStats);
  const [simIndex, setSimIndex] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simLog, setSimLog] = useState<string[]>([]);

  const triggerIncident = useCallback(() => {
    if (simIndex >= simulatedIncidents.length) {
      setSimLog((prev) => [...prev, "All simulation scenarios complete."]);
      setIsSimulating(false);
      return;
    }

    const newIncident = {
      ...simulatedIncidents[simIndex],
      detectedAt: new Date().toISOString(),
    };
    const actions = simulatedActions[newIncident.id] || [];

    setSimLog((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] New incident detected: ${newIncident.title}`,
    ]);

    // Add incident immediately
    setIncidents((prev) => [newIncident, ...prev]);
    setStats((prev) => ({
      ...prev,
      totalIncidents: prev.totalIncidents + 1,
      activeIncidents: prev.activeIncidents + 1,
    }));

    // Add agent actions one by one with delays
    actions.forEach((action, idx) => {
      setTimeout(() => {
        const updatedAction = {
          ...action,
          timestamp: new Date().toISOString(),
        };

        setIncidents((prev) =>
          prev.map((inc) =>
            inc.id === newIncident.id
              ? {
                  ...inc,
                  status: "investigating" as const,
                  agentActions: [...inc.agentActions, updatedAction],
                }
              : inc
          )
        );

        setStats((prev) => ({
          ...prev,
          agentActions: prev.agentActions + 1,
          securityBlocked:
            prev.securityBlocked + (action.status === "blocked" ? 1 : 0),
        }));

        const statusEmoji =
          action.status === "blocked"
            ? "BLOCKED"
            : action.status === "success"
            ? "OK"
            : "FAIL";
        setSimLog((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] [${statusEmoji}] ${action.mcpServer.split("__")[0]} → ${action.action.substring(0, 60)}...`,
        ]);

        // After last action, update incident status
        if (idx === actions.length - 1) {
          setTimeout(() => {
            setIncidents((prev) =>
              prev.map((inc) =>
                inc.id === newIncident.id
                  ? {
                      ...inc,
                      rootCause:
                        newIncident.id === "INC-006"
                          ? "Redis maxmemory configured higher than host RAM in PR #863"
                          : newIncident.id === "INC-007"
                          ? "Cache-busting timestamp query param left in production build from PR #859"
                          : "Credential stuffing attack using leaked database credentials",
                      costSaved:
                        newIncident.id === "INC-008" ? 5200 : 1800,
                    }
                  : inc
              )
            );
            setSimLog((prev) => [
              ...prev,
              `[${new Date().toLocaleTimeString()}] Root cause identified for ${newIncident.id}. Investigation complete.`,
            ]);
          }, 2000);
        }
      }, (idx + 1) * 3000);
    });

    setSimIndex((prev) => prev + 1);
  }, [simIndex]);

  const startSimulation = useCallback(() => {
    setIsSimulating(true);
    setSimLog([`[${new Date().toLocaleTimeString()}] Simulation started. Listening for incidents...`]);
    // Trigger first incident immediately
    setTimeout(() => triggerIncident(), 1500);
  }, [triggerIncident]);

  // Auto-trigger next incident after delay when simulating
  useEffect(() => {
    if (!isSimulating || simIndex === 0) return;
    if (simIndex >= simulatedIncidents.length) {
      setIsSimulating(false);
      return;
    }
    const timer = setTimeout(() => triggerIncident(), 15000);
    return () => clearTimeout(timer);
  }, [isSimulating, simIndex, triggerIncident]);

  return {
    incidents,
    stats,
    isSimulating,
    simLog,
    startSimulation,
    triggerIncident,
    canTrigger: simIndex < simulatedIncidents.length,
  };
}
