import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

interface AnimatedTextProps {
  text: string;
  delay?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  style?: React.CSSProperties;
  direction?: "up" | "down" | "left" | "right" | "none";
  gradient?: { from: string; to: string };
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  delay = 0,
  fontSize = 48,
  color = "#fafafa",
  fontWeight = 600,
  style = {},
  direction = "up",
  gradient,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const springValue = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 100, mass: 0.5 },
  });

  const translateMap = {
    up: { x: 0, y: interpolate(springValue, [0, 1], [40, 0]) },
    down: { x: 0, y: interpolate(springValue, [0, 1], [-40, 0]) },
    left: { x: interpolate(springValue, [0, 1], [40, 0]), y: 0 },
    right: { x: interpolate(springValue, [0, 1], [-40, 0]), y: 0 },
    none: { x: 0, y: 0 },
  };

  const { x, y } = translateMap[direction];

  const textStyle: React.CSSProperties = {
    fontSize,
    fontWeight,
    color: gradient ? "transparent" : color,
    opacity,
    transform: `translate(${x}px, ${y}px)`,
    lineHeight: 1.2,
    ...(gradient
      ? {
          background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }
      : {}),
    ...style,
  };

  return <div style={textStyle}>{text}</div>;
};
