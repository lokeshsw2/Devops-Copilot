import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { colors } from "../theme";

// Callouts that appear on top of the screenshot at specific times
const callouts = [
  {
    label: "6 Real-Time KPI Cards",
    x: 320,
    y: 70,
    arrowX: 400,
    arrowY: 115,
    color: colors.cyan,
    delay: 60,
  },
  {
    label: "Live Incident Charts",
    x: 30,
    y: 210,
    arrowX: 180,
    arrowY: 230,
    color: colors.violet,
    delay: 90,
  },
  {
    label: "Active Agent Monitoring",
    x: 1300,
    y: 180,
    arrowX: 1200,
    arrowY: 220,
    color: colors.emerald,
    delay: 120,
  },
  {
    label: "Incident Cards with Agent Logs",
    x: 100,
    y: 420,
    arrowX: 300,
    arrowY: 380,
    color: colors.amber,
    delay: 150,
  },
];

export const DashboardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Browser window fade in + scale
  const browserProgress = spring({
    frame: frame - 5,
    fps,
    config: { damping: 18, stiffness: 80, mass: 0.7 },
  });
  const browserOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const browserScale = interpolate(browserProgress, [0, 1], [0.92, 1]);

  // Scroll the full-page screenshot over time (pan down)
  // The full-page image is ~3600px tall, viewport is ~660px in the browser frame
  // We'll smoothly scroll through: top -> mid -> bottom
  const scrollY = interpolate(
    frame,
    [80, 280, 500, 700],
    [0, 600, 1200, 1800],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // URL bar typing animation
  const urlText = "devops-copilot-six.vercel.app";
  const typedChars = Math.min(
    urlText.length,
    Math.floor(
      interpolate(frame, [15, 50], [0, urlText.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    )
  );

  // Cursor blink
  const cursorVisible =
    frame < 55 ? Math.floor(frame / 8) % 2 === 0 : false;

  return (
    <AbsoluteFill
      style={{
        background: colors.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "30px 50px",
      }}
    >
      {/* Title */}
      <AnimatedText
        text="Live Dashboard"
        delay={0}
        fontSize={22}
        color={colors.violet}
        fontWeight={600}
        style={{
          letterSpacing: 4,
          textTransform: "uppercase",
          marginBottom: 16,
        }}
      />

      {/* Browser chrome window */}
      <div
        style={{
          opacity: browserOpacity,
          transform: `scale(${browserScale})`,
          width: 1780,
          borderRadius: 16,
          overflow: "hidden",
          border: `1px solid ${colors.border}`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${colors.violet}10`,
          background: "#1a1a2e",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            height: 44,
            background: "#18181b",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: 8,
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          {/* Traffic lights */}
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#ff5f57",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#ffbd2e",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#28ca41",
              marginRight: 16,
            }}
          />

          {/* URL bar */}
          <div
            style={{
              flex: 1,
              height: 28,
              background: "rgba(0,0,0,0.4)",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              border: `1px solid ${colors.border}`,
            }}
          >
            {/* Lock icon */}
            <span
              style={{
                fontSize: 11,
                color: colors.emerald,
                marginRight: 6,
              }}
            >
              {"\u{1F512}"}
            </span>
            <span
              style={{
                fontSize: 13,
                color: colors.text,
                fontFamily: "monospace",
              }}
            >
              {urlText.slice(0, typedChars)}
            </span>
            {cursorVisible && (
              <span
                style={{
                  display: "inline-block",
                  width: 1,
                  height: 14,
                  background: colors.text,
                  marginLeft: 1,
                }}
              />
            )}
          </div>
        </div>

        {/* Browser viewport - shows the scrolling screenshot */}
        <div
          style={{
            width: "100%",
            height: 920,
            overflow: "hidden",
            position: "relative",
            background: colors.bg,
          }}
        >
          <Img
            src={staticFile("dashboard-fullpage.png")}
            style={{
              width: "100%",
              position: "absolute",
              top: -scrollY,
              left: 0,
            }}
          />

          {/* Callout overlays */}
          {callouts.map((callout, i) => {
            const cOpacity = interpolate(
              frame - callout.delay,
              [0, 12],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            );
            // Only show callouts when they're in the visible viewport
            const calloutInView =
              callout.y > scrollY - 50 && callout.y < scrollY + 920;

            if (!calloutInView || cOpacity <= 0) return null;

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: callout.x,
                  top: callout.y - scrollY,
                  opacity: cOpacity,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  zIndex: 10,
                }}
              >
                <div
                  style={{
                    background: `${callout.color}20`,
                    border: `1px solid ${callout.color}60`,
                    borderRadius: 8,
                    padding: "6px 14px",
                    fontSize: 14,
                    fontWeight: 600,
                    color: callout.color,
                    backdropFilter: "blur(8px)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {callout.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
