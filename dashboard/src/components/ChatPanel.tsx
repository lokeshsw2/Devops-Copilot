"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Loader2,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Incident } from "@/types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  tools?: string[];
}

const PREDEFINED_RESPONSES: Record<string, { content: string; tools: string[] }> = {
  "status": {
    content:
      "**Current System Status:**\n\n" +
      "- **3 active incidents** being investigated\n" +
      "- **INC-001** (Critical): DB connection pool at 95% — root cause identified as N+1 query in PR #847\n" +
      "- **INC-003** (Critical): Worker service memory leak — Redis client connection leak in PR #851\n" +
      "- **INC-002** (Warning): SSL cert expires in 48h — DNS validation fix sent to team\n\n" +
      "All 3 agents are active. Security Guardian has blocked 23 unsafe operations today. MTTR is 4.2 minutes.",
    tools: ["playwright-mcp", "slack-mcp"],
  },
  "inc-001": {
    content:
      "**INC-001 — Database Connection Pool Exhaustion**\n\n" +
      "**Severity:** Critical | **Status:** Investigating\n\n" +
      "**Timeline:**\n" +
      "1. 10:23 — Prometheus alert fired: pool at 95% (190/200 connections)\n" +
      "2. 10:23 — Triage Agent scraped Grafana → confirmed spike started at 10:15 UTC\n" +
      "3. 10:24 — Root Cause Agent checked GitHub → PR #847 'Add user analytics tracking' merged at 10:12\n" +
      "4. 10:24 — Found N+1 query pattern in `UserService.getAnalytics()`\n" +
      "5. 10:24 — Slack notification sent to #oncall-backend\n" +
      "6. 10:25 — **Security Guardian blocked** auto-revert — requires human approval\n\n" +
      "**Recommended Fix:** Add eager loading to the analytics query or revert PR #847.\n\n" +
      "**Cost:** 2,600 tokens ($0.004) | **Time saved:** ~25 min of manual investigation",
    tools: ["playwright-mcp", "github-mcp", "slack-mcp"],
  },
  "inc-003": {
    content:
      "**INC-003 — Memory Leak in Worker Service**\n\n" +
      "**Severity:** Critical | **Status:** Open\n\n" +
      "**Findings:**\n" +
      "- worker-service-7f8d9 OOMKilled 3x in the last hour\n" +
      "- Memory limit: 512Mi, current: 498Mi\n" +
      "- Linear growth at ~50MB/min\n\n" +
      "**Root Cause:** PR #851 'Add Redis caching layer' introduced a connection leak. " +
      "The Redis client is not calling `client.quit()` in the error handling `finally` block of `CacheService.get()`.\n\n" +
      "**Fix:** Add `client.quit()` in the `finally` block at `src/services/cache-service.ts:47`",
    tools: ["playwright-mcp", "github-mcp"],
  },
  "cost": {
    content:
      "**Cost Intelligence Report:**\n\n" +
      "| Model | Tokens | Cost | Share |\n" +
      "|-------|--------|------|-------|\n" +
      "| gpt-4o-mini | 284.5k | $4.27 | 62% |\n" +
      "| claude-3.5-sonnet | 89.2k | $2.14 | 31% |\n" +
      "| gpt-4o | 12.1k | $0.48 | 7% |\n\n" +
      "**Total spend today:** $6.89\n" +
      "**Daily budget:** $10.00 (69% used)\n\n" +
      "**Optimization:** Smart model routing uses gpt-4o-mini for initial triage (62% of calls) and only escalates to claude-3.5-sonnet for deep analysis. " +
      "This saves **96% vs using GPT-4o for everything** ($6.89 vs ~$172).",
    tools: [],
  },
  "security": {
    content:
      "**Security Guardian Report:**\n\n" +
      "**Blocked Actions Today: 23**\n\n" +
      "Recent blocks:\n" +
      "- **10:25** — Blocked auto-revert of PR #847 on `main` branch → Requires human approval\n" +
      "- **09:14** — Blocked direct DB query on production postgres → Read-only metrics allowed\n" +
      "- **08:45** — Blocked Slack message containing API key from log output → PII filter\n" +
      "- **07:30** — Blocked WAF rule modification → Security team approval required\n\n" +
      "**Dual-LLM Architecture:** All tool responses are validated by a secondary model before being passed back to the main agent. " +
      "This prevents prompt injection attacks where malicious content in tool outputs could manipulate the agent.",
    tools: [],
  },
  "agents": {
    content:
      "**Active Agents:**\n\n" +
      "**1. Incident Triage Agent** (gpt-4o-mini)\n" +
      "- Status: Active | 847 actions | 96.2% success | 3.4s avg\n" +
      "- Tools: Playwright MCP, Slack MCP\n" +
      "- Role: First responder — scrapes dashboards, classifies severity, sends alerts\n\n" +
      "**2. Root Cause Analyzer** (claude-3.5-sonnet)\n" +
      "- Status: Active | 312 actions | 91.8% success | 8.7s avg\n" +
      "- Tools: GitHub MCP, Playwright MCP\n" +
      "- Role: Deep investigation — correlates code changes with incidents\n\n" +
      "**3. Security Guardian** (claude-3.5-sonnet)\n" +
      "- Status: Active | 124 actions | 100% success | 1.2s avg\n" +
      "- Tools: None (validation only)\n" +
      "- Role: Safety gate — blocks unsafe operations, prevents data exfiltration",
    tools: [],
  },
};

function matchResponse(input: string): { content: string; tools: string[] } {
  const lower = input.toLowerCase();

  if (lower.includes("status") || lower.includes("what's happening") || lower.includes("overview"))
    return PREDEFINED_RESPONSES["status"];
  if (lower.includes("inc-001") || lower.includes("database") || lower.includes("connection pool"))
    return PREDEFINED_RESPONSES["inc-001"];
  if (lower.includes("inc-003") || lower.includes("memory") || lower.includes("worker") || lower.includes("leak"))
    return PREDEFINED_RESPONSES["inc-003"];
  if (lower.includes("cost") || lower.includes("spending") || lower.includes("budget") || lower.includes("token"))
    return PREDEFINED_RESPONSES["cost"];
  if (lower.includes("security") || lower.includes("blocked") || lower.includes("guardian"))
    return PREDEFINED_RESPONSES["security"];
  if (lower.includes("agent") || lower.includes("who"))
    return PREDEFINED_RESPONSES["agents"];
  if (lower.includes("inc-002") || lower.includes("ssl") || lower.includes("certificate"))
    return {
      content:
        "**INC-002 — SSL Certificate Expiring in 48 Hours**\n\n" +
        "**Severity:** Warning | **Status:** Investigating\n\n" +
        "Certificate for `api.production.com` expires Feb 16 at 03:00 UTC. Auto-renewal failed because the DNS-01 challenge CNAME record is missing.\n\n" +
        "**Fix sent to #platform-team:**\nAdd CNAME record: `_acme-challenge.api.production.com` → `validation.letsencrypt.org`\n\n" +
        "Once DNS propagates (~5 min), run `certbot renew` to complete renewal.",
      tools: ["playwright-mcp", "slack-mcp"],
    };
  if (lower.includes("help") || lower.includes("what can"))
    return {
      content:
        "I'm your **DevOps Copilot** — I can help you with:\n\n" +
        "- **\"What's the current status?\"** — Overview of all active incidents\n" +
        "- **\"Tell me about INC-001\"** — Deep dive into a specific incident\n" +
        "- **\"Show cost report\"** — Token usage and cost optimization details\n" +
        "- **\"Security report\"** — Blocked actions and safety metrics\n" +
        "- **\"Show agents\"** — Active agent status and performance\n" +
        "- **\"Investigate [issue]\"** — Trigger a new investigation\n\n" +
        "Try asking me anything about your infrastructure!",
      tools: [],
    };

  return {
    content:
      "I've initiated an investigation using the MCP tool pipeline:\n\n" +
      "1. **Playwright MCP** — Scraping relevant monitoring dashboards...\n" +
      "2. **GitHub MCP** — Checking recent code changes and deployments...\n" +
      "3. **Slack MCP** — Checking incident channels for related reports...\n\n" +
      `I'll analyze: "${input}" and report back with findings.\n\n` +
      "_In a live Archestra deployment, this would trigger real MCP tool calls orchestrated through the platform's Kubernetes-native orchestrator._",
    tools: ["playwright-mcp", "github-mcp", "slack-mcp"],
  };
}

const QUICK_ACTIONS = [
  "What's the current status?",
  "Tell me about INC-001",
  "Show cost report",
  "Security report",
];

export function ChatPanel({ incidents }: { incidents: Incident[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your **DevOps Copilot**, powered by Archestra MCP. I can investigate incidents, check system status, and analyze costs. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: msg,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate agent thinking
    setTimeout(() => {
      const response = matchResponse(msg);
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.content,
        timestamp: new Date(),
        tools: response.tools,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-900/30 transition-transform hover:scale-105"
      >
        <MessageSquare className="h-6 w-6 text-white" />
      </button>
    );
  }

  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/50 transition-all duration-300",
        isExpanded
          ? "bottom-4 left-4 right-4 top-4 sm:bottom-6 sm:left-auto sm:right-6 sm:top-6 sm:h-[calc(100vh-48px)] sm:w-[600px]"
          : "bottom-6 right-6 h-[520px] w-[400px]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              DevOps Copilot
            </p>
            <p className="text-xs text-zinc-500">via Archestra MCP</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-white"
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-2",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {msg.role === "assistant" && (
              <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-violet-600/20">
                <Bot className="h-3.5 w-3.5 text-violet-400" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm",
                msg.role === "user"
                  ? "bg-violet-600 text-white"
                  : "bg-zinc-900 text-zinc-300 border border-zinc-800"
              )}
            >
              {msg.role === "assistant" ? (
                <div
                  className="prose prose-sm prose-invert max-w-none [&_strong]:text-white [&_p]:my-1 [&_li]:my-0.5 [&_table]:text-xs"
                  dangerouslySetInnerHTML={{
                    __html: msg.content
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\n/g, "<br/>")
                      .replace(
                        /\|(.*)\|/g,
                        (match) => `<code>${match}</code>`
                      )
                      .replace(
                        /`(.*?)`/g,
                        '<code class="rounded bg-zinc-800 px-1 py-0.5 text-xs text-violet-400">$1</code>'
                      )
                      .replace(
                        /_(.*?)_/g,
                        '<em class="text-zinc-500">$1</em>'
                      ),
                  }}
                />
              ) : (
                <p>{msg.content}</p>
              )}
              {msg.tools && msg.tools.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1 border-t border-zinc-800 pt-2">
                  {msg.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-violet-400"
                    >
                      {tool.split("-")[0]}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {msg.role === "user" && (
              <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-zinc-700">
                <User className="h-3.5 w-3.5 text-zinc-300" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2">
            <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-violet-600/20">
              <Bot className="h-3.5 w-3.5 text-violet-400" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
              <span className="text-xs text-zinc-500">
                Querying MCP servers...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 2 && (
        <div className="flex flex-wrap gap-1.5 border-t border-zinc-800/50 px-4 py-2">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action}
              onClick={() => sendMessage(action)}
              className="rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-xs text-zinc-400 transition-colors hover:border-violet-600 hover:text-violet-400"
            >
              {action}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-zinc-800 bg-zinc-900/30 p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about incidents, costs, agents..."
            className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-violet-600"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
