import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { CostBar } from "../components/CostBar";
import { GlowEffect } from "../components/GlowEffect";
import { colors } from "../theme";

const costSegments = [
  { label: "gpt-4o-mini (Triage)", value: 0.42, color: colors.emerald },
  { label: "claude-opus-4.6 (Analysis)", value: 2.18, color: colors.violet },
  { label: "claude-opus-4.6 (Security)", value: 1.84, color: colors.blue },
];

const breakdownItems = [
  { label: "Triage (gpt-4o-mini)", cost: "$0.42", pct: "9%", color: colors.emerald },
  { label: "Root Cause Analysis", cost: "$2.18", pct: "49%", color: colors.violet },
  { label: "Security Guardian", cost: "$1.84", pct: "42%", color: colors.blue },
];

export const CostScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Big savings counter
  const savingsDelay = 80;
  const savingsValue = Math.min(
    12840,
    Math.round(
      interpolate(frame - savingsDelay, [0, 60], [0, 12840], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    )
  );

  const savingsOpacity = interpolate(frame - savingsDelay, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Reduction stat
  const reductionDelay = 160;
  const reductionOpacity = interpolate(
    frame - reductionDelay,
    [0, 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const reductionValue = Math.min(
    96,
    Math.round(
      interpolate(frame - reductionDelay, [0, 40], [0, 96], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    )
  );

  // Routing explanation
  const routingDelay = 220;
  const routingOpacity = interpolate(
    frame - routingDelay,
    [0, 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: colors.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "50px 120px",
      }}
    >
      <AnimatedText
        text="Cost Intelligence"
        delay={0}
        fontSize={24}
        color={colors.emerald}
        fontWeight={600}
        style={{
          letterSpacing: 4,
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      />

      <AnimatedText
        text="Smart Model Routing"
        delay={8}
        fontSize={48}
        fontWeight={700}
        color={colors.text}
        style={{ marginBottom: 40 }}
      />

      {/* Cost bar */}
      <CostBar segments={costSegments} delay={25} totalWidth={900} />

      {/* Savings and reduction */}
      <div
        style={{
          display: "flex",
          gap: 80,
          marginTop: 50,
          alignItems: "center",
        }}
      >
        {/* Total saved */}
        <div
          style={{
            opacity: savingsOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <GlowEffect color={colors.emerald} size={60} pulse>
            <div
              style={{
                fontSize: 72,
                fontWeight: 800,
                color: colors.emerald,
                lineHeight: 1,
              }}
            >
              ${savingsValue.toLocaleString()}
            </div>
          </GlowEffect>
          <div
            style={{
              fontSize: 18,
              color: colors.muted,
              marginTop: 12,
            }}
          >
            Total Cost Saved
          </div>
        </div>

        {/* Reduction percentage */}
        <div
          style={{
            opacity: reductionOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: colors.emerald,
              lineHeight: 1,
            }}
          >
            {reductionValue}%
          </div>
          <div
            style={{
              fontSize: 18,
              color: colors.muted,
              marginTop: 12,
            }}
          >
            Cost Reduction
          </div>
        </div>
      </div>

      {/* Smart routing explanation */}
      <div
        style={{
          opacity: routingOpacity,
          marginTop: 50,
          display: "flex",
          gap: 32,
        }}
      >
        <div
          style={{
            background: colors.card,
            border: `1px solid ${colors.emerald}30`,
            borderRadius: 12,
            padding: "20px 28px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 8,
              height: 40,
              borderRadius: 4,
              background: colors.emerald,
            }}
          />
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: colors.text }}>
              {"gpt-4o-mini \u2192 Triage"}
            </div>
            <div style={{ fontSize: 13, color: colors.muted }}>
              Fast, cheap for initial classification
            </div>
          </div>
        </div>

        <div
          style={{
            background: colors.card,
            border: `1px solid ${colors.violet}30`,
            borderRadius: 12,
            padding: "20px 28px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 8,
              height: 40,
              borderRadius: 4,
              background: colors.violet,
            }}
          />
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: colors.text }}>
              {"claude-opus-4.6 \u2192 Analysis"}
            </div>
            <div style={{ fontSize: 13, color: colors.muted }}>
              Deep reasoning for root cause
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
