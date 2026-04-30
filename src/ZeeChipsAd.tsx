import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const BG = "#0a0a0a";
const GOLD = "#FFD700";

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const brandIn = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80 },
  });
  const tagIn = spring({
    frame: frame - 20,
    fps,
    config: { damping: 18, stiffness: 60 },
  });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 40,
        padding: 60,
      }}
    >
      <div
        style={{
          opacity: brandIn,
          transform: `translateY(${interpolate(brandIn, [0, 1], [-100, 0])}px)`,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 110,
            fontWeight: 900,
            color: GOLD,
            letterSpacing: 14,
            textShadow: `0 0 40px ${GOLD}`,
          }}
        >
          ZEE
        </span>
        <span
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 110,
            fontWeight: 400,
            color: "#ffffff",
            letterSpacing: 14,
            marginLeft: 20,
          }}
        >
          CHIPS
        </span>
      </div>
      <div
        style={{
          width: interpolate(tagIn, [0, 1], [0, 200]),
          height: 2,
          background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
        }}
      />
      <div
        style={{
          opacity: tagIn,
          transform: `translateY(${interpolate(tagIn, [0, 1], [60, 0])}px)`,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 54,
            fontStyle: "italic",
            color: "#f0f0f0",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {"The crunch you\ndidn't know\nyou needed."}
        </p>
      </div>
    </AbsoluteFill>
  );
};

const FeaturePill: React.FC<{ text: string; icon: string; delay: number }> = ({
  text,
  icon,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 16, stiffness: 90 },
  });
  return (
    <div
      style={{
        opacity: progress,
        transform: `translateX(${interpolate(progress, [0, 1], [-300, 0])}px)`,
        display: "flex",
        alignItems: "center",
        gap: 28,
        background: "rgba(255,215,0,0.07)",
        border: "1.5px solid rgba(255,215,0,0.35)",
        borderRadius: 100,
        padding: "26px 52px",
        width: 700,
      }}
    >
      <span style={{ fontSize: 60 }}>{icon}</span>
      <span
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 48,
          fontWeight: 700,
          color: GOLD,
        }}
      >
        {text}
      </span>
    </div>
  );
};

const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headerIn = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 70 },
  });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 44,
        padding: 60,
      }}
    >
      <div
        style={{
          opacity: headerIn,
          transform: `translateY(${interpolate(headerIn, [0, 1], [-40, 0])}px)`,
        }}
      >
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 30,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: 10,
            textTransform: "uppercase",
            textAlign: "center",
            margin: 0,
          }}
        >
          What makes us different
        </p>
      </div>
      <FeaturePill text="100% Plantain" icon="🌿" delay={15} />
      <FeaturePill text="Crispy & Addictive" icon="✨" delay={50} />
      <FeaturePill text="Premium Quality" icon="👑" delay={85} />
    </AbsoluteFill>
  );
};

const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const textIn = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 14, stiffness: 80 },
  });
  const btnIn = spring({
    frame: Math.max(0, frame - 35),
    fps,
    config: { damping: 16, stiffness: 70 },
  });
  const glow = interpolate(
    Math.sin(frame * 0.18) * 0.5 + 0.5,
    [0, 1],
    [20, 50],
  );
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 52,
      }}
    >
      <div
        style={{
          opacity: textIn,
          transform: `scale(${interpolate(textIn, [0, 1], [0.7, 1])})`,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 36,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: 10,
            textTransform: "uppercase",
            margin: 0,
            marginBottom: 20,
          }}
        >
          Don't miss out
        </p>
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 88,
            fontWeight: 900,
            color: GOLD,
            letterSpacing: 4,
            textTransform: "uppercase",
            margin: 0,
            lineHeight: 1.1,
            textShadow: `0 0 50px ${GOLD}`,
          }}
        >
          Order Yours{"\n"}Today.
        </p>
      </div>
      <div
        style={{
          opacity: btnIn,
          transform: `translateY(${interpolate(btnIn, [0, 1], [60, 0])}px)`,
          background: GOLD,
          borderRadius: 100,
          padding: "30px 90px",
          boxShadow: `0 0 ${glow}px rgba(255,215,0,0.8)`,
        }}
      >
        <span
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 46,
            fontWeight: 900,
            color: "#0a0a0a",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          zeechips.com
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const ZeeChipsAd: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Sequence from={0} durationInFrames={90}>
        <HookScene />
      </Sequence>
      <Sequence from={90} durationInFrames={180}>
        <FeaturesScene />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
