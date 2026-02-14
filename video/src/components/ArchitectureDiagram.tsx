import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { colors } from "../theme";

// Layout matches the README architecture diagram:
//
// DevOps Copilot Dashboard
//          │ (API)
// ┌────────────────────── ARCHESTRA PLATFORM ──────────────────────┐
// │   MCP Orchestrator (K8s)                                       │
// │   ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
// │   │Playwright │  │  GitHub  │  │  Slack   │                    │
// │   │   MCP     │  │   MCP    │  │   MCP    │                    │
// │   └─────┬─────┘  └─────┬────┘  └─────┬────┘                   │
// │         │              │              │                         │
// │   ┌─────▼──────────────▼──────────────▼──────┐                 │
// │   │          AGENT PIPELINE                   │                 │
// │   │  Triage Agent → Root Cause → Notification │                │
// │   │         └──────┬──────┘                   │                 │
// │   │          Security Guardian                │                 │
// │   └──────────────────────────────────────────┘                 │
// │   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                         │
// │   │ Cost │ │Observ│ │Secur │ │Model │                         │
// │   └──────┘ └──────┘ └──────┘ └──────┘                         │
// └────────────────────────────────────────────────────────────────┘

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

// Center everything on x=910 (center of 1820 usable area)
const boxes: BoxConfig[] = [
  // Row 1: Dashboard
  {
    label: "DevOps Copilot Dashboard",
    sublabel: "Next.js \u00B7 Real-time \u00B7 Observability",
    color: colors.blue,
    x: 710,
    y: 20,
    width: 400,
    delay: 0,
  },
  // Row 2: Archestra Platform container (visual only, wide)
  {
    label: "ARCHESTRA PLATFORM",
    sublabel: "",
    color: colors.violet,
    x: 310,
    y: 140,
    width: 1200,
    height: 480,
    delay: 15,
  },
  // Row 3: MCP Orchestrator label
  {
    label: "MCP Orchestrator (K8s)",
    sublabel: "",
    color: colors.violet,
    x: 660,
    y: 170,
    width: 500,
    delay: 25,
  },
  // Row 4: MCP Servers (inside Archestra)
  {
    label: "Playwright MCP",
    sublabel: "Browser Automation",
    color: colors.cyan,
    x: 380,
    y: 230,
    width: 260,
    delay: 35,
  },
  {
    label: "GitHub MCP",
    sublabel: "Code & PR Analysis",
    color: colors.cyan,
    x: 780,
    y: 230,
    width: 260,
    delay: 40,
  },
  {
    label: "Slack MCP",
    sublabel: "Team Notifications",
    color: colors.cyan,
    x: 1180,
    y: 230,
    width: 260,
    delay: 45,
  },
  // Row 5: Agent Pipeline
  {
    label: "Incident Triage Agent",
    sublabel: "gpt-4o-mini \u00B7 Playwright, Slack",
    color: colors.emerald,
    x: 380,
    y: 370,
    width: 260,
    delay: 60,
  },
  {
    label: "Root Cause Analyzer",
    sublabel: "claude-3.5-sonnet \u00B7 GitHub, Playwright",
    color: colors.emerald,
    x: 780,
    y: 370,
    width: 260,
    delay: 65,
  },
  {
    label: "Security Guardian",
    sublabel: "claude-3.5-sonnet \u00B7 Validation Only",
    color: colors.amber,
    x: 1180,
    y: 370,
    width: 260,
    delay: 70,
  },
  // Row 6: Bottom features
  {
    label: "Cost Controls",
    sublabel: "",
    color: colors.emerald,
    x: 380,
    y: 490,
    width: 180,
    delay: 90,
  },
  {
    label: "Observability",
    sublabel: "",
    color: colors.cyan,
    x: 600,
    y: 490,
    width: 180,
    delay: 95,
  },
  {
    label: "Security Policies",
    sublabel: "",
    color: colors.amber,
    x: 820,
    y: 490,
    width: 200,
    delay: 100,
  },
  {
    label: "Model Routing",
    sublabel: "",
    color: colors.violet,
    x: 1060,
    y: 490,
    width: 200,
    delay: 105,
  },
];

// All arrows are vertical straight lines
const arrows: ArrowConfig[] = [
  // Dashboard → Archestra Platform (vertical center)
  { fromX: 910, fromY: 82, toX: 910, toY: 140, delay: 10, color: colors.blue },
  // MCP Servers → Agents (vertical straight lines)
  { fromX: 510, fromY: 296, toX: 510, toY: 370, delay: 55, color: colors.cyan },
  { fromX: 910, fromY: 296, toX: 910, toY: 370, delay: 58, color: colors.cyan },
  // Agents → Security Guardian (horizontal flow arrows)
  // Triage → Root Cause (horizontal)
  { fromX: 640, fromY: 395, toX: 780, toY: 395, delay: 75, color: colors.emerald },
  // Root Cause → Security Guardian (horizontal)
  { fromX: 1040, fromY: 395, toX: 1180, toY: 395, delay: 80, color: colors.emerald },
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

  const scale = interpolate(progress, [0, 1], [isContainer ? 0.95 : 0.7, 1]);

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
          background: `${colors.violet}08`,
          border: `2px solid ${colors.violet}30`,
          borderRadius: 16,
          padding: "12px 20px",
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: colors.violet,
            letterSpacing: 3,
            textTransform: "uppercase",
            textAlign: "center",
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
        borderRadius: 12,
        padding: "14px 18px",
        textAlign: "center",
        boxShadow: `0 0 20px ${box.color}15`,
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 700, color: box.color }}>
        {box.label}
      </div>
      {box.sublabel && (
        <div style={{ fontSize: 12, color: colors.muted, marginTop: 3 }}>
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
      height="700"
    >
      <line
        x1={arrow.fromX}
        y1={arrow.fromY}
        x2={currentX}
        y2={currentY}
        stroke={arrow.color}
        strokeWidth={2.5}
        opacity={0.7}
      />
      {progress >= 0.9 && (
        <>
          {/* Arrow head */}
          {dy !== 0 ? (
            <polygon
              points={`${arrow.toX},${arrow.toY} ${arrow.toX - 5},${arrow.toY - 8} ${arrow.toX + 5},${arrow.toY - 8}`}
              fill={arrow.color}
              opacity={0.8}
            />
          ) : (
            <polygon
              points={`${arrow.toX},${arrow.toY} ${arrow.toX - 8},${arrow.toY - 5} ${arrow.toX - 8},${arrow.toY + 5}`}
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
    <div style={{ position: "relative", width: 1920, height: 600 }}>
      {/* Archestra container first (behind everything) */}
      <ArchBox box={boxes[1]} isContainer />

      {/* Arrows */}
      {arrows.map((arrow, i) => (
        <AnimatedArrow key={`arrow-${i}`} arrow={arrow} />
      ))}

      {/* All boxes except the container */}
      {boxes.map((box, i) => {
        if (i === 1) return null; // skip container, already rendered
        return <ArchBox key={`box-${i}`} box={box} />;
      })}
    </div>
  );
};
