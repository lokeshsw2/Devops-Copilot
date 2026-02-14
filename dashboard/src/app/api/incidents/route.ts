import { NextResponse } from "next/server";
import { incidents, dashboardStats } from "@/lib/mock-data";

const ARCHESTRA_API_URL =
  process.env.ARCHESTRA_API_URL || "http://localhost:9000";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const severity = searchParams.get("severity");
  const status = searchParams.get("status");

  // In production, this would fetch from Archestra API
  // Example: const res = await fetch(`${ARCHESTRA_API_URL}/v1/agents/incidents`);

  let filtered = incidents;

  if (severity && severity !== "all") {
    filtered = filtered.filter((i) => i.severity === severity);
  }
  if (status) {
    filtered = filtered.filter((i) => i.status === status);
  }

  return NextResponse.json({
    incidents: filtered,
    stats: dashboardStats,
  });
}
