import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { GlowEffect } from "../components/GlowEffect";
import { colors } from "../theme";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade to black at the end
  const fadeOut = interpolate(frame, [150, 180], [0, 1], {
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
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 400,
          background: `radial-gradient(ellipse at center, ${colors.violet}15, transparent 70%)`,
          opacity: interpolate(frame, [0, 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />

      <GlowEffect color={colors.violet} size={80} delay={5}>
        <AnimatedText
          text="DevOps Copilot"
          delay={5}
          fontSize={80}
          fontWeight={800}
          gradient={{ from: colors.violet, to: colors.indigo }}
        />
      </GlowEffect>

      <AnimatedText
        text="Powered by Archestra"
        delay={25}
        fontSize={28}
        color={colors.violetLight}
        fontWeight={500}
        style={{ marginTop: 16 }}
      />

      <div
        style={{
          marginTop: 50,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <AnimatedText
          text="2 Fast 2 MCP Hackathon"
          delay={45}
          fontSize={22}
          color={colors.muted}
          fontWeight={500}
        />

        <AnimatedText
          text="github.com/arhestra/devops-copilot"
          delay={65}
          fontSize={18}
          color={colors.cyan}
          fontWeight={400}
          style={{
            fontFamily: "monospace",
            background: `${colors.cyan}10`,
            padding: "8px 20px",
            borderRadius: 8,
            border: `1px solid ${colors.cyan}30`,
          }}
        />
      </div>

      {/* Fade to black overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#000",
          opacity: fadeOut,
        }}
      />
    </AbsoluteFill>
  );
};
