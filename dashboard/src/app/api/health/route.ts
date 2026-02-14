import { NextResponse } from "next/server";
import { checkHealth, ARCHESTRA_API_URL, isLiveMode } from "@/lib/archestra-client";

export async function GET() {
  const archestraHealthy = await checkHealth();
  const geminiConfigured = !!process.env.GEMINI_API_KEY;
  const liveMode = isLiveMode();

  return NextResponse.json({
    dashboard: "healthy",
    archestra: {
      url: ARCHESTRA_API_URL,
      connected: archestraHealthy,
    },
    gemini: {
      configured: geminiConfigured,
    },
    liveMode,
    mode: liveMode
      ? archestraHealthy
        ? "archestra-live"
        : geminiConfigured
        ? "gemini-direct"
        : "mock-fallback"
      : "mock",
  });
}
