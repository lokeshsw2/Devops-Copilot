import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { colors } from "../theme";

interface CostSegment {
  label: string;
  value: number;
  color: string;
}

interface CostBarProps {
  segments: CostSegment[];
  delay?: number;
  totalWidth?: number;
}

export const CostBar: React.FC<CostBarProps> = ({
  segments,
  delay = 0,
  totalWidth = 800,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const total = segments.reduce((sum, s) => sum + s.value, 0);

  const barProgress = interpolate(frame - delay, [0, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Bar */}
      <div
        style={{
          width: totalWidth,
          height: 48,
          background: "rgba(24,24,27,0.5)",
          borderRadius: 12,
          overflow: "hidden",
          display: "flex",
          border: `1px solid ${colors.border}`,
        }}
      >
        {segments.map((seg, i) => {
          const widthPct = (seg.value / total) * 100;
          const segDelay = delay + i * 10;
          const segProgress = interpolate(
            frame - segDelay,
            [0, 30],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          return (
            <div
              key={i}
              style={{
                width: `${widthPct * segProgress * barProgress}%`,
                height: "100%",
                background: `linear-gradient(135deg, ${seg.color}, ${seg.color}cc)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 600,
                color: "#fff",
                overflow: "hidden",
                whiteSpace: "nowrap",
                transition: "width 0.1s",
              }}
            >
              {segProgress > 0.7 ? seg.label : ""}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {segments.map((seg, i) => {
          const legendDelay = delay + 30 + i * 8;
          const legendOpacity = interpolate(
            frame - legendDelay,
            [0, 12],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                opacity: legendOpacity,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  background: seg.color,
                }}
              />
              <span style={{ fontSize: 16, color: colors.muted }}>
                {seg.label}
              </span>
              <span style={{ fontSize: 16, fontWeight: 700, color: colors.text }}>
                ${seg.value.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
