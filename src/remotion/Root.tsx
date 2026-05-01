import { Composition, Folder } from "remotion";
import { GymAppLaunch } from "./launch/GymAppLaunch";

export const RemotionRoot = () => {
  return (
    <Folder name="MiguelGym">
      <Composition
        id="GymAppLaunch"
        component={GymAppLaunch}
        durationInFrames={960}
        fps={30}
        width={1920}
        height={1080}
      />
    </Folder>
  );
};
