import { NextResponse } from "next/server";
import { agentConfigs } from "@/lib/mock-data";
import { isLiveMode, listAgents, checkHealth } from "@/lib/archestra-client";

export async function GET() {
  // Live mode: fetch real agents from Archestra
  if (isLiveMode()) {
    const healthy = await checkHealth();
    if (healthy) {
      const liveAgents = await listAgents();
      if (liveAgents) {
        return NextResponse.json({
          agents: liveAgents,
          total: liveAgents.length,
          active: liveAgents.length,
          source: "archestra-live",
        });
      }
    }
    // Archestra unreachable — fall through to mock
  }

  return NextResponse.json({
    agents: agentConfigs,
    total: agentConfigs.length,
    active: agentConfigs.filter((a) => a.status === "active").length,
    source: "mock",
  });
}
