import { NextResponse } from "next/server";
import {
  isLiveMode,
  checkHealth,
  sendA2AMessage,
  getLLMProxyBaseURL,
  ARCHESTRA_API_URL,
} from "@/lib/archestra-client";

export async function POST(request: Request) {
  const body = await request.json();
  const { message, agentId } = body as {
    message: string;
    agentId?: string;
  };

  if (!message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  // ─── Live Mode: Talk to real Archestra agent ───────────────
  if (isLiveMode()) {
    const healthy = await checkHealth();

    if (healthy && agentId) {
      // Option 1: A2A Protocol (agent-to-agent)
      const a2aResponse = await sendA2AMessage(agentId, message);
      if (a2aResponse?.result?.artifacts) {
        const text = a2aResponse.result.artifacts
          .flatMap((a) => a.parts)
          .filter((p) => p.type === "text")
          .map((p) => p.text)
          .join("\n");

        return NextResponse.json({
          response: text,
          source: "archestra-a2a",
          agentId,
        });
      }
    }

    if (healthy) {
      // Option 2: LLM Proxy (OpenAI-compatible) with DevOps system prompt
      try {
        const proxyURL = getLLMProxyBaseURL();
        const geminiKey = process.env.GEMINI_API_KEY;

        const llmResponse = await fetch(
          `${proxyURL}/chat/completions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(geminiKey ? { "x-goog-api-key": geminiKey } : {}),
            },
            body: JSON.stringify({
              model: "gemini-2.0-flash",
              messages: [
                {
                  role: "system",
                  content: `You are DevOps Copilot, an AI-powered incident response assistant running on the Archestra MCP platform.

You have access to these MCP tools:
- Playwright MCP: Scrapes monitoring dashboards (Grafana, Datadog, Kubernetes, CloudWatch)
- GitHub MCP: Checks recent PRs, deployments, and code changes
- Slack MCP: Sends alerts and coordinates incident response

When users ask about incidents, system status, costs, or security:
- Provide specific, actionable responses
- Reference real tools and MCP servers you would use
- Include estimated token costs and time savings
- Mention Archestra security features (dual-LLM, blocked actions) when relevant

Be concise, technical, and actionable. Use markdown formatting.`,
                },
                { role: "user", content: message },
              ],
              max_tokens: 2000,
              temperature: 0.3,
            }),
          }
        );

        if (llmResponse.ok) {
          const data = await llmResponse.json();
          const text =
            data.choices?.[0]?.message?.content ||
            "No response from agent.";
          return NextResponse.json({
            response: text,
            source: "archestra-llm-proxy",
            model: data.model,
            usage: data.usage,
          });
        }
      } catch (err) {
        console.error("LLM Proxy error:", err);
      }
    }

    // Option 3: Direct Gemini call (bypass Archestra proxy if unavailable)
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              system_instruction: {
                parts: [
                  {
                    text: `You are DevOps Copilot, an AI-powered incident response assistant built on the Archestra MCP platform for the 2 Fast 2 MCP Hackathon.

You help SRE/DevOps teams by:
- Detecting and triaging infrastructure incidents
- Correlating incidents with recent code changes via GitHub
- Scraping monitoring dashboards via Playwright
- Sending alerts via Slack

You run on Archestra which provides: MCP orchestration in Kubernetes, dual-LLM security (blocks unsafe actions), cost optimization (smart model routing), and full observability.

Be concise, technical, and use markdown formatting.`,
                  },
                ],
              },
              contents: [
                {
                  role: "user",
                  parts: [{ text: message }],
                },
              ],
              generationConfig: {
                maxOutputTokens: 2000,
                temperature: 0.3,
              },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const text =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response generated.";
          return NextResponse.json({
            response: text,
            source: "gemini-direct",
            model: "gemini-2.0-flash",
          });
        }
      } catch (err) {
        console.error("Gemini direct error:", err);
      }
    }
  }

  // ─── Fallback: Mock response ───────────────────────────────
  return NextResponse.json({
    response:
      "Live mode is not enabled. Set `USE_LIVE_DATA=true` in `.env.local` and ensure Archestra is running or a Gemini API key is configured.",
    source: "fallback",
  });
}
