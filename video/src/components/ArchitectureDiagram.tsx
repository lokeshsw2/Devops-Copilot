import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { colors } from "../theme";

// Faithful recreation of the README architecture:
//
// ┌──────────── DevOps Copilot Dashboard ────────────┐
// └──────────────────────┬───────────────────────────┘
//                        │ API
// ┌──────────────────────▼──── ARCHESTRA PLATFORM ───────────────┐
// │  ┌──────────────── MCP Orchestrator (K8s) ────────────────┐  │
// │  │  [Playwright MCP]   [GitHub MCP]   [Slack MCP]         │  │
// │  └───────┬──────────────────┬──────────────┬──────────────┘  │
// │  ┌───────▼──────────────────▼──────────────▼──────────────┐  │
// │  │               AGENT PIPELINE                            │  │
// │  │  Alert → Triage Agent → Root Cause Agent → Notification │  │
// │  │                    ▼                                    │  │
// │  │           Security Guardian                             │  │
// │  │          (Dual-LLM Safety Gate)                         │  │
// │  └────────────────────────────────────────────────────────┘  │
// │  [Cost Controls] [Observability] [Security Policies] [Model] │
// └──────────────────────────────────────────────────────────────┘
//        │                  │                  │
//   [Grafana/Datadog]  [GitHub Repos]    [Slack Channels]

interface ArrowConfig {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  delay: number;
  color: string;
}

// Layout constants
const CX = 900; // center X

// Animated box with spring
const ABox: React.FC<{
  x: number;
  y: number;
  w: number;
  h?: number;
  label: string;
  sublabel?: string;
  color: string;
  delay: number;
  fontSize?: number;
  sublabelSize?: number;
}> = ({ x, y, w, h, label, sublabel, color, delay, fontSize = 17, sublabelSize = 12 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 80, mass: 0.6 } });
  const opacity = interpolate(frame - delay, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(progress, [0, 1], [0.8, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center",
        background: "rgba(24,24,27,0.85)",
        border: `2px solid ${color}60`,
        borderRadius: 12,
        padding: h ? undefined : "14px 18px",
        textAlign: "center",
        boxShadow: `0 0 20px ${color}12`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: h ? "flex-start" : "center",
      }}
    >
      {!h && (
        <>
          <div style={{ fontSize, fontWeight: 700, color }}>{label}</div>
          {sublabel && <div style={{ fontSize: sublabelSize, color: colors.muted, marginTop: 4 }}>{sublabel}</div>}
        </>
      )}
    </div>
  );
};

// Container box (Archestra, MCP Orchestrator, Agent Pipeline)
const Container: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  color: string;
  delay: number;
  labelAlign?: "left" | "center";
}> = ({ x, y, w, h, label, color, delay, labelAlign = "left" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 80, mass: 0.6 } });
  const opacity = interpolate(frame - delay, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(progress, [0, 1], [0.97, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center top",
        background: `${color}05`,
        border: `2px solid ${color}22`,
        borderRadius: 16,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 10,
          left: labelAlign === "center" ? "50%" : 18,
          transform: labelAlign === "center" ? "translateX(-50%)" : undefined,
          fontSize: 12,
          fontWeight: 700,
          color: `${color}`,
          letterSpacing: 3,
          textTransform: "uppercase",
          background: `${color}12`,
          padding: "5px 16px",
          borderRadius: 6,
          border: `1px solid ${color}20`,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );
};

const AnimatedArrow: React.FC<{ arrow: ArrowConfig; dashed?: boolean }> = ({ arrow, dashed }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - arrow.delay, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (progress <= 0) return null;

  const dx = arrow.toX - arrow.fromX;
  const dy = arrow.toY - arrow.fromY;
  const curX = arrow.fromX + dx * progress;
  const curY = arrow.fromY + dy * progress;
  const isVertical = Math.abs(dy) > Math.abs(dx);

  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width="1920" height="900">
      <line
        x1={arrow.fromX} y1={arrow.fromY} x2={curX} y2={curY}
        stroke={arrow.color} strokeWidth={2.5} opacity={0.65}
        strokeDasharray={dashed ? "8 4" : undefined}
      />
      {progress >= 0.9 && (
        isVertical ? (
          <polygon
            points={`${arrow.toX},${arrow.toY} ${arrow.toX - 5},${arrow.toY - (dy > 0 ? 9 : -9)} ${arrow.toX + 5},${arrow.toY - (dy > 0 ? 9 : -9)}`}
            fill={arrow.color} opacity={0.8}
          />
        ) : (
          <polygon
            points={`${arrow.toX},${arrow.toY} ${arrow.toX - (dx > 0 ? 9 : -9)},${arrow.toY - 5} ${arrow.toX - (dx > 0 ? 9 : -9)},${arrow.toY + 5}`}
            fill={arrow.color} opacity={0.8}
          />
        )
      )}
    </svg>
  );
};

// Pipeline flow label (e.g. "Alert →")
const FlowLabel: React.FC<{
  text: string;
  x: number;
  y: number;
  color: string;
  delay: number;
  fontSize?: number;
}> = ({ text, x, y, color, delay, fontSize = 15 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity,
        fontSize,
        fontWeight: 600,
        color,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

export const ArchitectureDiagram: React.FC = () => {
  // Y positions
  const dashY = 0;
  const archestraY = 90;
  const archestraH = 620;
  const mcpOrchY = archestraY + 35;
  const mcpOrchH = 130;
  const mcpY = mcpOrchY + 40;
  const pipelineY = archestraY + 195;
  const pipelineH = 260;
  const agentY = pipelineY + 55;
  const guardianY = pipelineY + 160;
  const featuresY = archestraY + 480;
  const extY = archestraY + archestraH + 30;

  // X positions for MCP 3-column layout
  const mcpCol1 = 280;
  const mcpCol2 = 700;
  const mcpCol3 = 1120;
  const mcpColW = 300;

  // Agent pipeline: 4 boxes in a clear horizontal flow
  // Alert → Triage Agent → Root Cause Agent → Notification
  const pipeLeft = 270;
  const pipeRight = 1550;
  const alertW = 140;
  const agentW = 300;
  const notifW = 200;
  const gap = 30; // gap between boxes for arrows
  // Total = 140 + 30 + 300 + 30 + 300 + 30 + 200 = 1030
  // Center within pipeline: (1340 - 1030) / 2 + 240 = 395
  const flowStartX = 310;
  const alertX = flowStartX;
  const triageX = alertX + alertW + gap;
  const rootCauseX = triageX + agentW + gap;
  const notifX = rootCauseX + agentW + gap;
  const agentMidY = agentY + 25; // vertical center of agent boxes

  const arrows: ArrowConfig[] = [
    // Dashboard → Archestra
    { fromX: CX, fromY: dashY + 60, toX: CX, toY: archestraY, delay: 8, color: colors.blue },
    // MCP servers → Agent Pipeline (vertical through orchestrator bottom)
    { fromX: mcpCol1 + mcpColW / 2, fromY: mcpY + 52, toX: mcpCol1 + mcpColW / 2, toY: pipelineY, delay: 48, color: colors.cyan },
    { fromX: mcpCol2 + mcpColW / 2, fromY: mcpY + 52, toX: mcpCol2 + mcpColW / 2, toY: pipelineY, delay: 50, color: colors.cyan },
    { fromX: mcpCol3 + mcpColW / 2, fromY: mcpY + 52, toX: mcpCol3 + mcpColW / 2, toY: pipelineY, delay: 52, color: colors.cyan },
    // Pipeline flow: Alert → Triage
    { fromX: alertX + alertW, fromY: agentMidY, toX: triageX, toY: agentMidY, delay: 64, color: colors.emerald },
    // Pipeline flow: Triage → Root Cause
    { fromX: triageX + agentW, fromY: agentMidY, toX: rootCauseX, toY: agentMidY, delay: 68, color: colors.emerald },
    // Pipeline flow: Root Cause → Notification
    { fromX: rootCauseX + agentW, fromY: agentMidY, toX: notifX, toY: agentMidY, delay: 72, color: colors.emerald },
    // Agents down to Security Guardian
    { fromX: (triageX + agentW / 2 + rootCauseX + agentW / 2) / 2, fromY: agentY + 55, toX: (triageX + agentW / 2 + rootCauseX + agentW / 2) / 2, toY: guardianY, delay: 78, color: colors.amber },
    // Archestra bottom → External services
    { fromX: mcpCol1 + mcpColW / 2, fromY: archestraY + archestraH, toX: mcpCol1 + mcpColW / 2, toY: extY, delay: 100, color: colors.muted },
    { fromX: mcpCol2 + mcpColW / 2, fromY: archestraY + archestraH, toX: mcpCol2 + mcpColW / 2, toY: extY, delay: 103, color: colors.muted },
    { fromX: mcpCol3 + mcpColW / 2, fromY: archestraY + archestraH, toX: mcpCol3 + mcpColW / 2, toY: extY, delay: 106, color: colors.muted },
  ];

  return (
    <div style={{ position: "relative", width: 1920, height: 850 }}>
      {/* 1. Containers (back to front) */}
      <Container x={200} y={archestraY} w={1420} h={archestraH} label="Archestra Platform" color={colors.violet} delay={5} />
      <Container x={240} y={mcpOrchY} w={1340} h={mcpOrchH} label="MCP Orchestrator (K8s)" color={colors.cyan} delay={18} labelAlign="center" />
      <Container x={240} y={pipelineY} w={1340} h={pipelineH} label="Agent Pipeline" color={colors.emerald} delay={55} />

      {/* 2. Arrows */}
      {arrows.map((a, i) => (
        <AnimatedArrow key={i} arrow={a} dashed={i >= 8} />
      ))}

      {/* 3. Dashboard box */}
      <ABox x={CX - 240} y={dashY} w={480} label="DevOps Copilot Dashboard" sublabel={"Next.js \u00B7 Real-time \u00B7 Observability"} color={colors.blue} delay={0} />

      {/* "API" label on arrow */}
      <FlowLabel text="API" x={CX + 8} y={dashY + 65} color={colors.muted} delay={8} fontSize={12} />

      {/* 4. MCP Server boxes */}
      <ABox x={mcpCol1} y={mcpY} w={mcpColW} label="Playwright MCP" sublabel="Browser Automation" color={colors.cyan} delay={28} />
      <ABox x={mcpCol2} y={mcpY} w={mcpColW} label="GitHub MCP" sublabel="Code & PR Analysis" color={colors.cyan} delay={32} />
      <ABox x={mcpCol3} y={mcpY} w={mcpColW} label="Slack MCP" sublabel="Team Notifications" color={colors.cyan} delay={36} />

      {/* 5. Agent pipeline flow: Alert → Triage → Root Cause → Notification */}
      <ABox x={alertX} y={agentY} w={alertW} label={"Alert"} color={colors.red} delay={60} fontSize={16} />
      <ABox x={triageX} y={agentY} w={agentW} label="Triage Agent" sublabel="gpt-4o-mini" color={colors.emerald} delay={62} />
      <ABox x={rootCauseX} y={agentY} w={agentW} label="Root Cause Agent" sublabel="claude-opus-4.6" color={colors.emerald} delay={65} />
      <ABox x={notifX} y={agentY} w={notifW} label={"Notification"} color={colors.emerald} delay={72} fontSize={14} />

      {/* 6. Security Guardian below agents */}
      <ABox x={CX - 200} y={guardianY} w={400} label="Security Guardian" sublabel={"Dual-LLM Safety Gate \u00B7 claude-opus-4.6"} color={colors.amber} delay={78} fontSize={18} sublabelSize={13} />

      {/* 7. Feature boxes at bottom of Archestra */}
      <ABox x={280} y={featuresY} w={200} label="Cost Controls" color={colors.emerald} delay={88} fontSize={14} />
      <ABox x={520} y={featuresY} w={200} label="Observability" color={colors.cyan} delay={91} fontSize={14} />
      <ABox x={760} y={featuresY} w={220} label="Security Policies" color={colors.amber} delay={94} fontSize={14} />
      <ABox x={1020} y={featuresY} w={210} label="Model Routing" color={colors.violet} delay={97} fontSize={14} />

      {/* 8. External service boxes below Archestra */}
      <ABox x={mcpCol1} y={extY} w={mcpColW} label="Grafana / Datadog / K8s" color={colors.muted} delay={100} fontSize={14} sublabelSize={11} />
      <ABox x={mcpCol2} y={extY} w={mcpColW} label="GitHub Repos & PRs" color={colors.muted} delay={103} fontSize={14} />
      <ABox x={mcpCol3} y={extY} w={mcpColW} label="Slack Channels" color={colors.muted} delay={106} fontSize={14} />
    </div>
  );
};
