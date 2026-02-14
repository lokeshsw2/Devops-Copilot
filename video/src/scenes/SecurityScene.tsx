import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { GlowEffect } from "../components/GlowEffect";
import { colors } from "../theme";

export const SecurityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Agent attempt
  const attemptOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Block animation
  const blockDelay = 60;
  const blockProgress = spring({
    frame: frame - blockDelay,
    fps,
    config: { damping: 8, stiffness: 150, mass: 0.5 },
  });
  const blockOpacity = interpolate(frame - blockDelay, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Shield
  const shieldDelay = 100;
  const shieldProgress = spring({
    frame: frame - shieldDelay,
    fps,
    config: { damping: 12, stiffness: 80, mass: 0.8 },
  });
  const shieldOpacity = interpolate(frame - shieldDelay, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Stats
  const statsDelay = 160;
  const statsOpacity = interpolate(frame - statsDelay, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Counter
  const blockedCount = Math.min(
    23,
    Math.round(
      interpolate(frame - statsDelay, [0, 40], [0, 23], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    )
  );

  return (
    <AbsoluteFill
      style={{
        background: colors.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
      }}
    >
      <AnimatedText
        text="Security Guardrails"
        delay={0}
        fontSize={24}
        color={colors.amber}
        fontWeight={600}
        style={{
          letterSpacing: 4,
          textTransform: "uppercase",
          marginBottom: 40,
        }}
      />

      {/* Agent attempt box */}
      <div
        style={{
          opacity: attemptOpacity,
          background: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: 12,
          padding: "20px 32px",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 16,
          width: 700,
        }}
      >
        <div style={{ fontSize: 14, color: colors.muted, fontWeight: 500 }}>
          Agent Request:
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: colors.text,
            fontFamily: "monospace",
          }}
        >
          Auto-revert production deployment
        </div>
      </div>

      {/* BLOCKED banner */}
      <div
        style={{
          opacity: blockOpacity,
          transform: `scale(${blockProgress})`,
          background: `${colors.red}15`,
          border: `2px solid ${colors.red}60`,
          borderRadius: 12,
          padding: "24px 48px",
          marginBottom: 40,
          display: "flex",
          alignItems: "center",
          gap: 20,
          boxShadow: `0 0 40px ${colors.red}30`,
        }}
      >
        <div style={{ fontSize: 40 }}>{"\u{1F6E1}\uFE0F"}</div>
        <div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: colors.red,
              letterSpacing: 4,
            }}
          >
            BLOCKED
          </div>
          <div style={{ fontSize: 16, color: colors.amber, marginTop: 4 }}>
            by Security Guardian
          </div>
        </div>
      </div>

      {/* Shield with glow */}
      <div
        style={{
          opacity: shieldOpacity,
          transform: `scale(${shieldProgress})`,
          marginBottom: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <GlowEffect color={colors.amber} size={80} pulse>
          <div style={{ fontSize: 96 }}>{"\u{1F6E1}\uFE0F"}</div>
        </GlowEffect>
        <div
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: colors.text,
            textAlign: "center",
          }}
        >
          Dual-LLM Safety Architecture
        </div>
        <div
          style={{
            fontSize: 16,
            color: colors.muted,
            textAlign: "center",
            maxWidth: 500,
          }}
        >
          All dangerous actions require human approval
        </div>
      </div>

      {/* Stats row */}
      <div
        style={{
          opacity: statsOpacity,
          display: "flex",
          gap: 40,
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: colors.amber,
            }}
          >
            {blockedCount}
          </div>
          <div style={{ fontSize: 16, color: colors.muted }}>
            unsafe operations blocked
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
