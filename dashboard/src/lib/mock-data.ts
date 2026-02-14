import {
  Incident,
  AgentConfig,
  MetricPoint,
  CostBreakdown,
  SystemHealth,
  DashboardStats,
} from "@/types";

export const dashboardStats: DashboardStats = {
  totalIncidents: 147,
  activeIncidents: 3,
  mttr: 4.2,
  costSaved: 12840,
  agentActions: 1283,
  securityBlocked: 23,
};

export const incidents: Incident[] = [
  {
    id: "INC-001",
    title: "Database Connection Pool Exhaustion",
    description:
      "PostgreSQL connection pool reached 95% capacity causing request timeouts on /api/users endpoint",
    severity: "critical",
    status: "investigating",
    source: "Prometheus Alert",
    detectedAt: "2026-02-14T10:23:00Z",
    agentActions: [
      {
        id: "act-001",
        incidentId: "INC-001",
        tool: "playwright-mcp",
        mcpServer: "microsoft__playwright-mcp",
        action: "Scraped Grafana dashboard for connection pool metrics",
        result:
          "Connection pool at 95% (190/200). Spike started 10:15 UTC. Correlates with deployment v2.4.1",
        timestamp: "2026-02-14T10:23:30Z",
        status: "success",
        tokenCost: 1250,
        model: "gpt-4o-mini",
      },
      {
        id: "act-002",
        incidentId: "INC-001",
        tool: "github-mcp",
        mcpServer: "github__github-mcp",
        action: "Checked recent deployments and PRs merged in last 2 hours",
        result:
          'Found PR #847 "Add user analytics tracking" merged 10:12 UTC - adds N+1 query pattern in UserService.getAnalytics()',
        timestamp: "2026-02-14T10:24:15Z",
        status: "success",
        tokenCost: 890,
        model: "gpt-4o-mini",
      },
      {
        id: "act-003",
        incidentId: "INC-001",
        tool: "slack-mcp",
        mcpServer: "slack__slack-mcp",
        action:
          "Notified #oncall-backend channel with root cause analysis",
        result:
          "Message sent to #oncall-backend: 🔴 INC-001 | DB pool exhaustion caused by N+1 query in PR #847. Suggested: revert or add eager loading.",
        timestamp: "2026-02-14T10:24:45Z",
        status: "success",
        tokenCost: 340,
        model: "gpt-4o-mini",
      },
      {
        id: "act-004",
        incidentId: "INC-001",
        tool: "github-mcp",
        mcpServer: "github__github-mcp",
        action: "Attempted to create revert PR for #847",
        result: "Blocked by security sub-agent: Requires human approval for production code changes",
        timestamp: "2026-02-14T10:25:00Z",
        status: "blocked",
        blockedReason:
          "Security policy: Production code modifications require human approval",
        tokenCost: 120,
        model: "claude-opus-4.6",
      },
    ],
    rootCause:
      "N+1 query pattern introduced in PR #847 (User Analytics Tracking) causing connection pool exhaustion",
    costSaved: 2400,
  },
  {
    id: "INC-002",
    title: "SSL Certificate Expiring in 48 Hours",
    description:
      "TLS certificate for api.production.com expires Feb 16, 2026. Auto-renewal failed due to DNS validation issue.",
    severity: "warning",
    status: "investigating",
    source: "CertBot Monitor",
    detectedAt: "2026-02-14T08:00:00Z",
    agentActions: [
      {
        id: "act-005",
        incidentId: "INC-002",
        tool: "playwright-mcp",
        mcpServer: "microsoft__playwright-mcp",
        action: "Checked SSL Labs report for api.production.com",
        result:
          "Certificate valid until Feb 16 2026 03:00 UTC. Grade B. Auto-renewal log shows DNS-01 challenge failing - CNAME record missing.",
        timestamp: "2026-02-14T08:01:00Z",
        status: "success",
        tokenCost: 980,
        model: "gpt-4o-mini",
      },
      {
        id: "act-006",
        incidentId: "INC-002",
        tool: "slack-mcp",
        mcpServer: "slack__slack-mcp",
        action: "Notified #platform-team with details and fix steps",
        result:
          "Message sent with DNS fix instructions: Add CNAME _acme-challenge.api.production.com → validation.letsencrypt.org",
        timestamp: "2026-02-14T08:02:00Z",
        status: "success",
        tokenCost: 290,
        model: "gpt-4o-mini",
      },
    ],
    costSaved: 800,
  },
  {
    id: "INC-003",
    title: "Memory Leak in Worker Service",
    description:
      "Worker-service pods OOMKilled 3 times in the last hour. Memory usage growing linearly at ~50MB/min.",
    severity: "critical",
    status: "open",
    source: "Kubernetes Event",
    detectedAt: "2026-02-14T11:45:00Z",
    agentActions: [
      {
        id: "act-007",
        incidentId: "INC-003",
        tool: "playwright-mcp",
        mcpServer: "microsoft__playwright-mcp",
        action: "Scraped Kubernetes dashboard for pod restart events",
        result:
          "worker-service-7f8d9 OOMKilled 3x. Memory limit: 512Mi. Current: 498Mi. Linear growth pattern detected.",
        timestamp: "2026-02-14T11:45:30Z",
        status: "success",
        tokenCost: 1100,
        model: "gpt-4o-mini",
      },
      {
        id: "act-008",
        incidentId: "INC-003",
        tool: "github-mcp",
        mcpServer: "github__github-mcp",
        action:
          "Searched for recent changes to worker-service in last 24h",
        result:
          'PR #851 "Add Redis caching layer" merged 6h ago. Redis client not properly releasing connections - missing client.quit() in finally block.',
        timestamp: "2026-02-14T11:46:00Z",
        status: "success",
        tokenCost: 920,
        model: "gpt-4o-mini",
      },
    ],
    rootCause:
      "Redis client connection leak in PR #851 - missing client.quit() in error handling path",
    costSaved: 1600,
  },
  {
    id: "INC-004",
    title: "Elevated 5xx Error Rate on API Gateway",
    description: "5xx error rate jumped from 0.1% to 2.3% in the last 15 minutes",
    severity: "warning",
    status: "resolved",
    source: "Datadog Alert",
    detectedAt: "2026-02-14T06:30:00Z",
    resolvedAt: "2026-02-14T06:52:00Z",
    agentActions: [
      {
        id: "act-009",
        incidentId: "INC-004",
        tool: "playwright-mcp",
        mcpServer: "microsoft__playwright-mcp",
        action: "Checked Datadog APM for error distribution",
        result: "Errors concentrated in /api/payments endpoint. Upstream payment-service returning 503.",
        timestamp: "2026-02-14T06:31:00Z",
        status: "success",
        tokenCost: 850,
        model: "gpt-4o-mini",
      },
      {
        id: "act-010",
        incidentId: "INC-004",
        tool: "slack-mcp",
        mcpServer: "slack__slack-mcp",
        action: "Checked #incidents channel for related reports",
        result: "Found message from payment provider: Scheduled maintenance 06:15-07:00 UTC. Expected behavior.",
        timestamp: "2026-02-14T06:32:00Z",
        status: "success",
        tokenCost: 310,
        model: "gpt-4o-mini",
      },
    ],
    rootCause: "Upstream payment provider scheduled maintenance (06:15-07:00 UTC)",
    costSaved: 400,
  },
  {
    id: "INC-005",
    title: "Disk Usage Above 85% on Log Storage",
    description: "EBS volume /dev/xvdf on log-aggregator-01 at 87% capacity",
    severity: "info",
    status: "resolved",
    source: "CloudWatch Alarm",
    detectedAt: "2026-02-13T22:00:00Z",
    resolvedAt: "2026-02-13T23:15:00Z",
    agentActions: [
      {
        id: "act-011",
        incidentId: "INC-005",
        tool: "playwright-mcp",
        mcpServer: "microsoft__playwright-mcp",
        action: "Checked AWS CloudWatch disk metrics trend",
        result: "Growing at 2%/day. 7 days until full. Retention policy: 90 days. Oldest logs: 120 days.",
        timestamp: "2026-02-13T22:01:00Z",
        status: "success",
        tokenCost: 760,
        model: "gpt-4o-mini",
      },
      {
        id: "act-012",
        incidentId: "INC-005",
        tool: "slack-mcp",
        mcpServer: "slack__slack-mcp",
        action: "Suggested log rotation fix to #platform-team",
        result: "Recommended: purge logs > 90 days (saves ~25GB), implement logrotate with 30-day max.",
        timestamp: "2026-02-13T22:02:00Z",
        status: "success",
        tokenCost: 280,
        model: "gpt-4o-mini",
      },
    ],
    rootCause: "Log retention policy not enforced - logs older than 90 days not being purged",
    costSaved: 300,
  },
];

export const agentConfigs: AgentConfig[] = [
  {
    id: "agent-001",
    name: "Incident Triage Agent",
    status: "active",
    mcpServers: [
      "microsoft__playwright-mcp",
      "slack__slack-mcp",
    ],
    model: "gpt-4o-mini",
    totalActions: 847,
    successRate: 96.2,
    avgResponseTime: 3.4,
    lastActive: "2026-02-14T11:46:00Z",
  },
  {
    id: "agent-002",
    name: "Root Cause Analyzer",
    status: "active",
    mcpServers: [
      "github__github-mcp",
      "microsoft__playwright-mcp",
    ],
    model: "claude-opus-4.6",
    totalActions: 312,
    successRate: 91.8,
    avgResponseTime: 8.7,
    lastActive: "2026-02-14T11:46:00Z",
  },
  {
    id: "agent-003",
    name: "Security Guardian",
    status: "active",
    mcpServers: [],
    model: "claude-opus-4.6",
    totalActions: 124,
    successRate: 100,
    avgResponseTime: 1.2,
    lastActive: "2026-02-14T10:25:00Z",
  },
];

export const incidentTrend: MetricPoint[] = Array.from(
  { length: 24 },
  (_, i) => ({
    timestamp: new Date(
      2026,
      1,
      14,
      i
    ).toISOString(),
    value: Math.floor(Math.random() * 5) + (i > 8 && i < 12 ? 3 : 0),
    label: `${i}:00`,
  })
);

export const responseTimes: MetricPoint[] = Array.from(
  { length: 24 },
  (_, i) => ({
    timestamp: new Date(2026, 1, 14, i).toISOString(),
    value: parseFloat((Math.random() * 6 + 2).toFixed(1)),
    label: `${i}:00`,
  })
);

export const costBreakdown: CostBreakdown[] = [
  { model: "gpt-4o-mini", tokens: 284500, cost: 4.27, percentage: 62 },
  { model: "claude-opus-4.6", tokens: 89200, cost: 2.14, percentage: 31 },
  { model: "gpt-4o", tokens: 12100, cost: 0.48, percentage: 7 },
];

export const systemHealth: SystemHealth[] = [
  {
    service: "Archestra Platform",
    status: "healthy",
    latency: 23,
    uptime: 99.97,
    lastCheck: "2026-02-14T11:50:00Z",
  },
  {
    service: "MCP Orchestrator",
    status: "healthy",
    latency: 45,
    uptime: 99.94,
    lastCheck: "2026-02-14T11:50:00Z",
  },
  {
    service: "Playwright MCP Server",
    status: "healthy",
    latency: 120,
    uptime: 99.89,
    lastCheck: "2026-02-14T11:50:00Z",
  },
  {
    service: "GitHub MCP Server",
    status: "healthy",
    latency: 67,
    uptime: 99.95,
    lastCheck: "2026-02-14T11:50:00Z",
  },
  {
    service: "Slack MCP Server",
    status: "degraded",
    latency: 340,
    uptime: 98.2,
    lastCheck: "2026-02-14T11:50:00Z",
  },
  {
    service: "PostgreSQL",
    status: "healthy",
    latency: 8,
    uptime: 99.99,
    lastCheck: "2026-02-14T11:50:00Z",
  },
];
