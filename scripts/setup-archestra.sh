#!/bin/bash
set -euo pipefail

# ═══════════════════════════════════════════════════════════════
#  DevOps Copilot — Archestra Live Setup
#  Connects the dashboard to real Archestra + MCP servers
# ═══════════════════════════════════════════════════════════════

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

ARCHESTRA_API="http://localhost:9000"
ARCHESTRA_UI="http://localhost:3000"

echo ""
echo -e "${CYAN}═══════════════════════════════════════════${NC}"
echo -e "${CYAN}  DevOps Copilot — Live Setup${NC}"
echo -e "${CYAN}═══════════════════════════════════════════${NC}"
echo ""

# ─── Step 1: Check Docker ────────────────────────────────────
echo -e "${BLUE}[1/7] Checking Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}  Docker not found! Install Docker Desktop first:${NC}"
    echo "    brew install --cask docker"
    echo "    Then open Docker Desktop app and wait for it to start."
    exit 1
fi

if ! docker info &> /dev/null 2>&1; then
    echo -e "${YELLOW}  Docker is installed but not running. Starting Docker Desktop...${NC}"
    open -a Docker
    echo "  Waiting for Docker to start (this takes 30-60 seconds)..."
    for i in {1..30}; do
        if docker info &> /dev/null 2>&1; then
            break
        fi
        sleep 3
        echo "  Waiting... ($i)"
    done
    if ! docker info &> /dev/null 2>&1; then
        echo -e "${RED}  Docker didn't start in time. Open Docker Desktop manually and re-run.${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}  ✓ Docker is running${NC}"

# ─── Step 2: Start Archestra ─────────────────────────────────
echo ""
echo -e "${BLUE}[2/7] Starting Archestra platform...${NC}"

# Stop existing container if running
docker rm -f devops-copilot-archestra 2>/dev/null || true

docker pull archestra/platform:latest 2>&1 | tail -1

docker run -d \
  --name devops-copilot-archestra \
  -p 9000:9000 \
  -p 3000:3000 \
  -e ARCHESTRA_QUICKSTART=true \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v archestra-postgres-data:/var/lib/postgresql/data \
  -v archestra-app-data:/app/data \
  archestra/platform:latest > /dev/null

echo -e "${GREEN}  ✓ Archestra container started${NC}"

# ─── Step 3: Wait for Archestra ──────────────────────────────
echo ""
echo -e "${BLUE}[3/7] Waiting for Archestra to be ready...${NC}"
for i in {1..60}; do
    if curl -s "$ARCHESTRA_API/health" > /dev/null 2>&1; then
        echo -e "${GREEN}  ✓ Archestra is ready!${NC}"
        break
    fi
    if [ "$i" -eq 60 ]; then
        echo -e "${RED}  Archestra didn't start in time. Check: docker logs devops-copilot-archestra${NC}"
        exit 1
    fi
    printf "  Waiting... (%d/60)\r" "$i"
    sleep 3
done

# ─── Step 4: Gemini API Key ──────────────────────────────────
echo ""
echo -e "${BLUE}[4/7] Configuring Gemini API key...${NC}"

ENV_FILE="$(dirname "$0")/../dashboard/.env.local"

if grep -q "GEMINI_API_KEY=$" "$ENV_FILE" 2>/dev/null || ! grep -q "GEMINI_API_KEY" "$ENV_FILE" 2>/dev/null; then
    echo -e "${YELLOW}  Enter your Gemini API key (from https://aistudio.google.com/apikey):${NC}"
    read -r -s GEMINI_KEY
    echo ""

    if [ -n "$GEMINI_KEY" ]; then
        # Update .env.local
        if grep -q "GEMINI_API_KEY" "$ENV_FILE" 2>/dev/null; then
            sed -i '' "s/GEMINI_API_KEY=.*/GEMINI_API_KEY=$GEMINI_KEY/" "$ENV_FILE"
        else
            echo "GEMINI_API_KEY=$GEMINI_KEY" >> "$ENV_FILE"
        fi
        echo -e "${GREEN}  ✓ Gemini API key saved${NC}"
    else
        echo -e "${YELLOW}  Skipped — chat will use mock responses${NC}"
    fi
else
    echo -e "${GREEN}  ✓ Gemini API key already configured${NC}"
fi

# ─── Step 5: Enable Live Mode ────────────────────────────────
echo ""
echo -e "${BLUE}[5/7] Enabling live mode...${NC}"

if grep -q "USE_LIVE_DATA" "$ENV_FILE" 2>/dev/null; then
    sed -i '' "s/USE_LIVE_DATA=.*/USE_LIVE_DATA=true/" "$ENV_FILE"
else
    echo "USE_LIVE_DATA=true" >> "$ENV_FILE"
fi
echo -e "${GREEN}  ✓ Live mode enabled${NC}"

# ─── Step 6: Install Dashboard Dependencies ──────────────────
echo ""
echo -e "${BLUE}[6/7] Setting up dashboard...${NC}"
cd "$(dirname "$0")/../dashboard"
npm install --silent 2>&1 | tail -1
echo -e "${GREEN}  ✓ Dependencies installed${NC}"

# ─── Step 7: Print Next Steps ────────────────────────────────
echo ""
echo -e "${CYAN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}  Setup Complete!${NC}"
echo -e "${CYAN}═══════════════════════════════════════════${NC}"
echo ""
echo -e "  ${CYAN}Archestra Admin:${NC}  $ARCHESTRA_UI"
echo -e "  ${CYAN}Archestra API:${NC}    $ARCHESTRA_API"
echo ""
echo -e "  ${YELLOW}Next steps (in Archestra UI at $ARCHESTRA_UI):${NC}"
echo ""
echo "  1. Go to Settings → LLM API Keys"
echo "     Add your Gemini key (or OpenAI/Anthropic)"
echo ""
echo "  2. Go to MCP Registry → Install these MCP servers:"
echo -e "     ${CYAN}• microsoft__playwright-mcp${NC}  (browser automation)"
echo -e "     ${CYAN}• Any GitHub MCP server${NC}       (code analysis)"
echo -e "     ${CYAN}• Any Slack MCP server${NC}        (notifications)"
echo ""
echo "  3. Go to Agents → Create 3 agents:"
echo -e "     ${CYAN}• Incident Triage Agent${NC}       (gpt-4o-mini / gemini-flash)"
echo -e "     ${CYAN}• Root Cause Analyzer${NC}         (gemini-pro / claude)"
echo -e "     ${CYAN}• Security Guardian${NC}           (validation sub-agent)"
echo "     (Use system prompts from archestra-config/agent-config.json)"
echo ""
echo "  4. Start the dashboard:"
echo -e "     ${GREEN}cd dashboard && npm run dev${NC}"
echo -e "     Open ${CYAN}http://localhost:3001${NC}"
echo ""
echo "  5. The chat panel will now use REAL Gemini AI responses!"
echo "     Try: 'What should I check if my API is returning 500 errors?'"
echo ""
