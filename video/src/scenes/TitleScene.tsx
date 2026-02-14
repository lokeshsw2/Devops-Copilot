import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { GlowEffect } from "../components/GlowEffect";
import { colors } from "../theme";

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Animated grid pattern
  const gridOpacity = interpolate(frame, [0, 30], [0, 0.15], {
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
      {/* Grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: gridOpacity,
          backgroundImage: `
            linear-gradient(${colors.border} 1px, transparent 1px),
            linear-gradient(90deg, ${colors.border} 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow behind title */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 400,
          background: `radial-gradient(ellipse at center, ${colors.violet}20, transparent 70%)`,
          opacity: interpolate(frame, [10, 40], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />

      {/* Main title */}
      <GlowEffect color={colors.violet} size={80} delay={10}>
        <AnimatedText
          text="DevOps Copilot"
          delay={10}
          fontSize={96}
          fontWeight={800}
          gradient={{ from: colors.violet, to: colors.indigo }}
        />
      </GlowEffect>

      {/* Subtitle */}
      <AnimatedText
        text="AI-Powered Autonomous Incident Response"
        delay={30}
        fontSize={32}
        color={colors.muted}
        fontWeight={400}
        style={{ marginTop: 20 }}
      />

      {/* Hackathon line */}
      <AnimatedText
        text="Built for 2 Fast 2 MCP Hackathon"
        delay={55}
        fontSize={22}
        color={colors.violetLight}
        fontWeight={500}
        style={{ marginTop: 40 }}
      />

      {/* Archestra branding */}
      <AnimatedText
        text="Powered by Archestra"
        delay={75}
        fontSize={18}
        color={colors.muted}
        fontWeight={400}
        style={{ marginTop: 16 }}
        direction="none"
      />
    </AbsoluteFill>
  );
};
