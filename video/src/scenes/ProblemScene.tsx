import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { GlowEffect } from "../components/GlowEffect";
import { colors } from "../theme";

const painPoints = [
  { icon: "\u{1F514}", text: "Alert Fatigue", desc: "Teams overwhelmed by noise" },
  { icon: "\u23F1\uFE0F", text: "Slow MTTR", desc: "Hours spent on manual triage" },
  { icon: "\u{1F504}", text: "Context Switching", desc: "Jumping between 10+ tools" },
];

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Animated counter for 70%
  const counterValue = Math.min(
    70,
    Math.round(interpolate(frame, [20, 80], [0, 70], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }))
  );

  const counterOpacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
      {/* Section title */}
      <AnimatedText
        text="The Problem"
        delay={0}
        fontSize={24}
        color={colors.red}
        fontWeight={600}
        style={{ letterSpacing: 4, textTransform: "uppercase", marginBottom: 20 }}
      />

      {/* Big stat */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, opacity: counterOpacity }}>
        <GlowEffect color={colors.red} size={100} pulse delay={15}>
          <div
            style={{
              fontSize: 140,
              fontWeight: 800,
              color: colors.red,
              lineHeight: 1,
            }}
          >
            {counterValue}%
          </div>
        </GlowEffect>
      </div>

      <AnimatedText
        text="of incident response time is manual triage"
        delay={40}
        fontSize={28}
        color={colors.muted}
        fontWeight={400}
        style={{ marginTop: 10, marginBottom: 60 }}
      />

      {/* Pain points */}
      <div style={{ display: "flex", gap: 50 }}>
        {painPoints.map((point, i) => {
          const pointDelay = 90 + i * 30;
          const pointOpacity = interpolate(
            frame - pointDelay,
            [0, 15],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const pointY = interpolate(
            frame - pointDelay,
            [0, 20],
            [30, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div
              key={i}
              style={{
                opacity: pointOpacity,
                transform: `translateY(${pointY}px)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                background: colors.card,
                border: `1px solid ${colors.border}`,
                borderRadius: 16,
                padding: "32px 40px",
                minWidth: 260,
              }}
            >
              <div style={{ fontSize: 48 }}>{point.icon}</div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: colors.text,
                }}
              >
                {point.text}
              </div>
              <div style={{ fontSize: 16, color: colors.muted }}>
                {point.desc}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
