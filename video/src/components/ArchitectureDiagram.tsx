import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { colors } from "../theme";

interface BoxConfig {
  label: string;
  sublabel?: string;
  color: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  delay: number;
}

interface ArrowConfig {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  delay: number;
  color: string;
}

// Scaled up layout filling the 1920x880 area
const boxes: BoxConfig[] = [
  // Row 1: Dashboard (top center)
  {
    label: "DevOps Copilot Dashboard",
    sublabel: "Next.js \u00B7 Real-time \u00B7 Observability",
    color: colors.blue,
    x: 660,
    y: 0,
    width: 480,
    delay: 0,
  },
  // Row 2: Archestra Platform container
  {
    label: "ARCHESTRA PLATFORM",
    sublabel: "",
    color: colors.violet,
    x: 180,
    y: 130,
    width: 1440,
    height: 600,
    delay: 15,
  },
  // MCP Orchestrator label
  {
    label: "MCP Orchestrator (K8s)",
    sublabel: "",
    color: colors.violet,
    x: 600,
    y: 160,
    width: 600,
    delay: 25,
  },
  // Row 3: MCP Servers (wider, bigger)
  {
    label: "Playwright MCP",
    sublabel: "Browser Automation",
    color: colors.cyan,
    x: 250,
    y: 240,
    width: 320,
    delay: 35,
  },
  {
    label: "GitHub MCP",
    sublabel: "Code & PR Analysis",
    color: colors.cyan,
    x: 740,
    y: 240,
    width: 320,
    delay: 40,
  },
  {
    label: "Slack MCP",
    sublabel: "Team Notifications",
    color: colors.cyan,
    x: 1230,
    y: 240,
    width: 320,
    delay: 45,
  },
  // Row 4: Agent Pipeline (wider, bigger)
  {
    label: "Incident Triage Agent",
    sublabel: "gpt-4o-mini \u00B7 Playwright, Slack",
    color: colors.emerald,
    x: 250,
    y: 420,
    width: 320,
    delay: 60,
  },
  {
    label: "Root Cause Analyzer",
    sublabel: "claude-opus-4.6 \u00B7 GitHub, Playwright",
    color: colors.emerald,
    x: 740,
    y: 420,
    width: 320,
    delay: 65,
  },
  {
    label: "Security Guardian",
    sublabel: "claude-opus-4.6 \u00B7 Validation Only",
    color: colors.amber,
    x: 1230,
    y: 420,
    width: 320,
    delay: 70,
  },
  // Row 5: Bottom features
  {
    label: "Cost Controls",
    sublabel: "",
    color: colors.emerald,
    x: 270,
    y: 590,
    width: 220,
    delay: 90,
  },
  {
    label: "Observability",
    sublabel: "",
    color: colors.cyan,
    x: 540,
    y: 590,
    width: 220,
    delay: 95,
  },
  {
    label: "Security Policies",
    sublabel: "",
    color: colors.amber,
    x: 810,
    y: 590,
    width: 240,
    delay: 100,
  },
  {
    label: "Model Routing",
    sublabel: "",
    color: colors.violet,
    x: 1100,
    y: 590,
    width: 240,
    delay: 105,
  },
];

// Vertical straight arrows + horizontal pipeline flow
const arrows: ArrowConfig[] = [
  // Dashboard -> Archestra (vertical center)
  { fromX: 900, fromY: 72, toX: 900, toY: 130, delay: 10, color: colors.blue },
  // MCP -> Agents (vertical: each MCP feeds into the agent below it)
  { fromX: 410, fromY: 318, toX: 410, toY: 420, delay: 55, color: colors.cyan },
  { fromX: 900, fromY: 318, toX: 900, toY: 420, delay: 58, color: colors.cyan },
  { fromX: 1390, fromY: 318, toX: 1390, toY: 420, delay: 61, color: colors.cyan },
  // Agent pipeline flow (horizontal)
  { fromX: 570, fromY: 450, toX: 740, toY: 450, delay: 75, color: colors.emerald },
  { fromX: 1060, fromY: 450, toX: 1230, toY: 450, delay: 80, color: colors.emerald },
];

const ArchBox: React.FC<{ box: BoxConfig; isContainer?: boolean }> = ({
  box,
  isContainer,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - box.delay,
    fps,
    config: { damping: 15, stiffness: 80, mass: 0.6 },
  });

  const opacity = interpolate(frame - box.delay, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(progress, [0, 1], [isContainer ? 0.96 : 0.75, 1]);

  if (isContainer) {
    return (
      <div
        style={{
          position: "absolute",
          left: box.x,
          top: box.y,
          width: box.width || 240,
          height: box.height || 60,
          opacity,
          transform: `scale(${scale})`,
          transformOrigin: "center top",
          background: `${colors.violet}06`,
          border: `2px solid ${colors.violet}25`,
          borderRadius: 20,
          padding: "28px 40px 14px",
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: colors.violet,
            letterSpacing: 4,
            textTransform: "uppercase",
            textAlign: "center",
            background: `${colors.violet}10`,
            padding: "8px 28px",
            borderRadius: 8,
            border: `1px solid ${colors.violet}20`,
            display: "inline-block",
          }}
        >
          {box.label}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        left: box.x,
        top: box.y,
        width: box.width || 240,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center",
        background: "rgba(24,24,27,0.85)",
        border: `2px solid ${box.color}60`,
        borderRadius: 14,
        padding: "18px 22px",
        textAlign: "center",
        boxShadow: `0 0 24px ${box.color}15`,
      }}
    >
      <div style={{ fontSize: 19, fontWeight: 700, color: box.color }}>
        {box.label}
      </div>
      {box.sublabel && (
        <div style={{ fontSize: 14, color: colors.muted, marginTop: 5 }}>
          {box.sublabel}
        </div>
      )}
    </div>
  );
};

const AnimatedArrow: React.FC<{ arrow: ArrowConfig }> = ({ arrow }) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame - arrow.delay, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (progress <= 0) return null;

  const dx = arrow.toX - arrow.fromX;
  const dy = arrow.toY - arrow.fromY;
  const currentX = arrow.fromX + dx * progress;
  const currentY = arrow.fromY + dy * progress;

  return (
    <svg
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      width="1920"
      height="800"
    >
      <line
        x1={arrow.fromX}
        y1={arrow.fromY}
        x2={currentX}
        y2={currentY}
        stroke={arrow.color}
        strokeWidth={3}
        opacity={0.7}
      />
      {progress >= 0.9 && (
        <>
          {dy !== 0 ? (
            <polygon
              points={`${arrow.toX},${arrow.toY} ${arrow.toX - 6},${arrow.toY - 10} ${arrow.toX + 6},${arrow.toY - 10}`}
              fill={arrow.color}
              opacity={0.8}
            />
          ) : (
            <polygon
              points={`${arrow.toX},${arrow.toY} ${arrow.toX - 10},${arrow.toY - 6} ${arrow.toX - 10},${arrow.toY + 6}`}
              fill={arrow.color}
              opacity={0.8}
            />
          )}
        </>
      )}
    </svg>
  );
};

export const ArchitectureDiagram: React.FC = () => {
  return (
    <div style={{ position: "relative", width: 1920, height: 760 }}>
      {/* Archestra container first (behind everything) */}
      <ArchBox box={boxes[1]} isContainer />

      {/* Arrows */}
      {arrows.map((arrow, i) => (
        <AnimatedArrow key={`arrow-${i}`} arrow={arrow} />
      ))}

      {/* All boxes except the container */}
      {boxes.map((box, i) => {
        if (i === 1) return null;
        return <ArchBox key={`box-${i}`} box={box} />;
      })}
    </div>
  );
};
