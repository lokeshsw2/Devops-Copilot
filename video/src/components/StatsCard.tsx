import React from "react";
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { colors } from "../theme";

interface StatsCardProps {
  label: string;
  value: string;
  delay?: number;
  glowColor?: string;
  icon?: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  delay = 0,
  glowColor,
  icon,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 80, mass: 0.6 },
  });

  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(progress, [0, 1], [0.8, 1]);
  const y = interpolate(progress, [0, 1], [30, 0]);

  const pulseOpacity = glowColor
    ? interpolate(
        Math.sin(((frame - delay) / 30) * Math.PI * 2),
        [-1, 1],
        [0.1, 0.25]
      )
    : 0;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: 12,
        padding: "24px 28px",
        minWidth: 200,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {glowColor && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at bottom, ${glowColor}, transparent 70%)`,
            opacity: pulseOpacity,
          }}
        />
      )}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: colors.muted,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {icon}
          {label}
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: glowColor || colors.text,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
};
