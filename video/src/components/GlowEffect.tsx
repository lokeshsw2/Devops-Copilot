import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface GlowEffectProps {
  color: string;
  size?: number;
  delay?: number;
  pulse?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const GlowEffect: React.FC<GlowEffectProps> = ({
  color,
  size = 40,
  delay = 0,
  pulse = true,
  children,
  style = {},
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pulseIntensity = pulse
    ? interpolate(
        Math.sin(((frame - delay) / 30) * Math.PI * 2),
        [-1, 1],
        [0.4, 1]
      )
    : 1;

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        opacity,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -size / 2,
          background: `radial-gradient(ellipse at center, ${color}40, transparent 70%)`,
          opacity: pulseIntensity,
          filter: `blur(${size / 2}px)`,
          zIndex: 0,
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
};
