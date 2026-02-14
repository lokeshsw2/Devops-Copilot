import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { colors } from "../theme";

interface TimelineStep {
  label: string;
  result?: string;
  color: string;
  icon?: string;
}

interface IncidentTimelineProps {
  steps: TimelineStep[];
  startDelay?: number;
  stepInterval?: number;
}

export const IncidentTimeline: React.FC<IncidentTimelineProps> = ({
  steps,
  startDelay = 0,
  stepInterval = 45,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
        position: "relative",
      }}
    >
      {steps.map((step, i) => {
        const stepDelay = startDelay + i * stepInterval;
        const progress = spring({
          frame: frame - stepDelay,
          fps,
          config: { damping: 15, stiffness: 80, mass: 0.5 },
        });

        const opacity = interpolate(frame - stepDelay, [0, 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const resultOpacity = interpolate(
          frame - stepDelay - 20,
          [0, 15],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        const x = interpolate(progress, [0, 1], [-30, 0]);

        // Line connector to next step
        const lineHeight =
          i < steps.length - 1
            ? interpolate(
                frame - stepDelay - 15,
                [0, stepInterval - 15],
                [0, 1],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }
              )
            : 0;

        return (
          <div key={i} style={{ position: "relative", paddingLeft: 40 }}>
            {/* Dot */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 8,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: step.color,
                opacity,
                transform: `scale(${progress})`,
                boxShadow: `0 0 12px ${step.color}80`,
              }}
            />
            {/* Line */}
            {i < steps.length - 1 && (
              <div
                style={{
                  position: "absolute",
                  left: 7,
                  top: 28,
                  width: 2,
                  height: 50 * lineHeight,
                  background: `linear-gradient(to bottom, ${step.color}60, transparent)`,
                }}
              />
            )}
            {/* Content */}
            <div
              style={{
                opacity,
                transform: `translateX(${x}px)`,
                paddingBottom: 38,
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: colors.text,
                  marginBottom: 6,
                }}
              >
                {step.icon} {step.label}
              </div>
              {step.result && (
                <div
                  style={{
                    fontSize: 16,
                    color: step.color,
                    opacity: resultOpacity,
                    fontFamily: "monospace",
                    background: "rgba(0,0,0,0.3)",
                    padding: "6px 12px",
                    borderRadius: 6,
                    borderLeft: `3px solid ${step.color}`,
                    display: "inline-block",
                  }}
                >
                  {step.result}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
