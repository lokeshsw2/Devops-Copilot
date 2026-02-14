import React from "react";
import { Composition, Still } from "remotion";
import { DemoVideo } from "./Video";
import { Thumbnail } from "./Thumbnail";
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
      <Still
        id="Thumbnail"
        component={Thumbnail}
        width={1920}
        height={1080}
      />
    </>
  );
};
