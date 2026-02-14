import { NextResponse } from "next/server";
import { agentConfigs } from "@/lib/mock-data";

const ARCHESTRA_API_URL =
  process.env.ARCHESTRA_API_URL || "http://localhost:9000";

export async function GET() {
  // In production, fetch real agent data from Archestra API:
  // const res = await fetch(`${ARCHESTRA_API_URL}/v1/agents`);
  // const agents = await res.json();

  return NextResponse.json({
    agents: agentConfigs,
    total: agentConfigs.length,
    active: agentConfigs.filter((a) => a.status === "active").length,
  });
}
