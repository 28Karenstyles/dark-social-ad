import { Composition } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { ZeeChipsAd } from "./ZeeChipsAd";
import { DVLETechAd } from "./DVLETechAd";
import { DarkSocialAd } from "./DarkSocialAd";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema}
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />

      <Composition
        id="ZeeChipsAd"
        component={ZeeChipsAd}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="DVLETechAd"
        component={DVLETechAd}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="DarkSocialAd"
        component={DarkSocialAd}
        durationInFrames={1350}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
