import { NextResponse } from "next/server";
import {
  incidentTrend,
  responseTimes,
  costBreakdown,
  systemHealth,
} from "@/lib/mock-data";
import { isLiveMode, checkHealth, getMetrics } from "@/lib/archestra-client";

export async function GET() {
  if (isLiveMode()) {
    const healthy = await checkHealth();
    if (healthy) {
      const liveMetrics = await getMetrics();
      if (liveMetrics) {
        return NextResponse.json({
          ...liveMetrics,
          source: "archestra-live",
        });
      }
    }
  }

  return NextResponse.json({
    incidentTrend,
    responseTimes,
    costBreakdown,
    systemHealth,
    source: "mock",
  });
}
