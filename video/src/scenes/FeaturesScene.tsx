import React from "react";
import { AbsoluteFill } from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { FeatureCard } from "../components/FeatureCard";
import { colors } from "../theme";

const features = [
  { title: "MCP-Native", icon: "\u{1F50C}" },
  { title: "Multi-Agent", icon: "\u{1F916}" },
  { title: "Security-First", icon: "\u{1F6E1}\uFE0F" },
  { title: "Cost-Optimized", icon: "\u{1F4B0}" },
  { title: "Real-Time Dashboard", icon: "\u{1F4CA}" },
];

export const FeaturesScene: React.FC = () => {
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
      {/* Grid bg */}
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
        text="Key Features"
        delay={0}
        fontSize={24}
        color={colors.violet}
        fontWeight={600}
        style={{
          letterSpacing: 4,
          textTransform: "uppercase",
          marginBottom: 16,
        }}
      />

      <AnimatedText
        text="Everything You Need for Autonomous Incident Response"
        delay={10}
        fontSize={40}
        fontWeight={700}
        color={colors.text}
        style={{ marginBottom: 60, textAlign: "center" }}
      />

      <div style={{ display: "flex", gap: 28 }}>
        {features.map((feature, i) => (
          <FeatureCard
            key={i}
            title={feature.title}
            icon={<span>{feature.icon}</span>}
            delay={25 + i * 15}
            index={i}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
