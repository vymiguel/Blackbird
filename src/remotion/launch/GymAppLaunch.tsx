import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const colors = {
  background: "#080908",
  panel: "#131412",
  panelRaised: "#1b1b18",
  border: "#2b2923",
  text: "#f6f1e8",
  muted: "#938b7c",
  gold: "#f2d49a",
  goldDeep: "#d8a24a",
  green: "#76b07a",
  red: "#bd4d3e",
};

type Exercise = {
  name: string;
  detail: string;
  muscle: string;
  done?: boolean;
};

const days = [
  {
    number: 1,
    title: "Push Strength",
    subtitle: "Chest, shoulders, triceps",
    focus: ["Bench", "Overhead", "Dips"],
    accent: colors.gold,
    progress: 0.78,
  },
  {
    number: 2,
    title: "Pull Volume",
    subtitle: "Back, rear delts, biceps",
    focus: ["Rows", "Pulldown", "Curls"],
    accent: "#9ec6ff",
    progress: 0.44,
  },
  {
    number: 3,
    title: "Legs",
    subtitle: "Quads, hamstrings, calves",
    focus: ["Squat", "RDL", "Press"],
    accent: "#76b07a",
    progress: 0.16,
  },
];

const exercises: Exercise[] = [
  { name: "Incline Dumbbell Press", detail: "4 x 8-10", muscle: "Upper chest", done: true },
  { name: "Seated Shoulder Press", detail: "3 x 8-10", muscle: "Delts", done: true },
  { name: "Cable Fly", detail: "3 x 12-15", muscle: "Chest" },
  { name: "Rope Pushdown", detail: "3 x 12", muscle: "Triceps" },
];

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const GymAppLaunch = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneScale = interpolate(frame, [0, 34], [0.86, 1], { ...clamp, easing: ease });
  const phoneX = interpolate(frame, [90, 150], [0, 180], { ...clamp, easing: ease });
  const appStep =
    frame < 250 ? "home" : frame < 470 ? "day" : frame < 650 ? "timer" : frame < 815 ? "weekly" : "finish";

  return (
    <AbsoluteFill style={styles.stage}>
      <GridBackground />
      <AmbientPlates />
      <div style={styles.copyWrap}>
        <Kicker>Launch video</Kicker>
        <Headline frame={frame} />
        <FeatureStack frame={frame} />
      </div>
      <div
        style={{
          ...styles.phoneWrap,
          transform: `translateX(${phoneX}px) scale(${phoneScale})`,
        }}
      >
        <PhoneFrame>
          {appStep === "home" && <HomeScreen frame={frame} />}
          {appStep === "day" && <WorkoutScreen frame={frame - 250} />}
          {appStep === "timer" && <TimerScreen frame={frame - 470} fps={fps} />}
          {appStep === "weekly" && <WeeklyScreen frame={frame - 650} />}
          {appStep === "finish" && <FinishScreen frame={frame - 815} />}
        </PhoneFrame>
      </div>
      <MetricRail frame={frame} />
      <EndCard frame={frame} />
    </AbsoluteFill>
  );
};

const Headline = ({ frame }: { frame: number }) => {
  const lines = [
    { text: "Train with a plan.", start: 10 },
    { text: "Log every set.", start: 74 },
    { text: "Finish the week stronger.", start: 138 },
  ];

  return (
    <div style={styles.headline}>
      {lines.map((line) => {
        const opacity = interpolate(frame, [line.start, line.start + 24], [0, 1], {
          ...clamp,
          easing: ease,
        });
        const y = interpolate(frame, [line.start, line.start + 24], [24, 0], {
          ...clamp,
          easing: ease,
        });
        return (
          <div key={line.text} style={{ opacity, transform: `translateY(${y}px)` }}>
            {line.text}
          </div>
        );
      })}
    </div>
  );
};

const FeatureStack = ({ frame }: { frame: number }) => {
  const items = [
    { label: "4-day muscle-building split", start: 190 },
    { label: "Exercise detail, notes, substitutions", start: 300 },
    { label: "Rest timer and completion tracking", start: 515 },
    { label: "Weekly progress from Friday to Thursday", start: 690 },
  ];

  return (
    <div style={styles.featureStack}>
      {items.map((item) => {
        const active = frame >= item.start;
        const opacity = interpolate(frame, [item.start - 18, item.start + 12], [0.32, 1], clamp);
        return (
          <div key={item.label} style={{ ...styles.featureItem, opacity }}>
            <div style={{ ...styles.featureDot, background: active ? colors.gold : colors.border }} />
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};

const PhoneFrame = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={styles.phone}>
      <div style={styles.speaker} />
      <div style={styles.phoneScreen}>{children}</div>
    </div>
  );
};

const HomeScreen = ({ frame }: { frame: number }) => {
  const progress = interpolate(frame, [80, 150], [0.12, 0.5], clamp);

  return (
    <div style={styles.appScreen}>
      <TopBar title="4-Day Muscle Plan" eyebrow="MiguelGym" icon="chart" />
      <div style={styles.heroPanel}>
        <div>
          <SmallLabel>Current week</SmallLabel>
          <div style={styles.heroMetric}>2/4</div>
          <Muted>May 1 - May 7</Muted>
        </div>
        <div style={styles.goldDisc}>MG</div>
      </div>
      <SectionTitle left="Workout Days" right="Friday - Thursday" />
      {days.map((day, index) => (
        <DayCard
          key={day.title}
          day={day}
          delay={54 + index * 18}
          frame={frame}
          progress={index === 0 ? progress : day.progress}
        />
      ))}
    </div>
  );
};

const WorkoutScreen = ({ frame }: { frame: number }) => {
  const checkScale = spring({ frame: frame - 74, fps: 30, config: { damping: 14, stiffness: 140 } });

  return (
    <div style={styles.appScreen}>
      <TopBar title="Push Strength" eyebrow="Day 1" icon="back" />
      <div style={styles.timerPanel}>
        <div>
          <SmallLabel>Workout progress</SmallLabel>
          <div style={styles.midMetric}>2 of 4 exercises</div>
        </div>
        <ProgressBar progress={interpolate(frame, [30, 110], [0.32, 0.62], clamp)} accent={colors.gold} />
      </div>
      <SectionTitle left="Exercises" right="Tap to log" />
      {exercises.map((exercise, index) => (
        <ExerciseCard
          key={exercise.name}
          exercise={exercise}
          frame={frame}
          delay={index * 18}
          checkedBoost={index === 1 ? checkScale : 1}
        />
      ))}
    </div>
  );
};

const TimerScreen = ({ frame, fps }: { frame: number; fps: number }) => {
  const remaining = Math.max(0, 90 - Math.floor(frame / fps) * 5);
  const timerProgress = interpolate(frame, [0, 168], [1, 0.15], clamp);
  const noteOpacity = interpolate(frame, [75, 110], [0, 1], { ...clamp, easing: ease });

  return (
    <div style={styles.appScreen}>
      <TopBar title="Cable Fly" eyebrow="Exercise details" icon="back" />
      <div style={styles.detailPanel}>
        <SmallLabel>Target muscle</SmallLabel>
        <div style={styles.detailTitle}>Chest isolation</div>
        <Muted>Slow stretch, controlled squeeze, keep shoulders down.</Muted>
      </div>
      <div style={styles.restCard}>
        <div style={styles.timerCircle}>
          <div style={styles.timerValue}>{remaining}s</div>
          <div style={styles.timerTrack}>
            <div style={{ ...styles.timerFill, width: `${timerProgress * 100}%` }} />
          </div>
        </div>
        <div>
          <SmallLabel>Rest timer</SmallLabel>
          <div style={styles.midMetric}>Ready for the next set</div>
        </div>
      </div>
      <div style={{ ...styles.notePanel, opacity: noteOpacity }}>
        <SmallLabel>Personal note</SmallLabel>
        <div style={styles.noteText}>Use 18 kg next week. Last reps were clean.</div>
      </div>
    </div>
  );
};

const WeeklyScreen = ({ frame }: { frame: number }) => {
  const bars = [0.92, 0.62, 0.34, 0.12];

  return (
    <div style={styles.appScreen}>
      <TopBar title="Weekly Progress" eyebrow="May 1 - May 7" icon="back" />
      <div style={styles.heroPanel}>
        <div>
          <SmallLabel>Week complete</SmallLabel>
          <div style={styles.heroMetric}>62%</div>
          <Muted>Two workouts finished. Two to go.</Muted>
        </div>
        <div style={styles.goldDisc}>62</div>
      </div>
      <div style={styles.chartPanel}>
        {bars.map((bar, index) => {
          const height = interpolate(frame, [20 + index * 12, 70 + index * 12], [8, 156 * bar], {
            ...clamp,
            easing: ease,
          });
          return (
            <div key={index} style={styles.barColumn}>
              <div style={{ ...styles.bar, height }} />
              <Muted>D{index + 1}</Muted>
            </div>
          );
        })}
      </div>
      <div style={styles.weekList}>
        <StatusRow label="Push Strength" value="Complete" active />
        <StatusRow label="Pull Volume" value="In progress" active />
        <StatusRow label="Legs" value="Next" />
      </div>
    </div>
  );
};

const FinishScreen = ({ frame }: { frame: number }) => {
  const scale = spring({ frame, fps: 30, config: { damping: 12, stiffness: 110 } });
  return (
    <div style={styles.finishScreen}>
      <div style={{ ...styles.finishBadge, transform: `scale(${scale})` }}>MG</div>
      <div style={styles.finishTitle}>MiguelGym</div>
      <div style={styles.finishText}>Plan. Train. Track. Repeat.</div>
      <div style={styles.storeRow}>
        <div style={styles.storeButton}>App Store</div>
        <div style={styles.storeButton}>Google Play</div>
      </div>
    </div>
  );
};

const DayCard = ({
  day,
  frame,
  delay,
  progress,
}: {
  day: (typeof days)[number];
  frame: number;
  delay: number;
  progress: number;
}) => {
  const opacity = interpolate(frame, [delay, delay + 22], [0, 1], { ...clamp, easing: ease });
  const y = interpolate(frame, [delay, delay + 22], [24, 0], { ...clamp, easing: ease });

  return (
    <div style={{ ...styles.dayCard, opacity, transform: `translateY(${y}px)` }}>
      <div style={styles.dayTop}>
        <div style={{ ...styles.dayNumber, borderColor: day.accent }}>{day.number}</div>
        <div style={styles.dayCopy}>
          <div style={styles.cardTitle}>{day.title}</div>
          <Muted>{day.subtitle}</Muted>
        </div>
        <div style={styles.chevron}>{">"}</div>
      </div>
      <div style={styles.pillRow}>
        {day.focus.map((focus) => (
          <div key={focus} style={styles.focusPill}>
            {focus}
          </div>
        ))}
      </div>
      <ProgressBar progress={progress} accent={day.accent} />
    </div>
  );
};

const ExerciseCard = ({
  exercise,
  frame,
  delay,
  checkedBoost,
}: {
  exercise: Exercise;
  frame: number;
  delay: number;
  checkedBoost: number;
}) => {
  const opacity = interpolate(frame, [delay, delay + 20], [0, 1], clamp);
  const checked = exercise.done || frame > 80 + delay;

  return (
    <div style={{ ...styles.exerciseCard, opacity }}>
      <div
        style={{
          ...styles.check,
          background: checked ? colors.gold : "transparent",
          transform: `scale(${checkedBoost})`,
        }}
      >
        {checked ? "OK" : ""}
      </div>
      <div style={styles.dayCopy}>
        <div style={styles.cardTitle}>{exercise.name}</div>
        <Muted>
          {exercise.detail} - {exercise.muscle}
        </Muted>
      </div>
      <div style={styles.timerChip}>90s</div>
    </div>
  );
};

const ProgressBar = ({ progress, accent }: { progress: number; accent: string }) => {
  return (
    <div style={styles.progressTrack}>
      <div style={{ ...styles.progressFill, width: `${Math.round(progress * 100)}%`, background: accent }} />
    </div>
  );
};

const StatusRow = ({ label, value, active }: { label: string; value: string; active?: boolean }) => (
  <div style={styles.statusRow}>
    <span>{label}</span>
    <span style={{ color: active ? colors.gold : colors.muted }}>{value}</span>
  </div>
);

const MetricRail = ({ frame }: { frame: number }) => {
  const opacity = interpolate(frame, [130, 190, 815, 870], [0, 1, 1, 0], clamp);
  return (
    <div style={{ ...styles.metricRail, opacity }}>
      <Metric label="Exercises" value="32" />
      <Metric label="Rest timers" value="90s" />
      <Metric label="Weekly split" value="4 days" />
    </div>
  );
};

const EndCard = ({ frame }: { frame: number }) => {
  const opacity = interpolate(frame, [820, 890], [0, 1], clamp);
  return (
    <div style={{ ...styles.endCopy, opacity }}>
      <Kicker>Built for consistency</Kicker>
      <div style={styles.endTitle}>A gym app that makes the next set obvious.</div>
    </div>
  );
};

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div style={styles.metricCard}>
    <div style={styles.metricValue}>{value}</div>
    <Muted>{label}</Muted>
  </div>
);

const TopBar = ({ title, eyebrow, icon }: { title: string; eyebrow: string; icon: "chart" | "back" }) => (
  <div style={styles.topbar}>
    <div>
      <SmallLabel>{eyebrow}</SmallLabel>
      <div style={styles.screenTitle}>{title}</div>
    </div>
    <div style={styles.iconButton}>{icon === "chart" ? "Stats" : "<"}</div>
  </div>
);

const SectionTitle = ({ left, right }: { left: string; right: string }) => (
  <div style={styles.sectionTitle}>
    <span>{left}</span>
    <Muted>{right}</Muted>
  </div>
);

const Kicker = ({ children }: { children: React.ReactNode }) => <div style={styles.kicker}>{children}</div>;
const SmallLabel = ({ children }: { children: React.ReactNode }) => <div style={styles.smallLabel}>{children}</div>;
const Muted = ({ children }: { children: React.ReactNode }) => <span style={styles.muted}>{children}</span>;

const GridBackground = () => <div style={styles.gridBackground} />;

const AmbientPlates = () => (
  <>
    <div style={styles.goldWash} />
    <div style={styles.redWash} />
    <div style={styles.floorPlate} />
  </>
);

const styles: Record<string, React.CSSProperties> = {
  stage: {
    background:
      "linear-gradient(145deg, #050505 0%, #10100e 45%, #070707 100%)",
    color: colors.text,
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    overflow: "hidden",
  },
  gridBackground: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(242, 212, 154, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(242, 212, 154, 0.035) 1px, transparent 1px)",
    backgroundSize: "72px 72px",
    maskImage: "linear-gradient(90deg, transparent, black 18%, black 82%, transparent)",
  },
  goldWash: {
    position: "absolute",
    width: 760,
    height: 760,
    left: -220,
    top: -240,
    borderRadius: 760,
    background: "rgba(216, 162, 74, 0.18)",
    filter: "blur(70px)",
  },
  redWash: {
    position: "absolute",
    width: 520,
    height: 520,
    right: -180,
    bottom: -120,
    borderRadius: 520,
    background: "rgba(189, 77, 62, 0.12)",
    filter: "blur(84px)",
  },
  floorPlate: {
    position: "absolute",
    left: 610,
    right: 80,
    bottom: 76,
    height: 48,
    background: "rgba(0, 0, 0, 0.42)",
    borderRadius: "50%",
    filter: "blur(22px)",
  },
  copyWrap: {
    position: "absolute",
    left: 116,
    top: 116,
    width: 670,
  },
  kicker: {
    color: colors.gold,
    textTransform: "uppercase",
    fontSize: 18,
    fontWeight: 900,
    letterSpacing: 3,
    marginBottom: 26,
  },
  headline: {
    fontSize: 82,
    lineHeight: 0.98,
    fontWeight: 950,
    letterSpacing: 0,
  },
  featureStack: {
    display: "grid",
    gap: 18,
    marginTop: 52,
    fontSize: 25,
    color: colors.text,
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  featureDot: {
    width: 14,
    height: 14,
    borderRadius: 14,
  },
  phoneWrap: {
    position: "absolute",
    left: 910,
    top: 64,
    width: 454,
    height: 952,
    transformOrigin: "50% 50%",
  },
  phone: {
    width: 454,
    height: 952,
    padding: 16,
    borderRadius: 54,
    background: "linear-gradient(145deg, rgba(255,255,255,0.16), rgba(255,255,255,0.02))",
    border: "1px solid rgba(242, 212, 154, 0.24)",
    boxShadow: "0 36px 100px rgba(0, 0, 0, 0.56)",
    position: "relative",
  },
  speaker: {
    position: "absolute",
    top: 28,
    left: "50%",
    width: 112,
    height: 8,
    marginLeft: -56,
    borderRadius: 8,
    background: "#090908",
    zIndex: 3,
  },
  phoneScreen: {
    width: "100%",
    height: "100%",
    borderRadius: 42,
    overflow: "hidden",
    background: colors.background,
  },
  appScreen: {
    padding: "56px 22px 28px",
    height: "100%",
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 190px), #080908",
  },
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 22,
  },
  smallLabel: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 1.3,
  },
  screenTitle: {
    marginTop: 3,
    color: colors.text,
    fontSize: 28,
    lineHeight: 1,
    fontWeight: 900,
  },
  iconButton: {
    width: 46,
    height: 46,
    display: "grid",
    placeItems: "center",
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    background: "#11110f",
    color: colors.gold,
    fontSize: 16,
    fontWeight: 900,
  },
  heroPanel: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 22,
    border: "1px solid rgba(242, 212, 154, 0.25)",
    borderRadius: 8,
    background: "linear-gradient(135deg, rgba(216, 162, 74, 0.24), transparent 56%), #191814",
    marginBottom: 24,
  },
  heroMetric: {
    fontSize: 58,
    lineHeight: 0.95,
    fontWeight: 950,
    margin: "8px 0 6px",
  },
  midMetric: {
    color: colors.text,
    fontSize: 23,
    fontWeight: 850,
    marginTop: 5,
  },
  muted: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 1.35,
  },
  goldDisc: {
    width: 78,
    height: 78,
    borderRadius: 78,
    display: "grid",
    placeItems: "center",
    color: "#0d0d0c",
    background: `linear-gradient(145deg, ${colors.gold}, ${colors.goldDeep})`,
    fontSize: 24,
    fontWeight: 950,
  },
  sectionTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    fontSize: 20,
    fontWeight: 900,
    margin: "20px 0 12px",
  },
  dayCard: {
    padding: 16,
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    background: colors.panel,
    marginBottom: 13,
  },
  dayTop: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  dayNumber: {
    width: 40,
    height: 40,
    display: "grid",
    placeItems: "center",
    border: "2px solid",
    borderRadius: 8,
    color: colors.text,
    fontWeight: 900,
  },
  dayCopy: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: 850,
    marginBottom: 4,
  },
  chevron: {
    color: "#7d7568",
    fontSize: 34,
    lineHeight: 1,
  },
  pillRow: {
    display: "flex",
    gap: 8,
    margin: "14px 0 13px",
  },
  focusPill: {
    padding: "7px 10px",
    borderRadius: 8,
    background: "#25231d",
    color: colors.gold,
    fontSize: 12,
    fontWeight: 850,
  },
  progressTrack: {
    width: "100%",
    height: 8,
    borderRadius: 8,
    background: "#2a261f",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 8,
  },
  timerPanel: {
    padding: 18,
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    background: colors.panelRaised,
    display: "grid",
    gap: 18,
  },
  exerciseCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 14,
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    background: colors.panel,
    marginBottom: 12,
  },
  check: {
    width: 32,
    height: 32,
    borderRadius: 8,
    border: `1px solid ${colors.gold}`,
    display: "grid",
    placeItems: "center",
    color: "#0d0d0c",
    fontWeight: 950,
  },
  timerChip: {
    padding: "7px 9px",
    borderRadius: 8,
    background: "#25231d",
    color: colors.gold,
    fontSize: 13,
    fontWeight: 900,
  },
  detailPanel: {
    padding: 20,
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    background: colors.panelRaised,
  },
  detailTitle: {
    color: colors.text,
    fontSize: 34,
    lineHeight: 1.02,
    fontWeight: 950,
    margin: "8px 0 12px",
  },
  restCard: {
    marginTop: 18,
    padding: 20,
    display: "flex",
    alignItems: "center",
    gap: 18,
    border: "1px solid rgba(242, 212, 154, 0.25)",
    borderRadius: 8,
    background: "linear-gradient(135deg, rgba(242, 212, 154, 0.18), transparent), #141310",
  },
  timerCircle: {
    width: 130,
    height: 130,
    borderRadius: 130,
    border: `2px solid ${colors.gold}`,
    display: "grid",
    placeItems: "center",
    padding: 18,
  },
  timerValue: {
    fontSize: 34,
    fontWeight: 950,
    color: colors.text,
  },
  timerTrack: {
    width: 78,
    height: 6,
    background: "#2a261f",
    borderRadius: 8,
    overflow: "hidden",
  },
  timerFill: {
    height: "100%",
    background: colors.gold,
  },
  notePanel: {
    marginTop: 18,
    padding: 18,
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    background: colors.panel,
  },
  noteText: {
    marginTop: 10,
    color: colors.text,
    fontSize: 19,
    lineHeight: 1.25,
    fontWeight: 700,
  },
  chartPanel: {
    height: 238,
    display: "flex",
    alignItems: "end",
    justifyContent: "space-around",
    padding: "24px 16px 16px",
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    background: colors.panel,
  },
  barColumn: {
    height: "100%",
    width: 64,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
  },
  bar: {
    width: 38,
    borderRadius: 8,
    background: `linear-gradient(180deg, ${colors.gold}, ${colors.goldDeep})`,
  },
  weekList: {
    marginTop: 18,
    display: "grid",
    gap: 10,
  },
  statusRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 8,
    border: `1px solid ${colors.border}`,
    background: colors.panel,
    fontSize: 16,
    fontWeight: 800,
  },
  metricRail: {
    position: "absolute",
    right: 104,
    top: 148,
    width: 270,
    display: "grid",
    gap: 16,
  },
  metricCard: {
    padding: 20,
    borderRadius: 8,
    border: "1px solid rgba(242, 212, 154, 0.18)",
    background: "rgba(19, 20, 18, 0.82)",
  },
  metricValue: {
    color: colors.text,
    fontSize: 42,
    fontWeight: 950,
    lineHeight: 1,
    marginBottom: 8,
  },
  endCopy: {
    position: "absolute",
    left: 116,
    bottom: 112,
    width: 710,
  },
  endTitle: {
    fontSize: 54,
    lineHeight: 1.03,
    fontWeight: 950,
  },
  finishScreen: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 36,
    textAlign: "center",
    background: "linear-gradient(180deg, #15140f, #080908)",
  },
  finishBadge: {
    width: 142,
    height: 142,
    borderRadius: 142,
    display: "grid",
    placeItems: "center",
    color: "#0d0d0c",
    background: `linear-gradient(145deg, ${colors.gold}, ${colors.goldDeep})`,
    fontSize: 46,
    fontWeight: 950,
    marginBottom: 28,
  },
  finishTitle: {
    fontSize: 56,
    lineHeight: 1,
    fontWeight: 950,
  },
  finishText: {
    marginTop: 12,
    color: colors.muted,
    fontSize: 22,
    fontWeight: 700,
  },
  storeRow: {
    display: "flex",
    gap: 12,
    marginTop: 32,
  },
  storeButton: {
    padding: "13px 18px",
    borderRadius: 8,
    background: colors.gold,
    color: "#0d0d0c",
    fontSize: 15,
    fontWeight: 950,
  },
};
