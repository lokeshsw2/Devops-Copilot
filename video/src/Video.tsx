import React from "react";
import { Sequence, AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { TitleScene } from "./scenes/TitleScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { ArchitectureScene } from "./scenes/ArchitectureScene";
import { ArchestraScene } from "./scenes/ArchestraScene";
import { DashboardScene } from "./scenes/DashboardScene";
import { ChatDemoScene } from "./scenes/ChatDemoScene";
import { IncidentDemoScene } from "./scenes/IncidentDemoScene";
import { SecurityScene } from "./scenes/SecurityScene";
import { CostScene } from "./scenes/CostScene";
import { FeaturesScene } from "./scenes/FeaturesScene";
import { OutroScene } from "./scenes/OutroScene";

// Scene timing (30fps) — 11 scenes, ~4 minutes = 7200 frames
//
// Scene 1:  Title/Intro            0-5s       (frames 0-150)
// Scene 2:  The Problem            5-20s      (frames 150-600)
// Scene 3:  Architecture           20-38s     (frames 600-1140)
// Scene 4:  Archestra Components   38-52s     (frames 1140-1560)
// Scene 5:  Dashboard (live)       52-78s     (frames 1560-2340)
// Scene 6:  Chat Demo              78-98s     (frames 2340-2940)
// Scene 7:  Incident Demo          98-138s    (frames 2940-4140)
// Scene 8:  Security               138-162s   (frames 4140-4860)
// Scene 9:  Cost Intelligence      162-186s   (frames 4860-5580)
// Scene 10: Features Recap         186-210s   (frames 5580-6300)
// Scene 11: Outro                  210-240s   (frames 6300-7200)

interface SceneConfig {
  from: number;
  duration: number;
  Component: React.FC;
  name: string;
}

const scenes: SceneConfig[] = [
  { from: 0, duration: 150, Component: TitleScene, name: "Title" },
  { from: 150, duration: 450, Component: ProblemScene, name: "Problem" },
  { from: 600, duration: 540, Component: ArchitectureScene, name: "Architecture" },
  { from: 1140, duration: 420, Component: ArchestraScene, name: "Archestra" },
  { from: 1560, duration: 780, Component: DashboardScene, name: "Dashboard" },
  { from: 2340, duration: 600, Component: ChatDemoScene, name: "ChatDemo" },
  { from: 2940, duration: 1200, Component: IncidentDemoScene, name: "IncidentDemo" },
  { from: 4140, duration: 720, Component: SecurityScene, name: "Security" },
  { from: 4860, duration: 720, Component: CostScene, name: "Cost" },
  { from: 5580, duration: 720, Component: FeaturesScene, name: "Features" },
  { from: 6300, duration: 900, Component: OutroScene, name: "Outro" },
];

const SceneWithTransition: React.FC<{
  children: React.ReactNode;
  duration: number;
}> = ({ children, duration }) => {
  const frame = useCurrentFrame();

  // Fade in at start
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade out at end
  const fadeOut = interpolate(
    frame,
    [duration - 15, duration],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>
      {children}
    </AbsoluteFill>
  );
};

export const DemoVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#09090b" }}>
      {scenes.map((scene) => (
        <Sequence
          key={scene.name}
          from={scene.from}
          durationInFrames={scene.duration}
          name={scene.name}
        >
          <SceneWithTransition duration={scene.duration}>
            <scene.Component />
          </SceneWithTransition>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
