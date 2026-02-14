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

// Simulated chat conversation about a deployment question
const chatMessages: {
  role: "user" | "assistant";
  content: string;
  delay: number;
  tools?: string[];
}[] = [
  {
    role: "user",
    content: "What happened with the latest deployment? Any issues?",
    delay: 40,
  },
  {
    role: "assistant",
    content:
      "**Latest Deployment Analysis:**\n\n" +
      "PR #847 'Add user analytics tracking' was merged at 10:12 UTC.\n\n" +
      "**Issue detected:** Database connection pool hit 95% capacity within 8 minutes of deployment.\n\n" +
      "**Root Cause:** N+1 query pattern found in `UserService.getAnalytics()` — each user page view triggers 15+ separate DB queries.\n\n" +
      "**Status:** Triage Agent flagged it as Critical. On-call team notified via Slack.\n\n" +
      "**Recommendation:** Add eager loading or revert PR #847.",
    delay: 100,
    tools: ["playwright-mcp", "github-mcp", "slack-mcp"],
  },
  {
    role: "user",
    content: "Can the agent auto-revert that PR?",
    delay: 310,
  },
  {
    role: "assistant",
    content:
      "**Security Guardian blocked** the auto-revert request.\n\n" +
      "Production code changes require **human approval** per our security policy. " +
      "The on-call engineer has been notified in #oncall-backend with the full context and recommended fix.\n\n" +
      "Cost so far: 2,600 tokens ($0.004) — ~25 min of manual investigation saved.",
    delay: 370,
    tools: ["slack-mcp"],
  },
];

// Typewriter effect for text
const useTypewriter = (text: string, startFrame: number, charsPerFrame = 2) => {
  const frame = useCurrentFrame();
  const elapsed = frame - startFrame;
  if (elapsed < 0) return "";
  const chars = Math.min(text.length, Math.floor(elapsed * charsPerFrame));
  return text.slice(0, chars);
};

const ChatBubble: React.FC<{
  message: (typeof chatMessages)[0];
  frame: number;
  fps: number;
}> = ({ message, frame, fps }) => {
  const isUser = message.role === "user";

  const progress = spring({
    frame: frame - message.delay,
    fps,
    config: { damping: 15, stiffness: 100, mass: 0.5 },
  });

  const opacity = interpolate(frame - message.delay, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const y = interpolate(progress, [0, 1], [20, 0]);

  // For assistant messages, typewriter the content
  const elapsed = frame - message.delay - 10;
  const maxChars = message.content.length;
  const visibleChars = isUser
    ? maxChars
    : Math.min(maxChars, Math.max(0, Math.floor(elapsed * 1.5)));
  const displayContent = message.content.slice(0, visibleChars);

  // Simple markdown bold rendering
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} style={{ color: isUser ? "#fff" : colors.text }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  if (opacity <= 0) return null;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
        marginBottom: 16,
      }}
    >
      {/* Role label */}
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: isUser ? colors.violetLight : colors.cyan,
          marginBottom: 6,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {isUser ? (
          <>You</>
        ) : (
          <>
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: 4,
                background: `${colors.cyan}20`,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
              }}
            >
              {"\u{1F916}"}
            </span>
            DevOps Copilot
          </>
        )}
      </div>

      {/* Bubble */}
      <div
        style={{
          maxWidth: 520,
          background: isUser ? colors.violet : "rgba(24,24,27,0.8)",
          border: isUser ? "none" : `1px solid ${colors.border}`,
          borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          padding: "14px 18px",
          fontSize: 15,
          lineHeight: 1.6,
          color: isUser ? "#fff" : colors.muted,
          whiteSpace: "pre-wrap",
        }}
      >
        {renderContent(displayContent)}
        {/* Typing cursor for assistant */}
        {!isUser && visibleChars < maxChars && visibleChars > 0 && (
          <span
            style={{
              display: "inline-block",
              width: 2,
              height: 14,
              background: colors.cyan,
              marginLeft: 2,
              opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0,
            }}
          />
        )}
      </div>

      {/* Tool badges */}
      {message.tools && visibleChars >= maxChars * 0.9 && (
        <div
          style={{
            display: "flex",
            gap: 6,
            marginTop: 6,
            opacity: interpolate(
              frame - message.delay - maxChars / 1.5,
              [0, 15],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
          }}
        >
          {message.tools.map((tool, i) => (
            <span
              key={i}
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: colors.cyan,
                background: `${colors.cyan}15`,
                border: `1px solid ${colors.cyan}30`,
                borderRadius: 6,
                padding: "2px 8px",
              }}
            >
              {tool}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export const ChatDemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Panel slide in
  const panelProgress = spring({
    frame: frame - 5,
    fps,
    config: { damping: 18, stiffness: 80, mass: 0.7 },
  });
  const panelOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const panelX = interpolate(panelProgress, [0, 1], [100, 0]);

  return (
    <AbsoluteFill
      style={{
        background: colors.bg,
        display: "flex",
        padding: "40px 80px",
        gap: 60,
      }}
    >
      {/* Left side - context */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <AnimatedText
          text="AI Chat Assistant"
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

        <AnimatedText
          text="Ask anything about your infrastructure"
          delay={8}
          fontSize={44}
          fontWeight={700}
          color={colors.text}
          style={{ marginBottom: 24, lineHeight: 1.3 }}
        />

        <AnimatedText
          text="Powered by Archestra's A2A protocol, the chat connects directly to your AI agents for real-time incident investigation."
          delay={18}
          fontSize={18}
          color={colors.muted}
          fontWeight={400}
          style={{ lineHeight: 1.7, maxWidth: 500 }}
          direction="none"
        />

        {/* Feature bullets */}
        {[
          { text: "Real-time agent communication", delay: 40, icon: "\u26A1" },
          { text: "Markdown-rich responses", delay: 50, icon: "\u{1F4DD}" },
          { text: "MCP tool usage transparency", delay: 60, icon: "\u{1F50C}" },
        ].map((item, i) => {
          const itemOpacity = interpolate(
            frame - item.delay,
            [0, 12],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          return (
            <div
              key={i}
              style={{
                opacity: itemOpacity,
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: i === 0 ? 32 : 14,
                fontSize: 17,
                color: colors.text,
              }}
            >
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              {item.text}
            </div>
          );
        })}
      </div>

      {/* Right side - chat panel */}
      <div
        style={{
          width: 580,
          opacity: panelOpacity,
          transform: `translateX(${panelX}px)`,
          background: "rgba(24,24,27,0.6)",
          border: `1px solid ${colors.border}`,
          borderRadius: 20,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${colors.violet}08`,
        }}
      >
        {/* Chat header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${colors.border}`,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: `${colors.violet}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            {"\u{1F916}"}
          </div>
          <div>
            <div
              style={{ fontSize: 15, fontWeight: 600, color: colors.text }}
            >
              DevOps Copilot
            </div>
            <div style={{ fontSize: 11, color: colors.emerald }}>
              Live via Archestra
            </div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: colors.emerald,
                boxShadow: `0 0 8px ${colors.emerald}`,
              }}
            />
          </div>
        </div>

        {/* Chat messages area */}
        <div
          style={{
            flex: 1,
            padding: "20px 18px",
            display: "flex",
            flexDirection: "column",
            overflowY: "hidden",
          }}
        >
          {chatMessages.map((msg, i) => (
            <ChatBubble key={i} message={msg} frame={frame} fps={fps} />
          ))}
        </div>

        {/* Input bar */}
        <div
          style={{
            padding: "12px 16px",
            borderTop: `1px solid ${colors.border}`,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 38,
              background: "rgba(0,0,0,0.3)",
              borderRadius: 10,
              border: `1px solid ${colors.border}`,
              display: "flex",
              alignItems: "center",
              padding: "0 14px",
              fontSize: 14,
              color: colors.muted,
            }}
          >
            {/* Typing animation for user input */}
            {frame >= 30 && frame < 45 && (
              <>
                {"What happened with the latest d".slice(
                  0,
                  Math.floor(
                    interpolate(frame, [30, 40], [0, 30], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    })
                  )
                )}
                <span
                  style={{
                    width: 1,
                    height: 14,
                    background: colors.text,
                    display: "inline-block",
                    marginLeft: 1,
                    opacity: Math.floor(frame / 6) % 2,
                  }}
                />
              </>
            )}
            {frame < 30 && "Ask about your infrastructure..."}
          </div>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: colors.violet,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              color: "#fff",
            }}
          >
            {"\u2191"}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
