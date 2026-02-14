import { NextResponse } from "next/server";
import { incidents, dashboardStats } from "@/lib/mock-data";
import { isLiveMode, checkHealth, getChatHistory } from "@/lib/archestra-client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const severity = searchParams.get("severity");
  const status = searchParams.get("status");

  // Live mode: fetch real chat/agent history from Archestra
  if (isLiveMode()) {
    const healthy = await checkHealth();
    if (healthy) {
      const history = await getChatHistory(50);
      if (history) {
        return NextResponse.json({
          incidents: history,
          stats: dashboardStats,
          source: "archestra-live",
        });
      }
    }
  }

  // Mock data with filtering
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
    source: "mock",
  });
}
