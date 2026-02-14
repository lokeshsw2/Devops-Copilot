import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { ArchitectureDiagram } from "../components/ArchitectureDiagram";
import { colors } from "../theme";

export const ArchitectureScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: colors.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 80px",
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.08,
          backgroundImage: `
            linear-gradient(${colors.border} 1px, transparent 1px),
            linear-gradient(90deg, ${colors.border} 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <AnimatedText
        text="Architecture"
        delay={0}
        fontSize={24}
        color={colors.violet}
        fontWeight={600}
        style={{
          letterSpacing: 4,
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      />

      <AnimatedText
        text="Multi-Agent MCP Architecture"
        delay={8}
        fontSize={44}
        fontWeight={700}
        color={colors.text}
        style={{ marginBottom: 30 }}
      />

      <ArchitectureDiagram />
    </AbsoluteFill>
  );
};
