# DevOps Copilot

### AI-Powered Incident Response | Built with Archestra MCP Platform

> Autonomous DevOps agent that detects, diagnoses, and resolves infrastructure incidents using MCP-orchestrated AI agents — all secured by Archestra's dual-LLM safety layer.

[![YouTube Demo](https://img.shields.io/badge/YouTube-Demo-red?logo=youtube)](https://www.youtube.com/watch?v=XzokGwxfadA&t=29s)

---

## The Problem

**Alert fatigue is killing SRE teams.** Modern infrastructure generates thousands of alerts daily. Engineers spend 70% of incident response time on triage — manually checking dashboards, correlating deploys, and paging the right people. By the time a human starts investigating, the blast radius has already expanded.

## The Solution

**DevOps Copilot** is an autonomous incident response system that:

1. **Detects** anomalies by scraping monitoring dashboards (Grafana, Datadog, K8s) via Playwright MCP
2. **Diagnoses** root causes by correlating with recent code changes via GitHub MCP
3. **Notifies** the right on-call team with full context via Slack MCP
4. **Prevents** unsafe auto-remediation via Archestra's Security Sub-Agent

All orchestrated through **Archestra's MCP-native platform** with full observability, cost controls, and security guardrails.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    DevOps Copilot Dashboard                   │
│              (Next.js • Real-time • Observability)            │
└──────────────────────┬───────────────────────────────────────┘
                       │ API (REST + A2A Protocol)
┌──────────────────────▼───────────────────────────────────────┐
│                   ARCHESTRA PLATFORM                          │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │            MCP Orchestrator (Embedded KinD K8s)          │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │ │
│  │  │Playwright│  │  GitHub  │  │  Slack   │              │ │
│  │  │   MCP    │  │   MCP    │  │   MCP    │              │ │
│  │  │(Browser) │  │(Code+PRs)│  │(Alerts)  │              │ │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘              │ │
│  └───────┼──────────────┼──────────────┼───────────────────┘ │
│          │              │              │                      │
│  ┌───────▼──────────────▼──────────────▼───────────────────┐ │
│  │              AGENT PIPELINE (A2A Protocol)               │ │
│  │                                                          │ │
│  │  Alert → Triage Agent → Root Cause Agent → Notification  │ │
│  │         (gpt-4o-mini)   (claude-opus-4.6)                │ │
│  │              │                │                │          │ │
│  │              └────────┬───────┘                │          │ │
│  │                       ▼                        │          │ │
│  │              Security Guardian                 │          │ │
│  │           (Dual-LLM Safety Gate)               │          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ Cost     │  │ Observ-  │  │ Security │  │ Model    │     │
│  │ Controls │  │ ability  │  │ Policies │  │ Routing  │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ LLM      │  │  MCP     │  │  A2A     │  │ Secrets  │     │
│  │ Proxy    │  │ Registry │  │ Protocol │  │ Manager  │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
└──────────────────────────────────────────────────────────────┘
         │              │              │
    ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
    │ Grafana │   │ GitHub  │   │  Slack  │
    │Datadog  │   │  Repos  │   │Channels │
    │   K8s   │   │   PRs   │   │ Alerts  │
    └─────────┘   └─────────┘   └─────────┘
```

---

## Agents

| Agent | Role | Model | MCP Tools |
|-------|------|-------|-----------|
| **Incident Triage** | First responder — detects anomalies, classifies severity, correlates deploys, sends initial alerts | gpt-4o-mini | Playwright MCP, Slack MCP |
| **Root Cause Analyzer** | Deep investigation — analyzes code changes, infrastructure metrics, identifies root cause with file paths and line numbers | claude-opus-4.6 | GitHub MCP, Playwright MCP |
| **Security Guardian** | Safety gate — validates ALL agent actions against security policies using dual-LLM architecture before execution | claude-opus-4.6 | None (validation only) |

### Agent Pipeline Flow

```
1. ALERT DETECTED
   └→ Monitoring dashboard anomaly triggers pipeline

2. INCIDENT TRIAGE AGENT (gpt-4o-mini)
   ├→ Playwright MCP: Scrapes Grafana/Datadog dashboards for metrics
   ├→ Classifies severity (critical/warning/info)
   ├→ Correlates timing with recent deployments
   └→ Slack MCP: Sends structured alert to on-call channel

3. ROOT CAUSE ANALYZER (claude-opus-4.6)
   ├→ GitHub MCP: Reviews recent PRs, commits, config changes
   ├→ Playwright MCP: Gathers detailed metrics and error distributions
   ├→ Forms hypotheses and identifies specific code path causing issue
   └→ Provides actionable fix with file paths and line numbers

4. SECURITY GUARDIAN (claude-opus-4.6)
   ├→ Validates every action before execution
   ├→ BLOCKS: Direct pushes to main, auto-reverts, DB schema changes
   ├→ ALLOWS: Draft PRs, Slack notifications, reading metrics
   └→ ESCALATES: Actions requiring human approval

5. RESOLUTION
   └→ Slack MCP: Posts root cause analysis + fix recommendation to team
```

### Smart Model Routing
- **Triage** (high volume, fast): gpt-4o-mini ($0.15/1M tokens) — 96% cost reduction
- **Deep Analysis** (complex reasoning): claude-opus-4.6 — used only when needed
- **Security Validation**: claude-opus-4.6 — deterministic safety checks
- **Result**: Same quality, 96% lower cost than using GPT-4o for everything

---

## Archestra Features Used — Deep Dive

### 1. MCP Orchestrator (Kubernetes-Native)
Archestra runs an **embedded KinD (Kubernetes-in-Docker) cluster** that manages all MCP servers as Kubernetes pods. This gives us:
- **Automatic lifecycle management** — MCP servers are deployed, scaled, and restarted automatically
- **Resource isolation** — each MCP server runs in its own pod with defined CPU/memory limits
- **Health monitoring** — K8s liveness/readiness probes ensure MCP servers are always available

**MCP Servers Deployed:**

| MCP Server | K8s Pod | Purpose |
|-----------|---------|---------|
| **Playwright MCP** | `@playwright/mcp --headless` | Browser automation to scrape Grafana, Datadog, CloudWatch, and K8s dashboards for real-time metrics |
| **GitHub MCP** | `github-mcp-server` | Accesses repositories, reviews recent PRs/commits, identifies code changes correlated with incidents |
| **Slack MCP** | `slack-mcp-server` | Sends structured alerts to on-call channels, creates incident threads, posts resolution updates |

### 2. Security Sub-Agents (Dual-LLM Architecture)
The **Security Guardian** acts as a deterministic safety layer between agents and MCP tool execution:
- **Dual-LLM pattern**: One LLM (agent) proposes actions, a separate LLM (Security Guardian) validates them
- **Policy enforcement**: Read-only by default, blocks production writes, prevents data exfiltration
- **Rate limiting**: Max 10 MCP calls/min per agent, 50 Slack messages/hour, 20 GitHub API calls/min
- **Audit logging**: Every APPROVED/BLOCKED/ESCALATED decision is logged with policy citation
- **23 unsafe operations blocked** in testing (auto-reverts, direct main pushes, credential access)

### 3. A2A Protocol (Agent-to-Agent Communication)
Agents communicate via Archestra's **JSON-RPC 2.0 A2A protocol** at `/v1/a2a/{promptId}`:
- Dashboard sends incident context to Triage Agent
- Triage Agent passes findings to Root Cause Analyzer
- All inter-agent messages are logged for observability
- Enables the pipeline: Alert → Triage → Root Cause → Security Gate → Resolution

### 4. LLM Proxy (OpenAI-Compatible Gateway)
Archestra provides a **unified LLM gateway** at `/v1/openai/chat/completions`:
- Routes requests to the optimal model based on task type
- Supports multiple providers (OpenAI, Anthropic, Google) through a single endpoint
- Enables **smart model routing**: gpt-4o-mini for triage, claude-opus-4.6 for analysis
- Built-in token tracking and cost monitoring per request

### 5. MCP Registry
Centralized management of all MCP server configurations:
- **Install from catalog**: One-click install of community MCP servers
- **Custom servers**: Create custom MCP server definitions with command/args/env
- **Version management**: Track and update MCP server versions
- **Configuration**: Environment variables and secrets managed per server

### 6. MCP Gateway
Single entry point for all MCP tool calls at `/v1/mcp/gateway`:
- Agents don't need to know individual MCP server addresses
- All tool calls routed through the gateway with authentication
- Enables the Security Guardian to intercept and validate every tool call

### 7. Cost Monitoring & Optimization
Per-agent token tracking with dynamic model routing:
- **Daily budget limit**: $10/day with 80% alert threshold
- **Per-agent breakdown**: Track tokens and cost for each agent separately
- **Model routing**: Automatically routes to cheaper models for simple tasks
- **96% cost reduction** vs using GPT-4o for everything

### 8. Full Observability
Live traces, metrics, and logs for every agent decision:
- **Token usage**: Per-request and per-agent token consumption
- **Latency tracking**: Response times for each MCP server and agent
- **Success rates**: Track reliability per MCP server
- **Decision logs**: Full audit trail of agent reasoning and actions

### 9. RBAC & Secrets Management
- **Role-based access control**: Team-level permissions for agent configurations
- **Secrets management**: API keys (Slack tokens, GitHub tokens) stored securely in Archestra
- **Environment injection**: Secrets injected into MCP server pods at runtime via K8s secrets

---

## Quick Start

### Prerequisites
- Docker installed
- OpenAI or Anthropic or Google (Gemini) API key

### 1. Clone & Setup
```bash
git clone https://github.com/lokeshsw2/Devops-Copilot.git
cd Devops-Copilot
```

### 2. Start with Docker Compose
```bash
docker compose up -d
```

This starts:
- **Archestra Platform** at `http://localhost:3000` (Admin UI) and `http://localhost:9000` (API)
- **DevOps Copilot Dashboard** at `http://localhost:3001`

### 3. Configure Archestra
1. Open `http://localhost:3000` (Archestra Admin)
2. Add your LLM API keys in **Settings → LLM API Keys**
3. Go to **MCP Registry** and install:
   - **Playwright MCP**: `@playwright/mcp` with `--headless` flag for browser automation
   - **GitHub MCP**: GitHub MCP server with your GitHub token
   - **Slack MCP**: Slack MCP server with your `SLACK_MCP_XOXB_TOKEN`
4. Create agents using the configs in `archestra-config/agent-config.json`

### 4. Alternative: Run Dashboard Only (Demo Mode)
```bash
cd dashboard
npm install
npm run dev
```
Dashboard available at `http://localhost:3001` with simulated incident data and AI chat.

### 5. Deploy to Vercel
The dashboard can be deployed to Vercel with mock data for live demos:
- Set root directory to `dashboard`
- Add `GEMINI_API_KEY` environment variable for AI chat functionality
- The dashboard automatically falls back to demo mode when Archestra is not available

---

## Project Structure

```
devops-copilot/
├── dashboard/                    # Next.js frontend dashboard
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx         # Main dashboard with filters, search, simulation
│   │   │   ├── layout.tsx       # App layout with metadata
│   │   │   ├── globals.css      # Global styles + animations
│   │   │   └── api/             # API routes (live/mock fallback)
│   │   │       ├── incidents/   # Incident data endpoint
│   │   │       ├── agents/      # Agent status endpoint
│   │   │       ├── metrics/     # Metrics & cost endpoint
│   │   │       ├── chat/        # AI chat (A2A → LLM Proxy → Gemini → Mock)
│   │   │       └── health/      # Health check endpoint
│   │   ├── components/
│   │   │   ├── StatsCard.tsx        # KPI stat cards
│   │   │   ├── IncidentCard.tsx     # Expandable incident timeline with agent actions
│   │   │   ├── AgentStatusPanel.tsx # Agent health, success rates, MCP tools
│   │   │   ├── SystemHealthBar.tsx  # Service health indicators
│   │   │   ├── CostPanel.tsx        # Cost breakdown & smart routing metrics
│   │   │   ├── IncidentChart.tsx    # Time-series incident & response charts
│   │   │   ├── LiveActivityFeed.tsx # Real-time agent activity stream
│   │   │   ├── ChatPanel.tsx        # AI chat with Archestra/Gemini integration
│   │   │   ├── SimulationControl.tsx # Live incident simulation controls
│   │   │   └── ArchestraIntegration.tsx # Platform feature showcase
│   │   ├── hooks/
│   │   │   └── useSimulation.ts # Real-time incident simulation engine
│   │   ├── lib/
│   │   │   ├── mock-data.ts     # Realistic incident & agent data
│   │   │   ├── archestra-client.ts # Archestra API client (A2A, LLM Proxy, MCP Gateway)
│   │   │   └── utils.ts         # Helper utilities
│   │   └── types/
│   │       └── index.ts         # TypeScript type definitions
│   ├── Dockerfile               # Multi-stage production Docker image
│   └── package.json
├── archestra-config/
│   └── agent-config.json        # Agent definitions, MCP setup, security policies
├── scripts/
│   ├── setup.sh                 # Automated setup script
│   └── setup-archestra.sh       # Archestra configuration automation
├── docker-compose.yml           # Full stack deployment
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **AI Platform** | Archestra (MCP-native orchestration with embedded K8s) |
| **Protocol** | Model Context Protocol (MCP) + Agent-to-Agent (A2A) |
| **MCP Servers** | Playwright (browser), GitHub (code), Slack (notifications) |
| **AI Models** | gpt-4o-mini (triage), claude-opus-4.6 (analysis), Gemini (chat) |
| **Frontend** | Next.js 16, React, TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **AI SDK** | Vercel AI SDK |
| **Deployment** | Docker, Docker Compose, Vercel |

---

## Demo Scenarios

### Scenario 1: Database Connection Pool Exhaustion
1. Agent detects connection pool at 95% via Grafana dashboard scraping (Playwright MCP)
2. Root Cause Analyzer correlates with PR #847 merged 8 minutes earlier — N+1 query pattern (GitHub MCP)
3. Sends structured alert to #oncall-backend with root cause analysis (Slack MCP)
4. **Security Guardian blocks** automated revert — requires human approval

### Scenario 2: Memory Leak in Worker Service
1. Kubernetes pod OOMKilled 3 times in 1 hour (Playwright MCP detects via K8s dashboard)
2. Agent traces to PR #851 — Redis client missing `client.quit()` in error path (GitHub MCP)
3. Provides specific fix recommendation with file path and line number
4. Posts fix to #platform-team Slack channel (Slack MCP)

### Scenario 3: SSL Certificate Expiry
1. Proactive detection: certificate expires in 48 hours (Playwright MCP)
2. Auto-renewal failing due to missing DNS CNAME record
3. Sends fix instructions to #platform-team with exact DNS record to add (Slack MCP)

### Scenario 4: Redis Cluster Failover (Live Simulation)
1. Real-time simulation in dashboard shows agents responding to Redis sentinel failover
2. Security Guardian **blocks WAF rule modification** — escalates to human
3. Full agent timeline visible in dashboard with MCP tool calls and token costs

---

## Why Archestra?

Without Archestra, building this would require:
- Custom MCP server deployment and lifecycle management on Kubernetes
- Building dual-LLM security layers from scratch to prevent agent misuse
- Manual cost tracking across multiple LLM providers (OpenAI, Anthropic, Google)
- Custom observability pipeline for agent decisions and MCP tool calls
- Building A2A communication protocol between agents
- Managing secrets and API keys for each MCP server manually

**Archestra provides all of this out of the box** — letting us focus on the agent logic and user experience rather than infrastructure plumbing. We leverage 9 core Archestra features: MCP Orchestrator, Security Sub-Agents, A2A Protocol, LLM Proxy, MCP Registry, MCP Gateway, Cost Monitoring, Observability, and RBAC with Secrets Management.

---

## License

MIT

---

Built for the **2 Fast 2 MCP Hackathon** by WeMakeDevs | Powered by **Archestra**
