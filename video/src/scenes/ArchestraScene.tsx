import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { GlowEffect } from "../components/GlowEffect";
import { colors } from "../theme";

interface ComponentCard {
  category: string;
  items: {
    name: string;
    detail: string;
    color: string;
  }[];
  delay: number;
  icon: string;
  color: string;
}

const components: ComponentCard[] = [
  {
    category: "AI Agents",
    icon: "\u{1F916}",
    color: colors.emerald,
    delay: 30,
    items: [
      {
        name: "Incident Triage Agent",
        detail: "gpt-4o-mini \u00B7 Playwright MCP, Slack MCP",
        color: colors.emerald,
      },
      {
        name: "Root Cause Analyzer",
        detail: "claude-opus-4.6 \u00B7 GitHub MCP, Playwright MCP",
        color: colors.violet,
      },
      {
        name: "Security Guardian",
        detail: "claude-opus-4.6 \u00B7 None (validation only)",
        color: colors.amber,
      },
    ],
  },
  {
    category: "MCP Servers",
    icon: "\u{1F50C}",
    color: colors.cyan,
    delay: 100,
    items: [
      {
        name: "Playwright MCP",
        detail: "Browser automation \u00B7 Scrape Grafana, Datadog, K8s",
        color: colors.cyan,
      },
      {
        name: "GitHub MCP",
        detail: "Code analysis \u00B7 PR correlation & deployment checks",
        color: colors.blue,
      },
      {
        name: "Slack MCP",
        detail: "Team comms \u00B7 On-call alerts & resolution updates",
        color: colors.violetLight,
      },
    ],
  },
  {
    category: "Platform Features",
    icon: "\u2699\uFE0F",
    color: colors.violet,
    delay: 170,
    items: [
      {
        name: "MCP Orchestrator",
        detail: "K8s-native MCP server deployment & lifecycle",
        color: colors.violet,
      },
      {
        name: "MCP Registry",
        detail: "Centralized management of all MCP configs",
        color: colors.blue,
      },
      {
        name: "RBAC",
        detail: "Role-based access control for agent permissions",
        color: colors.emerald,
      },
    ],
  },
];

const platformFeatures = [
  {
    label: "Security Sub-Agents",
    desc: "Dual-LLM validation on every action",
    icon: "\u{1F512}",
    color: colors.amber,
    delay: 250,
  },
  {
    label: "Full Observability",
    desc: "Token costs, latency, success rates per agent",
    icon: "\u{1F441}\uFE0F",
    color: colors.cyan,
    delay: 270,
  },
  {
    label: "Cost Optimization",
    desc: "Smart model routing \u00B7 $10/day budget cap",
    icon: "\u{1F4B0}",
    color: colors.emerald,
    delay: 290,
  },
  {
    label: "Graceful Fallback",
    desc: "Archestra \u2192 Gemini \u2192 Mock demo mode",
    icon: "\u{1F504}",
    color: colors.blue,
    delay: 310,
  },
];

export const ArchestraScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: colors.bg,
        padding: "40px 70px",
      }}
    >
      {/* Grid bg */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.06,
          backgroundImage: `
            linear-gradient(${colors.violet}30 1px, transparent 1px),
            linear-gradient(90deg, ${colors.violet}30 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          top: -100,
          left: "50%",
          transform: "translateX(-50%)",
          width: 1000,
          height: 500,
          background: `radial-gradient(ellipse at center, ${colors.violet}12, transparent 70%)`,
          opacity: interpolate(frame, [0, 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 8,
        }}
      >
        <AnimatedText
          text="Powered by"
          delay={0}
          fontSize={22}
          color={colors.muted}
          fontWeight={500}
          direction="none"
        />
        <GlowEffect color={colors.violet} size={30} delay={5}>
          <AnimatedText
            text="Archestra"
            delay={5}
            fontSize={52}
            fontWeight={800}
            gradient={{ from: colors.violet, to: colors.cyan }}
          />
        </GlowEffect>
      </div>

      <AnimatedText
        text="The AI Infrastructure We Built On"
        delay={12}
        fontSize={20}
        color={colors.muted}
        fontWeight={400}
        style={{ marginBottom: 36 }}
      />

      {/* 3-column component cards */}
      <div style={{ display: "flex", gap: 24, marginBottom: 36 }}>
        {components.map((comp, ci) => {
          const cardOpacity = interpolate(
            frame - comp.delay,
            [0, 18],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const cardY = interpolate(frame - comp.delay, [0, 25], [40, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={ci}
              style={{
                flex: 1,
                opacity: cardOpacity,
                transform: `translateY(${cardY}px)`,
                background: "rgba(24,24,27,0.6)",
                border: `1px solid ${comp.color}30`,
                borderRadius: 16,
                padding: "24px 24px 20px",
                boxShadow: `0 0 30px ${comp.color}08`,
              }}
            >
              {/* Category header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                <span style={{ fontSize: 28 }}>{comp.icon}</span>
                <span
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: comp.color,
                  }}
                >
                  {comp.category}
                </span>
              </div>

              {/* Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {comp.items.map((item, ii) => {
                  const itemDelay = comp.delay + 15 + ii * 12;
                  const itemOpacity = interpolate(
                    frame - itemDelay,
                    [0, 12],
                    [0, 1],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }
                  );
                  const itemX = interpolate(
                    frame - itemDelay,
                    [0, 15],
                    [-20, 0],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }
                  );

                  return (
                    <div
                      key={ii}
                      style={{
                        opacity: itemOpacity,
                        transform: `translateX(${itemX}px)`,
                        padding: "12px 16px",
                        background: "rgba(0,0,0,0.3)",
                        borderLeft: `3px solid ${item.color}`,
                        borderRadius: 8,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: colors.text,
                          marginBottom: 3,
                        }}
                      >
                        {item.name}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: colors.muted,
                          lineHeight: 1.4,
                        }}
                      >
                        {item.detail}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom row: platform feature pills */}
      <div
        style={{
          display: "flex",
          gap: 18,
        }}
      >
        {platformFeatures.map((feat, i) => {
          const fOpacity = interpolate(frame - feat.delay, [0, 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const fScale = interpolate(frame - feat.delay, [0, 20], [0.85, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                flex: 1,
                opacity: fOpacity,
                transform: `scale(${fScale})`,
                background: colors.card,
                border: `1px solid ${feat.color}25`,
                borderRadius: 12,
                padding: "18px 22px",
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
              }}
            >
              <span style={{ fontSize: 28, lineHeight: 1 }}>{feat.icon}</span>
              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: feat.color,
                    marginBottom: 4,
                  }}
                >
                  {feat.label}
                </div>
                <div style={{ fontSize: 13, color: colors.muted, lineHeight: 1.4 }}>
                  {feat.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
