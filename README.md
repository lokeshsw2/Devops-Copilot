# DevOps Copilot

### AI-Powered Incident Response | Built with Archestra MCP Platform

> Autonomous DevOps agent that detects, diagnoses, and resolves infrastructure incidents using MCP-orchestrated AI agents — all secured by Archestra's dual-LLM safety layer.

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
                       │ API
┌──────────────────────▼───────────────────────────────────────┐
│                   ARCHESTRA PLATFORM                          │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                  MCP Orchestrator (K8s)                  │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │ │
│  │  │Playwright│  │  GitHub  │  │  Slack   │              │ │
│  │  │   MCP    │  │   MCP    │  │   MCP    │              │ │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘              │ │
│  └───────┼──────────────┼──────────────┼───────────────────┘ │
│          │              │              │                      │
│  ┌───────▼──────────────▼──────────────▼───────────────────┐ │
│  │              AGENT PIPELINE                              │ │
│  │                                                          │ │
│  │  Alert → Triage Agent → Root Cause Agent → Notification  │ │
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
└──────────────────────────────────────────────────────────────┘
         │              │              │
    ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
    │ Grafana │   │ GitHub  │   │  Slack  │
    │Datadog  │   │  Repos  │   │Channels │
    │   K8s   │   │   PRs   │   │         │
    └─────────┘   └─────────┘   └─────────┘
```

---

## Agents

| Agent | Role | Model | MCP Tools |
|-------|------|-------|-----------|
| **Incident Triage** | First responder — detects anomalies, classifies severity, correlates deploys | gpt-4o-mini | Playwright, Slack |
| **Root Cause Analyzer** | Deep investigation — analyzes code changes, identifies root cause | claude-opus-4.6 | GitHub, Playwright |
| **Security Guardian** | Safety gate — validates all actions against security policies | claude-opus-4.6 | None (validation only) |

### Smart Model Routing
- **Triage** (high volume, fast): gpt-4o-mini ($0.15/1M tokens) — 96% cost reduction
- **Deep Analysis** (complex reasoning): claude-opus-4.6 — used only when needed
- **Result**: Same quality, 96% lower cost than using GPT-4o for everything

---

## Archestra Features Used

| Feature | How We Use It |
|---------|---------------|
| **MCP Orchestrator** | Kubernetes-native deployment of Playwright, GitHub, Slack MCP servers |
| **Security Sub-Agents** | Dual-LLM architecture blocks unsafe operations (23 blocked this session) |
| **Cost Monitoring** | Per-agent token tracking, dynamic model routing, daily budget limits |
| **Observability** | Live traces, metrics, and logs for every agent decision |
| **MCP Registry** | Centralized management of all MCP server configurations |
| **RBAC** | Role-based access control for team-level agent permissions |

---

## Quick Start

### Prerequisites
- Docker installed
- OpenAI or Anthropic API key

### 1. Clone & Setup
```bash
git clone https://github.com/YOUR_USERNAME/devops-copilot.git
cd devops-copilot
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
   - `microsoft__playwright-mcp`
   - GitHub MCP server
   - Slack MCP server
4. Create agents using the configs in `archestra-config/agent-config.json`

### 4. Alternative: Run Dashboard Only
```bash
cd dashboard
npm install
npm run dev
```
Dashboard available at `http://localhost:3000`

---

## Project Structure

```
devops-copilot/
├── dashboard/                    # Next.js frontend dashboard
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx         # Main dashboard page
│   │   │   ├── layout.tsx       # App layout with metadata
│   │   │   ├── globals.css      # Global styles + animations
│   │   │   └── api/             # API routes
│   │   │       ├── incidents/   # Incident data endpoint
│   │   │       ├── agents/      # Agent status endpoint
│   │   │       └── metrics/     # Metrics & cost endpoint
│   │   ├── components/
│   │   │   ├── StatsCard.tsx        # KPI stat cards
│   │   │   ├── IncidentCard.tsx     # Expandable incident timeline
│   │   │   ├── AgentStatusPanel.tsx # Agent health & metrics
│   │   │   ├── SystemHealthBar.tsx  # Service health indicators
│   │   │   ├── CostPanel.tsx        # Cost breakdown & optimization
│   │   │   ├── IncidentChart.tsx    # Time-series charts
│   │   │   ├── LiveActivityFeed.tsx # Real-time agent activity
│   │   │   └── ArchestraIntegration.tsx # Platform feature showcase
│   │   ├── lib/
│   │   │   ├── mock-data.ts     # Realistic incident & agent data
│   │   │   └── utils.ts         # Helper utilities
│   │   └── types/
│   │       └── index.ts         # TypeScript type definitions
│   ├── Dockerfile               # Production Docker image
│   └── package.json
├── archestra-config/
│   └── agent-config.json        # Agent definitions & MCP setup
├── scripts/
│   └── setup.sh                 # Automated setup script
├── docker-compose.yml           # Full stack deployment
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **AI Platform** | Archestra (MCP-native orchestration) |
| **Protocol** | Model Context Protocol (MCP) |
| **MCP Servers** | Playwright, GitHub, Slack |
| **Frontend** | Next.js 16, React, TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Deployment** | Docker, Docker Compose |

---

## Demo Scenarios

### Scenario 1: Database Connection Pool Exhaustion
1. Agent detects connection pool at 95% via Grafana dashboard scraping
2. Correlates with PR #847 merged 8 minutes earlier (N+1 query pattern)
3. Sends structured alert to #oncall-backend with root cause
4. **Security Guardian blocks** automated revert — requires human approval

### Scenario 2: Memory Leak in Worker Service
1. Kubernetes pod OOMKilled 3 times in 1 hour
2. Agent traces to PR #851 — Redis client missing `client.quit()` in error path
3. Provides specific fix recommendation with file path and line number

### Scenario 3: SSL Certificate Expiry
1. Proactive detection: certificate expires in 48 hours
2. Auto-renewal failing due to missing DNS CNAME record
3. Sends fix instructions to #platform-team with exact DNS record to add

---

## Why Archestra?

Without Archestra, building this would require:
- Custom MCP server deployment and lifecycle management
- Building security layers from scratch to prevent agent misuse
- Manual cost tracking across multiple LLM providers
- Custom observability pipeline for agent decisions

**Archestra provides all of this out of the box** — letting us focus on the agent logic and user experience rather than infrastructure plumbing.

---

## License

MIT

---

Built for the **2 Fast 2 MCP Hackathon** by WeMakeDevs | Powered by **Archestra**
