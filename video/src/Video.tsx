import React from "react";
import {
  Sequence,
  AbsoluteFill,
  Audio,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
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
import { TOTAL_DURATION } from "./theme";

// Scene timing (30fps) — 11 scenes, 3:00 = 5400 frames
//
// Scene 1:  Title/Intro            0-5s       (frames 0-150)
// Scene 2:  The Problem            5-16s      (frames 150-480)
// Scene 3:  Architecture           16-32s     (frames 480-960)
// Scene 4:  Archestra Components   32-44s     (frames 960-1320)
// Scene 5:  Dashboard (live)       44-66s     (frames 1320-1980)
// Scene 6:  Chat Demo              66-82s     (frames 1980-2460)
// Scene 7:  Incident Demo          82-102s    (frames 2460-3060)
// Scene 8:  Security               102-120s   (frames 3060-3600)
// Scene 9:  Cost Intelligence      120-138s   (frames 3600-4140)
// Scene 10: Features Recap         138-154s   (frames 4140-4620)
// Scene 11: Outro                  154-180s   (frames 4620-5400)

interface SceneConfig {
  from: number;
  duration: number;
  Component: React.FC;
  name: string;
}

const scenes: SceneConfig[] = [
  { from: 0, duration: 150, Component: TitleScene, name: "Title" },
  { from: 150, duration: 330, Component: ProblemScene, name: "Problem" },
  { from: 480, duration: 480, Component: ArchitectureScene, name: "Architecture" },
  { from: 960, duration: 360, Component: ArchestraScene, name: "Archestra" },
  { from: 1320, duration: 660, Component: DashboardScene, name: "Dashboard" },
  { from: 1980, duration: 480, Component: ChatDemoScene, name: "ChatDemo" },
  { from: 2460, duration: 600, Component: IncidentDemoScene, name: "IncidentDemo" },
  { from: 3060, duration: 540, Component: SecurityScene, name: "Security" },
  { from: 3600, duration: 540, Component: CostScene, name: "Cost" },
  { from: 4140, duration: 480, Component: FeaturesScene, name: "Features" },
  { from: 4620, duration: 780, Component: OutroScene, name: "Outro" },
];

const SceneWithTransition: React.FC<{
  children: React.ReactNode;
  duration: number;
}> = ({ children, duration }) => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(frame, [duration - 12, duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>
      {children}
    </AbsoluteFill>
  );
};

export const DemoVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade music volume: full volume in middle, fade out at end
  const musicVolume = interpolate(
    frame,
    [0, 30, TOTAL_DURATION - 90, TOTAL_DURATION],
    [0, 0.18, 0.18, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill style={{ background: "#09090b" }}>
      {/* Background music */}
      <Audio src={staticFile("bgm.mp3")} volume={musicVolume} />

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
