import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { colors } from "../theme";

interface FeatureCardProps {
  title: string;
  icon: React.ReactNode;
  delay?: number;
  index?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  icon,
  delay = 0,
  index = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.5 },
  });

  const opacity = interpolate(frame - delay, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const y = interpolate(progress, [0, 1], [60, 0]);
  const scale = interpolate(progress, [0, 1], [0.85, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
        background: colors.card,
        border: `1px solid ${colors.violet}40`,
        borderRadius: 16,
        padding: "32px 36px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        minWidth: 220,
        boxShadow: `0 0 30px ${colors.violet}15`,
      }}
    >
      <div style={{ color: colors.violet, fontSize: 48 }}>{icon}</div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: colors.text,
          textAlign: "center",
        }}
      >
        {title}
      </div>
    </div>
  );
};
