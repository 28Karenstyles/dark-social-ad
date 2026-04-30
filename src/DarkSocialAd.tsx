import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ── Palette ───────────────────────────────────────────────────────────────────
const BG = "#020206";
const RED = "#ff3b3b";
const RED_DIM = "rgba(255,59,59,0.15)";
const WHITE = "#ffffff";
const GREY = "rgba(255,255,255,0.45)";

// ── Helpers ───────────────────────────────────────────────────────────────────
const clamp = (v: number) => Math.max(0, Math.min(1, v));

// ── Starfield ─────────────────────────────────────────────────────────────────
const Stars: React.FC<{ zoom?: number }> = ({ zoom = 1 }) => {
  const frame = useCurrentFrame();
  const stars = Array.from({ length: 80 }, (_, i) => ({
    x: (i * 137.508) % 100,
    y: (i * 61.803) % 100,
    size: 1 + (i % 3),
    speed: 0.005 + (i % 5) * 0.002,
    opacity: 0.2 + (i % 4) * 0.15,
  }));

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {stars.map((s, i) => {
        const drift = (s.y + frame * s.speed * zoom) % 100;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${s.x}%`,
              top: `${drift}%`,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: WHITE,
              opacity: s.opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ── Phone graphic ─────────────────────────────────────────────────────────────
const PhoneGraphic: React.FC<{ progress: number; scrollOffset: number }> = ({
  progress,
  scrollOffset,
}) => {
  const feedItems = [
    { h: 120, color: "rgba(255,59,59,0.3)", label: "🔴 LIVE" },
    { h: 80, color: "rgba(255,255,255,0.06)", label: "" },
    { h: 100, color: "rgba(255,255,255,0.04)", label: "" },
    { h: 90, color: "rgba(255,59,59,0.15)", label: "❤️ 4.2K" },
    { h: 110, color: "rgba(255,255,255,0.05)", label: "" },
    { h: 95, color: "rgba(255,255,255,0.07)", label: "" },
  ];

  return (
    <div
      style={{
        opacity: progress,
        transform: `scale(${interpolate(progress, [0, 1], [0.6, 1])}) translateY(${interpolate(progress, [0, 1], [100, 0])}px)`,
        width: 280,
        height: 520,
        borderRadius: 40,
        border: "2px solid rgba(255,255,255,0.15)",
        background: "rgba(10,5,20,0.95)",
        overflow: "hidden",
        position: "relative",
        boxShadow: `0 0 60px rgba(255,59,59,0.15), 0 40px 80px rgba(0,0,0,0.6)`,
      }}
    >
      {/* Notch */}
      <div
        style={{
          position: "absolute",
          top: 14,
          left: "50%",
          transform: "translateX(-50%)",
          width: 80,
          height: 20,
          borderRadius: 10,
          background: "#000",
          zIndex: 10,
        }}
      />

      {/* Status bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "48px 20px 8px",
          opacity: 0.5,
        }}
      >
        <span style={{ fontFamily: "monospace", fontSize: 16, color: WHITE }}>
          9:41
        </span>
        <span style={{ fontFamily: "monospace", fontSize: 16, color: WHITE }}>
          ●●●
        </span>
      </div>

      {/* Feed scroll */}
      <div
        style={{
          transform: `translateY(${-scrollOffset}px)`,
          transition: "none",
        }}
      >
        {feedItems.map((item, i) => (
          <div
            key={i}
            style={{
              margin: "6px 12px",
              height: item.h,
              borderRadius: 16,
              background: item.color,
              border: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "flex-end",
              padding: "10px 14px",
            }}
          >
            {item.label && (
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 18,
                  color: WHITE,
                  opacity: 0.8,
                }}
              >
                {item.label}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Red glow overlay at bottom = addictive */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background: "linear-gradient(transparent, rgba(255,30,30,0.12))",
        }}
      />

      {/* Home bar */}
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: "50%",
          transform: "translateX(-50%)",
          width: 100,
          height: 4,
          borderRadius: 2,
          background: "rgba(255,255,255,0.3)",
        }}
      />
    </div>
  );
};

// ── Clock graphic ─────────────────────────────────────────────────────────────
const ClockGraphic: React.FC<{ progress: number; fastSpin: number }> = ({
  progress,
  fastSpin,
}) => {
  const radius = 90;
  const cx = 110;
  const cy = 110;

  const hourAngle = fastSpin * 360;
  const minuteAngle = fastSpin * 360 * 12;

  const toRad = (deg: number) => (deg - 90) * (Math.PI / 180);
  const hx = cx + 55 * Math.cos(toRad(hourAngle));
  const hy = cy + 55 * Math.sin(toRad(hourAngle));
  const mx = cx + 75 * Math.cos(toRad(minuteAngle));
  const my = cy + 75 * Math.sin(toRad(minuteAngle));

  return (
    <div
      style={{
        opacity: progress,
        transform: `scale(${interpolate(progress, [0, 1], [0.5, 1])})`,
      }}
    >
      <svg width="220" height="220" viewBox="0 0 220 220">
        {/* Outer ring */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="2"
        />
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={RED}
          strokeWidth="2"
          strokeDasharray="30 10"
          opacity="0.5"
        />

        {/* Hour markers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = toRad(i * 30);
          const x1 = cx + 80 * Math.cos(a);
          const y1 = cy + 80 * Math.sin(a);
          const x2 = cx + 90 * Math.cos(a);
          const y2 = cy + 90 * Math.sin(a);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
            />
          );
        })}

        {/* Hands */}
        <line
          x1={cx}
          y1={cy}
          x2={hx}
          y2={hy}
          stroke={WHITE}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1={cx}
          y1={cy}
          x2={mx}
          y2={my}
          stroke={RED}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Center dot */}
        <circle cx={cx} cy={cy} r="6" fill={RED} />
        <circle cx={cx} cy={cy} r="3" fill={WHITE} />

        {/* Glow */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={RED}
          strokeWidth="1"
          opacity="0.2"
        />
      </svg>
    </div>
  );
};

// ── Brain/dopamine loop graphic ───────────────────────────────────────────────
const DopamineLoop: React.FC<{ progress: number; frame: number }> = ({
  progress,
  frame,
}) => {
  const pulse = Math.sin(frame * 0.15) * 0.5 + 0.5;
  const nodes = [
    { x: 110, y: 60, label: "SCROLL" },
    { x: 210, y: 160, label: "LIKE" },
    { x: 160, y: 270, label: "DOPAMINE" },
    { x: 60, y: 270, label: "REPEAT" },
    { x: 10, y: 160, label: "CRAVE" },
  ];

  return (
    <div
      style={{
        opacity: progress,
        transform: `scale(${interpolate(progress, [0, 1], [0.6, 1])})`,
      }}
    >
      <svg width="220" height="330" viewBox="0 0 220 330">
        {/* Connection lines */}
        {nodes.map((node, i) => {
          const next = nodes[(i + 1) % nodes.length];
          return (
            <line
              key={i}
              x1={node.x}
              y1={node.y}
              x2={next.x}
              y2={next.y}
              stroke={i === 2 ? RED : "rgba(255,255,255,0.2)"}
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <g key={i}>
            <circle
              cx={node.x}
              cy={node.y}
              r={i === 2 ? 28 : 22}
              fill={i === 2 ? RED_DIM : "rgba(255,255,255,0.05)"}
              stroke={i === 2 ? RED : "rgba(255,255,255,0.2)"}
              strokeWidth="1.5"
            />
            {i === 2 && (
              <circle
                cx={node.x}
                cy={node.y}
                r={28 + interpolate(pulse, [0, 1], [0, 12])}
                fill="none"
                stroke={RED}
                strokeWidth="1"
                opacity={interpolate(pulse, [0, 1], [0.5, 0])}
              />
            )}
            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              fill={i === 2 ? RED : WHITE}
              fontSize={i === 2 ? "9" : "8"}
              fontFamily="monospace"
              fontWeight="bold"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// ── Cinematic text line ───────────────────────────────────────────────────────
const CineLine: React.FC<{
  text: string;
  delay: number;
  size?: number;
  color?: string;
  weight?: number;
  italic?: boolean;
}> = ({
  text,
  delay,
  size = 52,
  color = WHITE,
  weight = 400,
  italic = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 20, stiffness: 60 },
  });
  return (
    <p
      style={{
        fontFamily: italic ? "Georgia, serif" : "'Courier New', monospace",
        fontSize: size,
        fontWeight: weight,
        fontStyle: italic ? "italic" : "normal",
        color,
        margin: 0,
        lineHeight: 1.3,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.95, 1])})`,
        letterSpacing: italic ? 1 : 2,
      }}
    >
      {text}
    </p>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// SCENE 1 — HOOK (0–5s, frames 0–149)
// ──────────────────────────────────────────────────────────────────────────────
const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneProgress = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 18, stiffness: 60 },
  });
  const scrollOffset = interpolate(frame, [20, 149], [0, 180], {
    extrapolateRight: "clamp",
  });

  // Zoom in from far
  const zoom = interpolate(frame, [0, 149], [0.85, 1.08], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 60,
        transform: `scale(${zoom})`,
      }}
    >
      <Stars zoom={1.5} />

      {/* Red vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(255,30,30,0.08) 100%)",
          pointerEvents: "none",
        }}
      />

      <PhoneGraphic progress={phoneProgress} scrollOffset={scrollOffset} />

      <div style={{ textAlign: "center" }}>
        <CineLine
          text="You opened this app"
          delay={15}
          size={44}
          color={GREY}
        />
        <CineLine text="for 5 minutes." delay={30} size={44} color={GREY} />
        <CineLine
          text="That was 3 hours ago."
          delay={55}
          size={60}
          color={WHITE}
          weight={700}
        />
      </div>
    </AbsoluteFill>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// SCENE 2 — THE SYSTEM (5–15s, frames 150–449)
// ──────────────────────────────────────────────────────────────────────────────
const Scene2System: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const clockProgress = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 18, stiffness: 55 },
  });
  const fastSpin = interpolate(frame, [10, 149], [0, 4], {
    extrapolateRight: "clamp",
  });

  const zoom = interpolate(frame, [0, 300], [1, 1.12], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 50,
        transform: `scale(${zoom})`,
      }}
    >
      <Stars zoom={2} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(255,59,59,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <ClockGraphic progress={clockProgress} fastSpin={fastSpin} />

      <div style={{ textAlign: "center", padding: "0 80px" }}>
        <CineLine
          text="Social media isn't"
          delay={20}
          size={50}
          color={GREY}
          italic
        />
        <CineLine
          text="designed for you."
          delay={35}
          size={50}
          color={GREY}
          italic
        />
        <div style={{ height: 20 }} />
        <CineLine
          text="It's designed"
          delay={65}
          size={64}
          color={WHITE}
          weight={700}
        />
        <CineLine
          text="to keep you."
          delay={80}
          size={64}
          color={RED}
          weight={900}
        />
      </div>
    </AbsoluteFill>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// SCENE 3 — THE LOOP (15–25s, frames 450–749)
// ──────────────────────────────────────────────────────────────────────────────
const Scene3Loop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const loopProgress = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 18, stiffness: 55 },
  });
  const zoom = interpolate(frame, [0, 300], [0.9, 1.1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 60,
        transform: `scale(${zoom})`,
        padding: 60,
      }}
    >
      <Stars />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(255,59,59,0.08) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <DopamineLoop progress={loopProgress} frame={frame} />

      <div style={{ flex: 1, textAlign: "left" }}>
        <CineLine text="The infinite" delay={15} size={46} color={GREY} />
        <CineLine
          text="scroll."
          delay={25}
          size={46}
          color={WHITE}
          weight={700}
        />
        <div style={{ height: 24 }} />
        <CineLine
          text="The algorithm"
          delay={55}
          size={40}
          color={GREY}
          italic
        />
        <CineLine
          text="that knows you"
          delay={68}
          size={40}
          color={GREY}
          italic
        />
        <CineLine text="better than" delay={81} size={40} color={GREY} italic />
        <CineLine
          text="you know yourself."
          delay={94}
          size={40}
          color={RED}
          italic
        />
        <div style={{ height: 24 }} />
        <CineLine text="The dopamine" delay={130} size={38} color={GREY} />
        <CineLine text="loop." delay={145} size={38} color={RED} weight={700} />
      </div>
    </AbsoluteFill>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// SCENE 4 — THE TURN (25–33s, frames 750–989)
// ──────────────────────────────────────────────────────────────────────────────
const Scene4Turn: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Heartbeat pulse
  const heartPulse = Math.sin(frame * 0.2) * 0.5 + 0.5;
  const heartScale = interpolate(heartPulse, [0, 1], [0.95, 1.05]);

  const humanProgress = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 16, stiffness: 50 },
  });
  const zoom = interpolate(frame, [0, 239], [1.1, 0.95], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 44,
        transform: `scale(${zoom})`,
      }}
    >
      <Stars zoom={0.5} />

      {/* Human figure SVG */}
      <div
        style={{
          opacity: humanProgress,
          transform: `scale(${interpolate(humanProgress, [0, 1], [0.5, 1]) * heartScale})`,
        }}
      >
        <svg width="160" height="200" viewBox="0 0 160 200">
          {/* Head */}
          <circle
            cx="80"
            cy="40"
            r="30"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
          />
          {/* Body */}
          <line
            x1="80"
            y1="70"
            x2="80"
            y2="140"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
          />
          {/* Arms */}
          <line
            x1="80"
            y1="90"
            x2="30"
            y2="120"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
          />
          <line
            x1="80"
            y1="90"
            x2="130"
            y2="120"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
          />
          {/* Legs */}
          <line
            x1="80"
            y1="140"
            x2="50"
            y2="190"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
          />
          <line
            x1="80"
            y1="140"
            x2="110"
            y2="190"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
          />
          {/* Heart */}
          <text
            x="68"
            y="115"
            fontSize="24"
            fill={RED}
            style={{ filter: `drop-shadow(0 0 8px ${RED})` }}
          >
            ♥
          </text>
          {/* Pulse ring */}
          <circle
            cx="80"
            cy="107"
            r={interpolate(heartPulse, [0, 1], [20, 40])}
            fill="none"
            stroke={RED}
            strokeWidth="1"
            opacity={interpolate(heartPulse, [0, 1], [0.4, 0])}
          />
        </svg>
      </div>

      <div style={{ textAlign: "center", padding: "0 80px" }}>
        <CineLine
          text="You're not weak"
          delay={20}
          size={54}
          color={WHITE}
          weight={700}
        />
        <CineLine
          text="for getting stuck."
          delay={35}
          size={54}
          color={WHITE}
          weight={700}
        />
        <div style={{ height: 20 }} />
        <CineLine
          text="You're human."
          delay={70}
          size={48}
          color={RED}
          weight={900}
        />
        <div style={{ height: 16 }} />
        <CineLine
          text="And they built billion-dollar"
          delay={100}
          size={34}
          color={GREY}
          italic
        />
        <CineLine
          text="systems to trap humans."
          delay={115}
          size={34}
          color={GREY}
          italic
        />
      </div>
    </AbsoluteFill>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// SCENE 5 — CTA (33–45s, frames 990–1349)
// ──────────────────────────────────────────────────────────────────────────────
const Scene5CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const zoom = interpolate(frame, [0, 360], [0.9, 1.15], {
    extrapolateRight: "clamp",
  });
  const bgPulse = Math.sin(frame * 0.05) * 0.5 + 0.5;

  // Phone being put down animation
  const phoneDown = spring({
    frame: Math.max(0, frame - 80),
    fps,
    config: { damping: 14, stiffness: 50 },
  });
  const phoneRotate = interpolate(phoneDown, [0, 1], [0, 90]);
  const phoneY = interpolate(phoneDown, [0, 1], [0, 80]);
  const phoneOpacity = interpolate(phoneDown, [0, 1], [1, 0.3]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 36,
        transform: `scale(${zoom})`,
      }}
    >
      <Stars zoom={0.3} />

      {/* Radial pulse */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, rgba(255,59,59,${interpolate(bgPulse, [0, 1], [0.03, 0.08])}) 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ textAlign: "center", padding: "0 70px" }}>
        <CineLine
          text="So next time you catch yourself"
          delay={10}
          size={38}
          color={GREY}
          italic
        />
        <CineLine
          text="scrolling at 2am..."
          delay={24}
          size={38}
          color={GREY}
          italic
        />
        <div style={{ height: 32 }} />
        <CineLine
          text="Put the phone down."
          delay={55}
          size={72}
          color={WHITE}
          weight={900}
        />
        <div style={{ height: 20 }} />
        <CineLine
          text="You've seen enough."
          delay={85}
          size={58}
          color={RED}
          weight={700}
        />
      </div>

      {/* Animated phone laying down */}
      <div
        style={{
          opacity: phoneOpacity,
          transform: `rotate(${phoneRotate}deg) translateY(${phoneY}px)`,
        }}
      >
        <svg width="60" height="100" viewBox="0 0 60 100">
          <rect
            x="2"
            y="2"
            width="56"
            height="96"
            rx="10"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
          />
          <rect
            x="20"
            y="8"
            width="20"
            height="4"
            rx="2"
            fill="rgba(255,255,255,0.2)"
          />
          <circle cx="30" cy="88" r="4" fill="rgba(255,255,255,0.2)" />
        </svg>
      </div>

      {/* Final watermark */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          opacity: clamp(interpolate(frame, [120, 160], [0, 1])),
        }}
      >
        <p
          style={{
            fontFamily: "monospace",
            fontSize: 22,
            color: "rgba(255,255,255,0.2)",
            letterSpacing: 8,
            textTransform: "uppercase",
            textAlign: "center",
            margin: 0,
          }}
        >
          reclaim your time
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// ROOT
// ──────────────────────────────────────────────────────────────────────────────
export const DarkSocialAd: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG }}>
      {/* S1: Hook 0–5s */}
      <Sequence from={0} durationInFrames={150}>
        <Scene1Hook />
      </Sequence>

      {/* S2: The System 5–15s */}
      <Sequence from={150} durationInFrames={300}>
        <Scene2System />
      </Sequence>

      {/* S3: The Loop 15–25s */}
      <Sequence from={450} durationInFrames={300}>
        <Scene3Loop />
      </Sequence>

      {/* S4: The Turn 25–33s */}
      <Sequence from={750} durationInFrames={240}>
        <Scene4Turn />
      </Sequence>

      {/* S5: CTA 33–45s */}
      <Sequence from={990} durationInFrames={360}>
        <Scene5CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
