/**
 * Archestra Platform API Client
 *
 * Connects to the real Archestra platform running on port 9000.
 * Handles authentication, agent management, chat via A2A protocol,
 * and observability data.
 */

const ARCHESTRA_API_URL =
  process.env.ARCHESTRA_API_URL || "http://localhost:9000";
const ARCHESTRA_API_TOKEN = process.env.ARCHESTRA_API_TOKEN || "";

function headers(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    ...(ARCHESTRA_API_TOKEN
      ? { Authorization: `Bearer archestra_${ARCHESTRA_API_TOKEN}` }
      : {}),
  };
}

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T | null> {
  try {
    const res = await fetch(`${ARCHESTRA_API_URL}${path}`, {
      ...options,
      headers: { ...headers(), ...options?.headers },
    });
    if (!res.ok) {
      console.error(
        `Archestra API error: ${res.status} ${res.statusText} at ${path}`
      );
      return null;
    }
    return res.json();
  } catch (err) {
    console.error(`Archestra connection failed at ${path}:`, err);
    return null;
  }
}

// ─── Health Check ────────────────────────────────────────────

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${ARCHESTRA_API_URL}/health`, {
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ─── Agents ──────────────────────────────────────────────────

export interface ArchestraAgent {
  id: string;
  name: string;
  description?: string;
  systemPrompt?: string;
  model?: string;
  tools?: string[];
  status?: string;
}

export async function listAgents(): Promise<ArchestraAgent[] | null> {
  return request<ArchestraAgent[]>("/api/agents");
}

export async function getAgent(id: string): Promise<ArchestraAgent | null> {
  return request<ArchestraAgent>(`/api/agents/${id}`);
}

// ─── Chat via A2A Protocol ───────────────────────────────────

export interface A2AMessage {
  role: string;
  parts: { type: string; text: string }[];
}

export interface A2AResponse {
  id: string;
  result?: {
    artifacts?: {
      parts: { type: string; text: string }[];
    }[];
  };
  error?: { message: string };
}

export async function sendA2AMessage(
  agentPromptId: string,
  message: string
): Promise<A2AResponse | null> {
  return request<A2AResponse>(`/v1/a2a/${agentPromptId}`, {
    method: "POST",
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: `msg-${Date.now()}`,
      method: "message/send",
      params: {
        message: {
          role: "user",
          parts: [{ type: "text", text: message }],
        },
      },
    }),
  });
}

// ─── LLM Proxy (OpenAI-compatible) ──────────────────────────

export function getLLMProxyBaseURL(profileId?: string): string {
  if (profileId) {
    return `${ARCHESTRA_API_URL}/v1/openai/${profileId}`;
  }
  return `${ARCHESTRA_API_URL}/v1/openai`;
}

export function getGeminiProxyBaseURL(profileId: string): string {
  return `${ARCHESTRA_API_URL}/v1/gemini/${profileId}/v1beta`;
}

// ─── MCP Gateway ─────────────────────────────────────────────

export interface MCPGateway {
  id: string;
  name: string;
  tools: string[];
  agents: string[];
}

export async function listGateways(): Promise<MCPGateway[] | null> {
  return request<MCPGateway[]>("/api/gateways");
}

export function getMCPGatewayURL(gatewayId: string): string {
  return `${ARCHESTRA_API_URL}/v1/mcp/${gatewayId}`;
}

// ─── MCP Registry (installed servers) ────────────────────────

export interface MCPServer {
  id: string;
  name: string;
  description?: string;
  status?: string;
}

export async function listMCPServers(): Promise<MCPServer[] | null> {
  return request<MCPServer[]>("/api/tools");
}

// ─── Observability / Metrics ─────────────────────────────────

export async function getMetrics(): Promise<Record<string, unknown> | null> {
  return request<Record<string, unknown>>("/api/metrics");
}

export async function getChatHistory(
  limit = 50
): Promise<Record<string, unknown>[] | null> {
  return request<Record<string, unknown>[]>(
    `/api/chats?limit=${limit}`
  );
}

// ─── Utility ─────────────────────────────────────────────────

export function isLiveMode(): boolean {
  return process.env.USE_LIVE_DATA === "true";
}

export { ARCHESTRA_API_URL };
