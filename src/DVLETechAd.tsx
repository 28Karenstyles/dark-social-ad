import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const BG = "#05010f";
const PURPLE = "#7c3aed";
const PURPLE_LIGHT = "#a855f7";
const PURPLE_GLOW = "rgba(124,58,237,0.35)";
const WHITE = "#ffffff";

// ── Grid Background ───────────────────────────────────────────────────────────
const Grid: React.FC<{ opacity: number }> = ({ opacity }) => (
  <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
    <svg width="1080" height="1920" viewBox="0 0 1080 1920">
      <defs>
        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(124,58,237,0.15)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="1080" height="1920" fill="url(#grid)" />
      {/* Center glow lines */}
      <line x1="540" y1="0" x2="540" y2="1920" stroke="rgba(124,58,237,0.08)" strokeWidth="2" />
      <line x1="0" y1="960" x2="1080" y2="960" stroke="rgba(124,58,237,0.08)" strokeWidth="2" />
    </svg>
  </AbsoluteFill>
);

// ── Ambient orbs ─────────────────────────────────────────────────────────────
const Orbs: React.FC = () => {
  const frame = useCurrentFrame();
  const float1 = Math.sin(frame * 0.02) * 20;
  const float2 = Math.cos(frame * 0.015) * 15;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 200 + float1, left: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: 300 + float2, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)" }} />
    </AbsoluteFill>
  );
};

// ── Typing text effect ────────────────────────────────────────────────────────
const TypingText: React.FC<{ text: string; startFrame: number; speed?: number; style?: React.CSSProperties }> = ({ text, startFrame, speed = 2, style }) => {
  const frame = useCurrentFrame();
  const charsToShow = Math.floor(Math.max(0, frame - startFrame) / speed);
  const displayed = text.slice(0, charsToShow);
  const showCursor = charsToShow < text.length || (Math.floor(frame * 0.05) % 2 === 0);
  return (
    <span style={style}>
      {displayed}
      {showCursor && <span style={{ opacity: 0.7, color: PURPLE_LIGHT }}>|</span>}
    </span>
  );
};

// ── Glowing badge ─────────────────────────────────────────────────────────────
const Badge: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 18, stiffness: 80 } });
  return (
    <div style={{
      opacity: progress,
      transform: `translateY(${interpolate(progress, [0, 1], [20, 0])}px) scale(${interpolate(progress, [0, 1], [0.8, 1])})`,
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      background: "rgba(124,58,237,0.15)",
      border: "1px solid rgba(124,58,237,0.5)",
      borderRadius: 100,
      padding: "12px 32px",
    }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: PURPLE_LIGHT, boxShadow: `0 0 8px ${PURPLE_LIGHT}` }} />
      <span style={{ fontFamily: "monospace", fontSize: 28, color: PURPLE_LIGHT, letterSpacing: 3 }}>{text}</span>
    </div>
  );
};

// ── HOOK SCENE (0–5s) ─────────────────────────────────────────────────────────
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const gridIn = spring({ frame, fps, config: { damping: 30, stiffness: 40 } });
  const badgeIn = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 16, stiffness: 70 } });
  const headIn = spring({ frame: Math.max(0, frame - 25), fps, config: { damping: 14, stiffness: 60 } });
  const subIn = spring({ frame: Math.max(0, frame - 50), fps, config: { damping: 16, stiffness: 55 } });

  // Scanning line effect
  const scanY = interpolate(frame, [0, 150], [-100, 2000]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 40, padding: 70 }}>
      <Grid opacity={gridIn} />
      <Orbs />

      {/* Scanning line */}
      <div style={{ position: "absolute", left: 0, top: scanY, width: "100%", height: 2, background: `linear-gradient(90deg, transparent, ${PURPLE_LIGHT}, transparent)`, opacity: 0.4 }} />

      {/* Live badge */}
      <Badge text="DVLE TECH" delay={10} />

      {/* Main headline */}
      <div style={{ opacity: headIn, transform: `translateY(${interpolate(headIn, [0, 1], [60, 0])}px)`, textAlign: "center" }}>
        <p style={{ fontFamily: "'Courier New', monospace", fontSize: 26, color: "rgba(255,255,255,0.4)", letterSpacing: 6, textTransform: "uppercase", margin: 0, marginBottom: 24 }}>
          Time to acquire a
        </p>
        <div style={{ position: "relative" }}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: 104, fontWeight: 900, color: WHITE, lineHeight: 0.95, margin: 0, letterSpacing: -2 }}>
            Tech
          </p>
          <p style={{ fontFamily: "Georgia, serif", fontSize: 104, fontWeight: 900, lineHeight: 0.95, margin: 0, letterSpacing: -2, background: `linear-gradient(135deg, ${PURPLE_LIGHT}, #c084fc)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Skill.
          </p>
          {/* Glow behind text */}
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center, ${PURPLE_GLOW} 0%, transparent 70%)`, zIndex: -1 }} />
        </div>
      </div>

      {/* Tagline with typing effect */}
      <div style={{ opacity: subIn }}>
        <TypingText
          text="...learn with ease"
          startFrame={55}
          speed={3}
          style={{ fontFamily: "'Courier New', monospace", fontSize: 34, color: "rgba(255,255,255,0.45)", letterSpacing: 4 }}
        />
      </div>

      {/* Bottom stat pills */}
      <div style={{ display: "flex", gap: 20, opacity: interpolate(frame, [80, 110], [0, 1], { extrapolateRight: "clamp" }) }}>
        {["5 Courses", "Beginner Friendly", "Certificates"].map((s, i) => (
          <div key={s} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, padding: "10px 24px" }}>
            <span style={{ fontFamily: "monospace", fontSize: 22, color: "rgba(255,255,255,0.6)" }}>{s}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ── Course Card ───────────────────────────────────────────────────────────────
const CourseCard: React.FC<{ number: string; title: string; sub: string; delay: number }> = ({ number, title, sub, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 18, stiffness: 75 } });
  const glowPulse = Math.sin((frame + delay) * 0.1) * 0.5 + 0.5;

  return (
    <div style={{
      opacity: progress,
      transform: `translateX(${interpolate(progress, [0, 1], [-400, 0])}px)`,
      display: "flex",
      alignItems: "center",
      gap: 28,
      background: "rgba(255,255,255,0.03)",
      border: `1px solid rgba(124,58,237,${interpolate(glowPulse, [0, 1], [0.2, 0.45])})`,
      borderRadius: 24,
      padding: "28px 40px",
      width: 860,
      boxShadow: `0 0 ${interpolate(glowPulse, [0, 1], [10, 25])}px rgba(124,58,237,0.1)`,
      backdropFilter: "blur(10px)",
    }}>
      {/* Number */}
      <div style={{ width: 64, height: 64, borderRadius: 16, background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE_LIGHT})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ fontFamily: "monospace", fontSize: 28, fontWeight: 900, color: WHITE }}>{number}</span>
      </div>
      {/* Text */}
      <div>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 40, fontWeight: 700, color: WHITE, margin: 0, lineHeight: 1.1 }}>{title}</p>
        <p style={{ fontFamily: "monospace", fontSize: 24, color: "rgba(255,255,255,0.4)", margin: 0, marginTop: 4 }}>{sub}</p>
      </div>
      {/* Arrow */}
      <div style={{ marginLeft: "auto" }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(124,58,237,0.6)" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

// ── COURSES SCENE (5–20s) ────────────────────────────────────────────────────
const CoursesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headerIn = spring({ frame, fps, config: { damping: 16, stiffness: 65 } });

  const courses = [
    { number: "01", title: "Frontend Development", sub: "HTML · CSS · JavaScript · React", delay: 12 },
    { number: "02", title: "Backend Development", sub: "Node.js · APIs · Databases", delay: 40 },
    { number: "03", title: "Mobile App Dev", sub: "React Native · Flutter", delay: 68 },
    { number: "04", title: "Blockchain & Web3", sub: "Smart Contracts · DApps", delay: 96 },
    { number: "05", title: "Cyber Security", sub: "Ethical Hacking · Network Security", delay: 124 },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 24, padding: 60 }}>
      <Grid opacity={0.5} />
      <Orbs />

      <div style={{ opacity: headerIn, transform: `translateY(${interpolate(headerIn, [0, 1], [-30, 0])}px)`, textAlign: "center", marginBottom: 10 }}>
        <p style={{ fontFamily: "monospace", fontSize: 22, color: PURPLE_LIGHT, letterSpacing: 8, textTransform: "uppercase", margin: 0 }}>
          // our_courses
        </p>
      </div>

      {courses.map((c) => (
        <CourseCard key={c.number} {...c} />
      ))}
    </AbsoluteFill>
  );
};

// ── CTA SCENE (20–30s) ───────────────────────────────────────────────────────
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgIn = spring({ frame, fps, config: { damping: 20, stiffness: 40 } });
  const textIn = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 14, stiffness: 70 } });
  const contactIn = spring({ frame: Math.max(0, frame - 40), fps, config: { damping: 16, stiffness: 65 } });
  const btnIn = spring({ frame: Math.max(0, frame - 60), fps, config: { damping: 14, stiffness: 75 } });

  const pulse = Math.sin(frame * 0.12) * 0.5 + 0.5;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 48 }}>
      <Grid opacity={bgIn * 0.6} />
      <Orbs />

      {/* Radial glow */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center, rgba(124,58,237,${interpolate(bgIn, [0, 1], [0, 0.25])}) 0%, transparent 65%)` }} />

      {/* Badge */}
      <div style={{ opacity: textIn, transform: `scale(${interpolate(textIn, [0, 1], [0.8, 1])})` }}>
        <Badge text="ENROLL NOW" delay={0} />
      </div>

      {/* Headline */}
      <div style={{ opacity: textIn, transform: `translateY(${interpolate(textIn, [0, 1], [50, 0])}px)`, textAlign: "center" }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 96, fontWeight: 900, color: WHITE, margin: 0, lineHeight: 1, textShadow: `0 0 80px rgba(124,58,237,0.6)` }}>
          Start Your
        </p>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 96, fontWeight: 900, margin: 0, lineHeight: 1, background: `linear-gradient(135deg, ${PURPLE_LIGHT}, #c084fc, ${WHITE})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Journey.
        </p>
      </div>

      {/* Contact info */}
      <div style={{ opacity: contactIn, transform: `translateY(${interpolate(contactIn, [0, 1], [30, 0])}px)`, textAlign: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "28px 60px" }}>
        <p style={{ fontFamily: "monospace", fontSize: 30, color: "rgba(255,255,255,0.7)", margin: 0, letterSpacing: 2 }}>07046852721 · 08079952574</p>
        <p style={{ fontFamily: "monospace", fontSize: 24, color: "rgba(255,255,255,0.35)", margin: 0, marginTop: 8, letterSpacing: 3 }}>Olisa · Tekgai</p>
      </div>

      {/* CTA Button */}
      <div style={{
        opacity: btnIn,
        transform: `translateY(${interpolate(btnIn, [0, 1], [40, 0])}px)`,
        background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE_LIGHT})`,
        borderRadius: 100,
        padding: "32px 90px",
        boxShadow: `0 0 ${interpolate(pulse, [0, 1], [20, 50])}px rgba(124,58,237,0.7), 0 0 ${interpolate(pulse, [0, 1], [40, 80])}px rgba(124,58,237,0.3)`,
      }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: 46, fontWeight: 900, color: WHITE, letterSpacing: 3, textTransform: "uppercase" }}>
          dvletech.com
        </span>
      </div>

      {/* Bottom watermark */}
      <p style={{ position: "absolute", bottom: 70, fontFamily: "monospace", fontSize: 20, color: "rgba(255,255,255,0.2)", letterSpacing: 6, opacity: btnIn }}>
        DVLE TECH · LEARN WITH EASE
      </p>
    </AbsoluteFill>
  );
};

// ── ROOT ──────────────────────────────────────────────────────────────────────
export const DVLETechAd: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Sequence from={0} durationInFrames={150}>
        <HookScene />
      </Sequence>
      <Sequence from={150} durationInFrames={450}>
        <CoursesScene />
      </Sequence>
      <Sequence from={600} durationInFrames={300}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
