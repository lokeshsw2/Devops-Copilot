import { NextResponse } from "next/server";
import {
  incidentTrend,
  responseTimes,
  costBreakdown,
  systemHealth,
} from "@/lib/mock-data";

const ARCHESTRA_API_URL =
  process.env.ARCHESTRA_API_URL || "http://localhost:9000";

export async function GET() {
  // In production, fetch observability data from Archestra API:
  // const [metrics, costs, health] = await Promise.all([
  //   fetch(`${ARCHESTRA_API_URL}/v1/metrics`).then(r => r.json()),
  //   fetch(`${ARCHESTRA_API_URL}/v1/costs`).then(r => r.json()),
  //   fetch(`${ARCHESTRA_API_URL}/v1/health`).then(r => r.json()),
  // ]);

  return NextResponse.json({
    incidentTrend,
    responseTimes,
    costBreakdown,
    systemHealth,
  });
}
