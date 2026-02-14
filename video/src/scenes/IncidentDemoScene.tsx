import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { IncidentTimeline } from "../components/IncidentTimeline";
import { GlowEffect } from "../components/GlowEffect";
import { colors } from "../theme";

const timelineSteps = [
  {
    label: "Scanning Grafana dashboard...",
    result: "Connection pool at 98% capacity - critical threshold",
    color: colors.cyan,
    icon: "\u{1F50D}",
  },
  {
    label: "Checking recent deployments on GitHub...",
    result: "PR #847 merged 23 min ago - query optimization changes",
    color: colors.blue,
    icon: "\u{1F4E6}",
  },
  {
    label: "Analyzing code changes...",
    result: "N+1 query pattern identified in UserService.getAll()",
    color: colors.amber,
    icon: "\u26A0\uFE0F",
  },
  {
    label: "Correlating with metrics...",
    result: "Latency spike correlates exactly with deployment timestamp",
    color: colors.violet,
    icon: "\u{1F4CA}",
  },
  {
    label: "Notifying on-call team via Slack...",
    result: "Alert sent to #incidents - @oncall team notified",
    color: colors.emerald,
    icon: "\u2705",
  },
];

export const IncidentDemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Alert appears
  const alertProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 10, stiffness: 120, mass: 0.5 },
  });

  const alertOpacity = interpolate(frame, [5, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Agent activation pulse
  const agentActivateOpacity = interpolate(frame, [30, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Root cause box
  const rootCauseDelay = 220;
  const rootCauseOpacity = interpolate(
    frame - rootCauseDelay,
    [0, 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: colors.bg,
        padding: "40px 80px",
      }}
    >
      {/* Grid bg */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.06,
          backgroundImage: `
            linear-gradient(${colors.border} 1px, transparent 1px),
            linear-gradient(90deg, ${colors.border} 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <AnimatedText
        text="Live Incident Response"
        delay={0}
        fontSize={24}
        color={colors.red}
        fontWeight={600}
        style={{
          letterSpacing: 4,
          textTransform: "uppercase",
          marginBottom: 20,
        }}
      />

      {/* Alert banner */}
      <div
        style={{
          opacity: alertOpacity,
          transform: `scale(${alertProgress})`,
          background: `${colors.red}15`,
          border: `2px solid ${colors.red}60`,
          borderRadius: 12,
          padding: "18px 28px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: colors.red,
            boxShadow: `0 0 16px ${colors.red}`,
          }}
        />
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: colors.red,
              textTransform: "uppercase",
              letterSpacing: 2,
              marginBottom: 4,
            }}
          >
            Critical Alert
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, color: colors.text }}>
            Database Connection Pool Exhaustion
          </div>
        </div>
      </div>

      {/* Agent activation */}
      <div
        style={{
          opacity: agentActivateOpacity,
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
          padding: "10px 20px",
          background: `${colors.emerald}10`,
          borderRadius: 8,
          border: `1px solid ${colors.emerald}30`,
          width: "fit-content",
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: colors.emerald,
            boxShadow: `0 0 10px ${colors.emerald}`,
          }}
        />
        <span style={{ fontSize: 16, fontWeight: 600, color: colors.emerald }}>
          Incident Triage Agent activated
        </span>
      </div>

      <div style={{ display: "flex", gap: 40 }}>
        {/* Timeline */}
        <div style={{ flex: 1 }}>
          <IncidentTimeline
            steps={timelineSteps}
            startDelay={50}
            stepInterval={30}
          />
        </div>

        {/* Root cause panel */}
        <div
          style={{
            width: 450,
            opacity: rootCauseOpacity,
            background: colors.card,
            border: `2px solid ${colors.violet}40`,
            borderRadius: 16,
            padding: "28px 32px",
            alignSelf: "flex-start",
            boxShadow: `0 0 40px ${colors.violet}15`,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: colors.violet,
              textTransform: "uppercase",
              letterSpacing: 2,
              marginBottom: 16,
            }}
          >
            Root Cause Identified
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: colors.text,
              lineHeight: 1.5,
              marginBottom: 16,
            }}
          >
            N+1 query pattern introduced in PR #847 causing connection pool
            saturation under load
          </div>
          <div
            style={{
              fontSize: 14,
              color: colors.muted,
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: colors.amber }}>Recommendation:</strong> Revert PR #847 or
            apply eager loading fix. Estimated recovery: 3-5 minutes after
            deployment.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
