export type Severity = "critical" | "warning" | "info" | "resolved";

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: "open" | "investigating" | "resolved";
  source: string;
  detectedAt: string;
  resolvedAt?: string;
  agentActions: AgentAction[];
  rootCause?: string;
  costSaved?: number;
}

export interface AgentAction {
  id: string;
  incidentId: string;
  tool: string;
  mcpServer: string;
  action: string;
  result: string;
  timestamp: string;
  status: "success" | "failed" | "blocked";
  blockedReason?: string;
  tokenCost: number;
  model: string;
}

export interface AgentConfig {
  id: string;
  name: string;
  status: "active" | "idle" | "error";
  mcpServers: string[];
  model: string;
  totalActions: number;
  successRate: number;
  avgResponseTime: number;
  lastActive: string;
}

export interface MetricPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface CostBreakdown {
  model: string;
  tokens: number;
  cost: number;
  percentage: number;
}

export interface SystemHealth {
  service: string;
  status: "healthy" | "degraded" | "down";
  latency: number;
  uptime: number;
  lastCheck: string;
}

export interface DashboardStats {
  totalIncidents: number;
  activeIncidents: number;
  mttr: number;
  costSaved: number;
  agentActions: number;
  securityBlocked: number;
}
