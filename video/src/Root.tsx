import React from "react";
import { Composition } from "remotion";
import { DemoVideo } from "./Video";
import { FPS, WIDTH, HEIGHT, TOTAL_DURATION } from "./theme";
import "./styles/global.css";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DemoVideo"
        component={DemoVideo}
        durationInFrames={TOTAL_DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
