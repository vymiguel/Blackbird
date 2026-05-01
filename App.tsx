import { Ionicons } from "@expo/vector-icons";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Linking,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { api } from "./convex/_generated/api";
import type { Id } from "./convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL ?? "";
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

type Screen =
  | { name: "home" }
  | { name: "day"; workoutDayId: Id<"workoutDays"> }
  | { name: "weekly" };

function getFridayWeekStart(date = new Date()) {
  const midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = midnight.getDay();
  const daysSinceFriday = (day - 5 + 7) % 7;
  midnight.setDate(midnight.getDate() - daysSinceFriday);
  return formatDateKey(midnight);
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatWeekRange(start: string, end?: string) {
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = end ? new Date(`${end}T00:00:00`) : new Date(startDate);
  if (!end) endDate.setDate(endDate.getDate() + 6);
  return `${startDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
}

function secondsToClock(seconds: number) {
  const mins = Math.floor(seconds / 60).toString();
  const secs = Math.max(0, seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

export default function App() {
  if (!convex) {
    return <SetupScreen />;
  }

  return (
    <ConvexProvider client={convex}>
      <WorkoutApp />
    </ConvexProvider>
  );
}

function SetupScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.setupScreen}>
        <View style={styles.goldDisc}>
          <Ionicons name="barbell" size={32} color="#0d0d0c" />
        </View>
        <Text style={styles.title}>MiguelGym</Text>
        <Text style={styles.mutedText}>
          Add EXPO_PUBLIC_CONVEX_URL to .env.local, then run Convex and Expo to load your workout plan.
        </Text>
      </View>
    </SafeAreaView>
  );
}

function WorkoutApp() {
  const [screen, setScreen] = useState<Screen>({ name: "home" });
  const weekStart = useMemo(() => getFridayWeekStart(), []);
  const seedPlan = useMutation(api.workouts.seedPlan);

  useEffect(() => {
    if (!convexUrl) return;
    seedPlan().catch(() => undefined);
  }, [seedPlan]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.appShell}>
        {screen.name === "home" && <HomeScreen weekStart={weekStart} onOpenDay={(workoutDayId) => setScreen({ name: "day", workoutDayId })} onOpenWeekly={() => setScreen({ name: "weekly" })} />}
        {screen.name === "day" && <WorkoutDayScreen weekStart={weekStart} workoutDayId={screen.workoutDayId} onBack={() => setScreen({ name: "home" })} />}
        {screen.name === "weekly" && <WeeklyProgressScreen weekStart={weekStart} onBack={() => setScreen({ name: "home" })} />}
      </View>
    </SafeAreaView>
  );
}

function HomeScreen({
  weekStart,
  onOpenDay,
  onOpenWeekly,
}: {
  weekStart: string;
  onOpenDay: (id: Id<"workoutDays">) => void;
  onOpenWeekly: () => void;
}) {
  const days = useQuery(api.workouts.getWorkoutDays, { weekStart });
  const weekly = useQuery(api.workouts.getWeeklyProgress, { weekStart });

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>MiguelGym</Text>
          <Text style={styles.title}>4-Day Muscle Plan</Text>
        </View>
        <Pressable style={styles.iconButton} onPress={onOpenWeekly}>
          <Ionicons name="stats-chart" size={22} color="#f2d49a" />
        </Pressable>
      </View>

      <View style={styles.heroPanel}>
        <View>
          <Text style={styles.panelLabel}>Current week</Text>
          <Text style={styles.heroMetric}>{weekly ? `${weekly.completedWorkoutDays}/${weekly.totalWorkoutDays}` : "--"}</Text>
          <Text style={styles.mutedText}>{formatWeekRange(weekStart)}</Text>
        </View>
        <View style={styles.goldDisc}>
          <Ionicons name="barbell" size={32} color="#0d0d0c" />
        </View>
      </View>

      <View style={styles.sectionHeadingRow}>
        <Text style={styles.sectionTitle}>Workout Days</Text>
        <Text style={styles.sectionMeta}>Friday - Thursday</Text>
      </View>

      {!days && <Skeleton text="Loading plan..." />}
      {days?.map((day) => (
        <Pressable key={day._id} style={styles.dayCard} onPress={() => onOpenDay(day._id)}>
          <View style={styles.dayCardTop}>
            <View style={[styles.dayNumber, { borderColor: day.accent }]}>
              <Text style={styles.dayNumberText}>{day.dayNumber}</Text>
            </View>
            <View style={styles.dayTextBlock}>
              <Text style={styles.dayTitle}>{day.title}</Text>
              <Text style={styles.mutedText}>{day.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={21} color="#7d7568" />
          </View>
          <View style={styles.focusRow}>
            {day.focus.map((focus) => (
              <View key={focus} style={styles.focusPill}>
                <Text style={styles.focusText}>{focus}</Text>
              </View>
            ))}
          </View>
          <ProgressBar progress={day.progress} accent={day.accent} />
          <Text style={styles.progressText}>{day.completedCount} of {day.exerciseCount} exercises complete</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

function WorkoutDayScreen({
  weekStart,
  workoutDayId,
  onBack,
}: {
  weekStart: string;
  workoutDayId: Id<"workoutDays">;
  onBack: () => void;
}) {
  const day = useQuery(api.workouts.getWorkoutDay, { workoutDayId, weekStart });
  const toggleExercise = useMutation(api.workouts.toggleExerciseCompletion);
  const finishWorkout = useMutation(api.workouts.finishWorkoutSession);
  const logSet = useMutation(api.workouts.logSet);
  const saveExerciseNote = useMutation(api.workouts.saveExerciseNote);
  const updateExerciseDetails = useMutation(api.workouts.updateExerciseDetails);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerTotal, setTimerTotal] = useState(0);
  const [running, setRunning] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [editTargetMuscle, setEditTargetMuscle] = useState("");
  const [editEquipment, setEditEquipment] = useState("");
  const [editRestSeconds, setEditRestSeconds] = useState("");
  const [editSubstitutes, setEditSubstitutes] = useState("");
  const [editVideoUrl, setEditVideoUrl] = useState("");
  const [personalNote, setPersonalNote] = useState("");
  const [showFinish, setShowFinish] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }
    intervalRef.current = setInterval(() => {
      setTimerSeconds((value) => {
        if (value <= 1) {
          setRunning(false);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const completedCount = day?.exercises.filter((exercise) => exercise.completed).length ?? 0;
  const progress = day && day.exercises.length > 0 ? completedCount / day.exercises.length : 0;
  const timerProgress = timerTotal > 0 ? 1 - timerSeconds / timerTotal : 0;

  function openExercise(exercise: any) {
    setSelectedExercise(exercise);
    setEditNotes(exercise.notes);
    setEditTargetMuscle(exercise.targetMuscle ?? "");
    setEditEquipment(exercise.equipment ?? "");
    setEditRestSeconds(String(exercise.restSeconds));
    setEditSubstitutes((exercise.substitutes ?? []).join(", "));
    setEditVideoUrl(exercise.videoUrl ?? `https://www.youtube.com/results?search_query=${encodeURIComponent(`${exercise.name} exercise proper form`)}`);
    setPersonalNote(exercise.personalNote ?? "");
  }

  async function saveExerciseDetails() {
    if (!selectedExercise) return;
    await updateExerciseDetails({
      exerciseId: selectedExercise._id,
      notes: editNotes,
      targetMuscle: editTargetMuscle,
      equipment: editEquipment,
      restSeconds: Number(editRestSeconds) || selectedExercise.restSeconds,
      substitutes: editSubstitutes.split(",").map((item) => item.trim()).filter(Boolean),
      videoUrl: editVideoUrl,
    });
    await saveExerciseNote({ exerciseId: selectedExercise._id, note: personalNote });
    setSelectedExercise(null);
  }

  async function completeExercise(exercise: any) {
    await toggleExercise({ exerciseId: exercise._id, weekStart });
    if (!exercise.completed) {
      await logSet({
        workoutDayId,
        exerciseId: exercise._id,
        weekStart,
        setNumber: 1,
        reps: Number.parseInt(exercise.reps, 10) || 0,
        weight: 0,
        notes: "Logged from exercise completion",
      });
    }
  }

  async function finishCurrentWorkout() {
    await finishWorkout({ workoutDayId, weekStart });
    setRunning(false);
    setShowFinish(true);
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <TopBar title={day?.title ?? "Workout"} onBack={onBack} />
      {!day && <Skeleton text="Loading workout..." />}
      {day && (
        <>
          <View style={styles.detailHeader}>
            <Text style={styles.eyebrow}>Day {day.dayNumber}</Text>
            <Text style={styles.title}>{day.title}</Text>
            <Text style={styles.mutedText}>{day.subtitle}</Text>
            <ProgressBar progress={progress} accent={day.accent} />
            <Text style={styles.progressText}>{completedCount} of {day.exercises.length} complete</Text>
          </View>

          <View style={styles.timerPanel}>
            <View>
              <Text style={styles.panelLabel}>{running ? "Rest active" : "Rest Timer"}</Text>
              <Text style={styles.timerText}>{secondsToClock(timerSeconds)}</Text>
              <ProgressBar progress={timerProgress} accent="#f2d49a" />
            </View>
            <View style={styles.timerActions}>
              <Pressable style={[styles.timerButton, running && styles.timerButtonActive]} onPress={() => setRunning((value) => !value)}>
                <Ionicons name={running ? "pause" : "play"} size={19} color="#0d0d0c" />
              </Pressable>
              <Pressable style={styles.secondaryTimerButton} onPress={() => { setRunning(false); setTimerSeconds(timerTotal); }}>
                <Ionicons name="refresh" size={19} color="#f2d49a" />
              </Pressable>
            </View>
          </View>

          {day.exercises.map((exercise) => (
            <View key={exercise._id} style={styles.exerciseCard}>
              <View style={styles.exerciseTop}>
                <Pressable
                  style={[styles.checkCircle, exercise.completed && styles.checkCircleDone]}
                  onPress={() => completeExercise(exercise)}
                >
                  {exercise.completed && <Ionicons name="checkmark" size={18} color="#0d0d0c" />}
                </Pressable>
                <View style={styles.exerciseTitleBlock}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseMeta}>{exercise.sets} sets | {exercise.reps} reps | {secondsToClock(exercise.restSeconds)} rest</Text>
                  <Text style={styles.exerciseSubMeta}>{exercise.targetMuscle} | {exercise.equipment}</Text>
                </View>
              </View>
              <Text style={styles.notes}>{exercise.notes}</Text>
              {exercise.personalNote ? <Text style={styles.personalNote}>My note: {exercise.personalNote}</Text> : null}
              <Pressable
                style={styles.restShortcut}
                onPress={() => {
                  setTimerSeconds(exercise.restSeconds);
                  setTimerTotal(exercise.restSeconds);
                  setRunning(true);
                }}
              >
                <Ionicons name="timer-outline" size={17} color="#f2d49a" />
                <Text style={styles.restShortcutText}>Start {secondsToClock(exercise.restSeconds)} rest</Text>
              </Pressable>
              <Pressable style={styles.detailButton} onPress={() => openExercise(exercise)}>
                <Ionicons name="create-outline" size={17} color="#f2d49a" />
                <Text style={styles.restShortcutText}>Details and edit</Text>
              </Pressable>
            </View>
          ))}

          {progress === 1 && (
            <Pressable style={styles.finishButton} onPress={finishCurrentWorkout}>
              <Ionicons name="trophy" size={18} color="#0d0d0c" />
              <Text style={styles.finishButtonText}>Finish workout</Text>
            </Pressable>
          )}
        </>
      )}

      <Modal visible={!!selectedExercise} transparent animationType="fade" onRequestClose={() => setSelectedExercise(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalPanel}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.panelLabel}>Exercise detail</Text>
                <Text style={styles.modalTitle}>{selectedExercise?.name}</Text>
              </View>
              <Pressable style={styles.iconButton} onPress={() => setSelectedExercise(null)}>
                <Ionicons name="close" size={21} color="#f2d49a" />
              </Pressable>
            </View>
            <Text style={styles.inputLabel}>Technique notes</Text>
            <TextInput style={[styles.input, styles.textArea]} multiline value={editNotes} onChangeText={setEditNotes} />
            <Text style={styles.inputLabel}>Personal note</Text>
            <TextInput style={[styles.input, styles.textAreaSmall]} multiline value={personalNote} onChangeText={setPersonalNote} placeholder="How did this feel today?" placeholderTextColor="#6e675d" />
            <View style={styles.inputRow}>
              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>Target</Text>
                <TextInput style={styles.input} value={editTargetMuscle} onChangeText={setEditTargetMuscle} />
              </View>
              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>Equipment</Text>
                <TextInput style={styles.input} value={editEquipment} onChangeText={setEditEquipment} />
              </View>
            </View>
            <Text style={styles.inputLabel}>Rest seconds</Text>
            <TextInput style={styles.input} keyboardType="number-pad" value={editRestSeconds} onChangeText={setEditRestSeconds} />
            <Text style={styles.inputLabel}>Substitutes</Text>
            <TextInput style={styles.input} value={editSubstitutes} onChangeText={setEditSubstitutes} />
            <Text style={styles.inputLabel}>Form video link</Text>
            <TextInput style={styles.input} value={editVideoUrl} onChangeText={setEditVideoUrl} autoCapitalize="none" />
            <Pressable style={styles.watchButton} onPress={() => editVideoUrl && Linking.openURL(editVideoUrl)}>
              <Ionicons name="play-circle" size={18} color="#f2d49a" />
              <Text style={styles.restShortcutText}>Watch form video</Text>
            </Pressable>
            <Pressable style={styles.finishButton} onPress={saveExerciseDetails}>
              <Ionicons name="save" size={18} color="#0d0d0c" />
              <Text style={styles.finishButtonText}>Save detail</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={showFinish} transparent animationType="fade" onRequestClose={() => setShowFinish(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.finishPanel}>
            <View style={styles.goldDisc}>
              <Ionicons name="trophy" size={34} color="#0d0d0c" />
            </View>
            <Text style={styles.title}>Workout logged</Text>
            <Text style={styles.mutedText}>{completedCount} exercises are stored for this week.</Text>
            <Pressable style={styles.finishButton} onPress={() => setShowFinish(false)}>
              <Text style={styles.finishButtonText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function WeeklyProgressScreen({ weekStart, onBack }: { weekStart: string; onBack: () => void }) {
  const weekly = useQuery(api.workouts.getWeeklyProgress, { weekStart });
  const days = useQuery(api.workouts.getWorkoutDays, { weekStart });

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <TopBar title="Weekly Progress" onBack={onBack} />
      {!weekly && <Skeleton text="Loading progress..." />}
      {weekly && (
        <>
          <View style={styles.weekPanel}>
            <Text style={styles.panelLabel}>Current week</Text>
            <Text style={styles.title}>{formatWeekRange(weekly.weekStart, weekly.weekEnd)}</Text>
            <View style={styles.metricGrid}>
              <Metric label="Days done" value={`${weekly.completedWorkoutDays}/${weekly.totalWorkoutDays}`} />
              <Metric label="Exercises" value={`${weekly.totalExercisesCompleted}`} />
              <Metric label="Sets logged" value={`${weekly.totalSetsLogged ?? 0}`} />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Week Checklist</Text>
          {days?.map((day) => (
            <View key={day._id} style={styles.weekDayRow}>
              <View style={[styles.dayNumberSmall, { borderColor: day.accent }]}>
                <Text style={styles.dayNumberSmallText}>{day.dayNumber}</Text>
              </View>
              <View style={styles.weekDayText}>
                <Text style={styles.dayTitle}>{day.title}</Text>
                <Text style={styles.mutedText}>{day.completedCount} of {day.exerciseCount} exercises</Text>
              </View>
              <Ionicons
                name={day.completedCount === day.exerciseCount && day.exerciseCount > 0 ? "checkmark-circle" : "ellipse-outline"}
                size={24}
                color={day.completedCount === day.exerciseCount && day.exerciseCount > 0 ? "#f2d49a" : "#625b50"}
              />
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

function TopBar({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={styles.topBar}>
      <Pressable style={styles.iconButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={22} color="#f2d49a" />
      </Pressable>
      <Text style={styles.topBarTitle} numberOfLines={1}>{title}</Text>
      <View style={styles.iconButtonGhost} />
    </View>
  );
}

function ProgressBar({ progress, accent }: { progress: number; accent: string }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%`, backgroundColor: accent }]} />
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricBox}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.mutedText}>{label}</Text>
    </View>
  );
}

function Skeleton({ text }: { text: string }) {
  return (
    <View style={styles.skeleton}>
      <Text style={styles.mutedText}>{text}</Text>
    </View>
  );
}

const colors = {
  background: "#080908",
  panel: "#131412",
  panelRaised: "#1b1b18",
  border: "#2b2923",
  text: "#f6f1e8",
  muted: "#938b7c",
  gold: "#f2d49a",
  goldDeep: "#d8a24a",
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  appShell: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 18,
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  eyebrow: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 0,
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: colors.panelRaised,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  iconButtonGhost: {
    height: 44,
    width: 44,
  },
  heroPanel: {
    alignItems: "center",
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  panelLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  heroMetric: {
    color: colors.text,
    fontSize: 48,
    fontWeight: "900",
    letterSpacing: 0,
  },
  goldDisc: {
    alignItems: "center",
    backgroundColor: colors.gold,
    borderRadius: 999,
    height: 74,
    justifyContent: "center",
    width: 74,
  },
  mutedText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionHeadingRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
  },
  sectionMeta: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
  },
  dayCard: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 14,
    padding: 16,
  },
  dayCardTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  dayNumber: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  dayNumberText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
  },
  dayTextBlock: {
    flex: 1,
    gap: 2,
  },
  dayTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  focusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  focusPill: {
    backgroundColor: colors.panelRaised,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  focusText: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "800",
  },
  progressTrack: {
    backgroundColor: "#2a261f",
    borderRadius: 999,
    height: 8,
    overflow: "hidden",
  },
  progressFill: {
    borderRadius: 999,
    height: "100%",
  },
  progressText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  topBarTitle: {
    color: colors.text,
    flex: 1,
    fontSize: 17,
    fontWeight: "800",
    marginHorizontal: 12,
    textAlign: "center",
  },
  detailHeader: {
    gap: 10,
  },
  timerPanel: {
    alignItems: "center",
    backgroundColor: colors.panelRaised,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  timerText: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 0,
  },
  timerActions: {
    flexDirection: "row",
    gap: 10,
  },
  timerButton: {
    alignItems: "center",
    backgroundColor: colors.gold,
    borderRadius: 8,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  timerButtonActive: {
    backgroundColor: "#f2d49a",
    shadowColor: colors.gold,
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  secondaryTimerButton: {
    alignItems: "center",
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  exerciseCard: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  exerciseTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  checkCircle: {
    alignItems: "center",
    borderColor: "#605743",
    borderRadius: 999,
    borderWidth: 1,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  checkCircleDone: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  exerciseTitleBlock: {
    flex: 1,
    gap: 4,
  },
  exerciseName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
  },
  exerciseMeta: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: "700",
  },
  exerciseSubMeta: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
  },
  notes: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  personalNote: {
    backgroundColor: colors.panelRaised,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    fontSize: 13,
    lineHeight: 19,
    padding: 10,
  },
  restShortcut: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  detailButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.panelRaised,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  watchButton: {
    alignItems: "center",
    backgroundColor: colors.panelRaised,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 44,
  },
  restShortcutText: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: "800",
  },
  finishButton: {
    alignItems: "center",
    backgroundColor: colors.gold,
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 16,
  },
  finishButtonText: {
    color: "#0d0d0c",
    fontSize: 15,
    fontWeight: "900",
  },
  modalBackdrop: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.72)",
    flex: 1,
    justifyContent: "center",
    padding: 18,
  },
  modalPanel: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    maxWidth: 420,
    padding: 16,
    width: "100%",
  },
  modalHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
  },
  inputLabel: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: colors.panelRaised,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    minHeight: 42,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textArea: {
    minHeight: 88,
    textAlignVertical: "top",
  },
  textAreaSmall: {
    minHeight: 66,
    textAlignVertical: "top",
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
  },
  inputHalf: {
    flex: 1,
    gap: 6,
  },
  finishPanel: {
    alignItems: "center",
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 14,
    padding: 22,
    width: "100%",
  },
  weekPanel: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 16,
    padding: 18,
  },
  metricGrid: {
    flexDirection: "row",
    gap: 12,
  },
  metricBox: {
    backgroundColor: colors.panelRaised,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    padding: 14,
  },
  metricValue: {
    color: colors.gold,
    fontSize: 28,
    fontWeight: "900",
  },
  weekDayRow: {
    alignItems: "center",
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 14,
  },
  dayNumberSmall: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  dayNumberSmallText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  weekDayText: {
    flex: 1,
  },
  skeleton: {
    alignItems: "center",
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: 24,
  },
  setupScreen: {
    alignItems: "center",
    flex: 1,
    gap: 16,
    justifyContent: "center",
    padding: 28,
  },
});
