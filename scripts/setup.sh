#!/bin/bash
set -euo pipefail

# DevOps Copilot - Archestra Setup Script
# This script sets up the complete DevOps Copilot platform

echo "============================================"
echo "  DevOps Copilot - Setup Script"
echo "  Powered by Archestra MCP Platform"
echo "============================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check prerequisites
echo -e "${BLUE}[1/6] Checking prerequisites...${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    echo "  macOS: brew install --cask docker"
    echo "  Linux: https://docs.docker.com/engine/install/"
    exit 1
fi

echo -e "${GREEN}  ✓ Docker found${NC}"

# Pull Archestra platform
echo ""
echo -e "${BLUE}[2/6] Pulling Archestra platform...${NC}"
docker pull archestra/platform:latest
echo -e "${GREEN}  ✓ Archestra platform pulled${NC}"

# Start Archestra
echo ""
echo -e "${BLUE}[3/6] Starting Archestra platform...${NC}"
docker run -d \
  --name devops-copilot-archestra \
  -p 9000:9000 \
  -p 3000:3000 \
  -e ARCHESTRA_QUICKSTART=true \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v archestra-postgres-data:/var/lib/postgresql/data \
  -v archestra-app-data:/app/data \
  archestra/platform:latest

echo -e "${GREEN}  ✓ Archestra platform started${NC}"
echo -e "${YELLOW}  Admin UI: http://localhost:3000${NC}"
echo -e "${YELLOW}  API:      http://localhost:9000${NC}"

# Wait for Archestra to be ready
echo ""
echo -e "${BLUE}[4/6] Waiting for Archestra to be ready...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:9000/health > /dev/null 2>&1; then
        echo -e "${GREEN}  ✓ Archestra is ready!${NC}"
        break
    fi
    echo "  Waiting... ($i/30)"
    sleep 5
done

# Install MCP servers
echo ""
echo -e "${BLUE}[5/6] MCP Servers to install via Archestra UI:${NC}"
echo "  1. Navigate to http://localhost:3000"
echo "  2. Go to MCP Registry"
echo "  3. Install the following MCP servers:"
echo -e "     ${YELLOW}• microsoft__playwright-mcp${NC} - Browser automation for dashboard scraping"
echo -e "     ${YELLOW}• github (or equivalent)${NC}     - GitHub integration for PR/deploy correlation"
echo -e "     ${YELLOW}• slack (or equivalent)${NC}      - Slack for incident notifications"
echo ""

# Setup Dashboard
echo -e "${BLUE}[6/6] Setting up DevOps Copilot Dashboard...${NC}"
cd "$(dirname "$0")/../dashboard"
npm install
npm run build
echo -e "${GREEN}  ✓ Dashboard built successfully${NC}"
echo ""
echo "============================================"
echo -e "${GREEN}  Setup Complete!${NC}"
echo "============================================"
echo ""
echo "  Archestra Admin:  http://localhost:3000"
echo "  Archestra API:    http://localhost:9000"
echo "  Dashboard:        Run 'npm start' in ./dashboard"
echo ""
echo "  Next steps:"
echo "  1. Add your LLM API keys in Archestra Settings"
echo "  2. Install MCP servers from the registry"
echo "  3. Create agents using archestra-config/agent-config.json"
echo "  4. Start the dashboard: cd dashboard && npm start"
echo ""
