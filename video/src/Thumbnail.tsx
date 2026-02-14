import React from "react";
import { AbsoluteFill } from "remotion";
import { colors } from "./theme";

export const Thumbnail: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: colors.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Gradient orbs */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.violet}30, transparent 65%)`,
          top: -200,
          left: -100,
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.cyan}20, transparent 65%)`,
          bottom: -200,
          right: -50,
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.emerald}15, transparent 65%)`,
          top: 100,
          right: 300,
          filter: "blur(60px)",
        }}
      />

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
          backgroundSize: "80px 80px",
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          zIndex: 1,
        }}
      >
        {/* Top badge */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: colors.cyan,
            letterSpacing: 6,
            textTransform: "uppercase",
            marginBottom: 24,
            background: `${colors.cyan}12`,
            padding: "10px 32px",
            borderRadius: 50,
            border: `2px solid ${colors.cyan}30`,
          }}
        >
          AI-Powered DevOps
        </div>

        {/* Main title */}
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            lineHeight: 1.05,
            textAlign: "center",
            background: `linear-gradient(135deg, ${colors.violet}, ${colors.indigo}, ${colors.cyan})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: -2,
          }}
        >
          DevOps
        </div>
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            lineHeight: 1.05,
            textAlign: "center",
            background: `linear-gradient(135deg, ${colors.cyan}, ${colors.emerald})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: -2,
          }}
        >
          Copilot
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 500,
            color: colors.muted,
            marginTop: 28,
            textAlign: "center",
          }}
        >
          Autonomous Incident Response
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: 20,
            marginTop: 40,
          }}
        >
          {[
            { label: "Multi-Agent", color: colors.emerald },
            { label: "MCP Native", color: colors.cyan },
            { label: "Security-First", color: colors.amber },
          ].map((pill) => (
            <div
              key={pill.label}
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: pill.color,
                background: `${pill.color}15`,
                border: `2px solid ${pill.color}40`,
                borderRadius: 12,
                padding: "10px 28px",
              }}
            >
              {pill.label}
            </div>
          ))}
        </div>

        {/* Powered by */}
        <div
          style={{
            marginTop: 36,
            fontSize: 24,
            fontWeight: 600,
            color: colors.violetLight,
          }}
        >
          Powered by Archestra
        </div>
      </div>

      {/* Corner accent lines */}
      <svg
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        width="1920"
        height="1080"
      >
        {/* Top-left corner */}
        <line x1="60" y1="40" x2="60" y2="120" stroke={colors.violet} strokeWidth="3" opacity="0.4" />
        <line x1="60" y1="40" x2="140" y2="40" stroke={colors.violet} strokeWidth="3" opacity="0.4" />
        {/* Top-right corner */}
        <line x1="1860" y1="40" x2="1860" y2="120" stroke={colors.cyan} strokeWidth="3" opacity="0.4" />
        <line x1="1860" y1="40" x2="1780" y2="40" stroke={colors.cyan} strokeWidth="3" opacity="0.4" />
        {/* Bottom-left corner */}
        <line x1="60" y1="1040" x2="60" y2="960" stroke={colors.emerald} strokeWidth="3" opacity="0.4" />
        <line x1="60" y1="1040" x2="140" y2="1040" stroke={colors.emerald} strokeWidth="3" opacity="0.4" />
        {/* Bottom-right corner */}
        <line x1="1860" y1="1040" x2="1860" y2="960" stroke={colors.amber} strokeWidth="3" opacity="0.4" />
        <line x1="1860" y1="1040" x2="1780" y2="1040" stroke={colors.amber} strokeWidth="3" opacity="0.4" />
      </svg>
    </AbsoluteFill>
  );
};
