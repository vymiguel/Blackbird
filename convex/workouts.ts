import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

const plan = [
  {
    dayNumber: 1,
    title: "Chest, Shoulders, Triceps",
    subtitle: "Press strength and upper-body volume",
    focus: ["Chest", "Shoulders", "Triceps"],
    accent: "#d8a24a",
    exercises: [
      ["Barbell Bench Press", 4, "6-8", 150, "Pull shoulder blades back, touch the lower chest, drive feet into the floor."],
      ["Incline Dumbbell Press", 3, "8-10", 120, "Keep elbows slightly tucked and control the stretch at the bottom."],
      ["Seated Dumbbell Shoulder Press", 3, "8-10", 120, "Brace ribs down and press in a smooth vertical path."],
      ["Cable Lateral Raise", 3, "12-15", 60, "Lead with elbows and pause at shoulder height."],
      ["Rope Triceps Pressdown", 3, "10-12", 75, "Pin elbows to your sides and split the rope at lockout."],
      ["Overhead Cable Triceps Extension", 3, "12-15", 75, "Let the long head stretch fully before extending."],
    ],
  },
  {
    dayNumber: 2,
    title: "Back + Biceps",
    subtitle: "Pull volume with arm growth priority",
    focus: ["Back", "Biceps"],
    accent: "#9f7a43",
    exercises: [
      ["Pull-Up or Lat Pulldown", 4, "6-10", 120, "Drive elbows down and avoid shrugging at the top."],
      ["Barbell Row", 4, "6-8", 150, "Hinge firmly, row toward the lower ribs, and keep the torso stable."],
      ["Chest-Supported Row", 3, "10-12", 105, "Pause with shoulder blades squeezed together."],
      ["Face Pull", 3, "12-15", 60, "Pull toward eyebrows and rotate thumbs back."],
      ["EZ-Bar Curl", 4, "8-10", 90, "Keep elbows slightly forward and lower under control."],
      ["Incline Dumbbell Curl", 3, "10-12", 75, "Let arms hang back to load the long head of the biceps."],
    ],
  },
  {
    dayNumber: 3,
    title: "Legs + Core",
    subtitle: "Lower-body base and trunk strength",
    focus: ["Quads", "Hamstrings", "Core"],
    accent: "#c28a3d",
    exercises: [
      ["Back Squat", 4, "5-8", 180, "Brace hard, sit between hips, and keep knees tracking over toes."],
      ["Romanian Deadlift", 4, "8-10", 150, "Push hips back and keep lats tight through the full range."],
      ["Leg Press", 3, "10-12", 120, "Use controlled depth without letting hips curl off the pad."],
      ["Seated Leg Curl", 3, "12-15", 75, "Squeeze hard at the bottom and return slowly."],
      ["Standing Calf Raise", 4, "10-15", 60, "Pause at the stretch and at the top."],
      ["Cable Crunch", 3, "12-15", 60, "Round through the spine and keep hips locked."],
    ],
  },
  {
    dayNumber: 4,
    title: "Arms Focus + Shoulders",
    subtitle: "Direct biceps, triceps, and delt work",
    focus: ["Biceps", "Triceps", "Shoulders"],
    accent: "#e0b15e",
    exercises: [
      ["Close-Grip Bench Press", 4, "6-8", 150, "Keep wrists stacked and elbows close without flaring hard."],
      ["Weighted Dip", 3, "8-10", 120, "Stay upright to bias triceps and lock out with control."],
      ["Preacher Curl", 4, "8-10", 90, "Keep upper arms glued to the pad and avoid bouncing."],
      ["Cable Hammer Curl", 3, "10-12", 75, "Curl across a steady path and squeeze the brachialis."],
      ["Machine Lateral Raise", 4, "12-15", 60, "Keep tension on the side delts and avoid shrugging."],
      ["Rear Delt Cable Fly", 3, "12-15", 60, "Open wide with soft elbows and pause behind the body."],
      ["Single-Arm Cable Pressdown", 3, "12-15", 60, "Lock each rep out and keep the shoulder still."],
    ],
  },
] as const;

function getFridayWeekStart(timestamp: number) {
  const date = new Date(timestamp);
  const localMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = localMidnight.getDay();
  const daysSinceFriday = (day - 5 + 7) % 7;
  localMidnight.setDate(localMidnight.getDate() - daysSinceFriday);
  return formatDateKey(localMidnight);
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function enrichExerciseSeed(name: string) {
  const lower = name.toLowerCase();
  const equipment = lower.includes("cable")
    ? "Cable station"
    : lower.includes("dumbbell")
      ? "Dumbbells"
      : lower.includes("machine")
        ? "Machine"
        : lower.includes("barbell") || lower.includes("bench") || lower.includes("squat") || lower.includes("deadlift")
          ? "Barbell"
          : "Gym station";
  const targetMuscle = lower.includes("curl") || lower.includes("biceps")
    ? "Biceps"
    : lower.includes("triceps") || lower.includes("pressdown") || lower.includes("dip") || lower.includes("close-grip")
      ? "Triceps"
      : lower.includes("lateral") || lower.includes("delt") || lower.includes("shoulder")
        ? "Shoulders"
        : lower.includes("row") || lower.includes("pulldown") || lower.includes("pull-up") || lower.includes("face pull")
          ? "Back"
          : lower.includes("squat") || lower.includes("leg") || lower.includes("calf") || lower.includes("deadlift")
            ? "Legs"
            : lower.includes("crunch")
              ? "Core"
              : "Chest";
  const substitutes = targetMuscle === "Biceps"
    ? ["Cable curl", "Machine curl"]
    : targetMuscle === "Triceps"
      ? ["Rope pressdown", "Skull crusher"]
      : targetMuscle === "Shoulders"
        ? ["Dumbbell lateral raise", "Cable face pull"]
        : targetMuscle === "Back"
          ? ["Seated cable row", "Neutral-grip pulldown"]
          : targetMuscle === "Legs"
            ? ["Hack squat", "Split squat"]
            : targetMuscle === "Core"
              ? ["Hanging knee raise", "Decline sit-up"]
              : ["Dumbbell press", "Machine chest press"];

  const videoUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${name} exercise proper form`)}`;
  return { equipment, targetMuscle, substitutes, videoUrl };
}

async function buildWeeklySummary(ctx: any, weekStart: string) {
  const completions = await ctx.db
    .query("exerciseCompletions")
    .withIndex("by_week", (q: any) => q.eq("weekStart", weekStart))
    .collect();
  const setLogs = await ctx.db
    .query("setLogs")
    .withIndex("by_week", (q: any) => q.eq("weekStart", weekStart))
    .collect();
  const days = await ctx.db.query("workoutDays").collect();
  const completedWorkoutDays = await Promise.all(
    days.map(async (day: any) => {
      const exercises = await ctx.db
        .query("exercises")
        .withIndex("by_workoutDay", (q: any) => q.eq("workoutDayId", day._id))
        .collect();
      const completedForDay = completions.filter((item: any) => item.workoutDayId === day._id).length;
      return exercises.length > 0 && completedForDay === exercises.length;
    }),
  );
  const weekEnd = new Date(`${weekStart}T00:00:00`);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return {
    weekStart,
    weekEnd: formatDateKey(weekEnd),
    completedWorkoutDays: completedWorkoutDays.filter(Boolean).length,
    totalWorkoutDays: days.length,
    totalExercisesCompleted: completions.length,
    totalSetsLogged: setLogs.length,
  };
}

async function upsertWeeklySummary(ctx: any, weekStart: string) {
  const summary = await buildWeeklySummary(ctx, weekStart);
  const existing = await ctx.db
    .query("weeklySummaries")
    .withIndex("by_week", (q: any) => q.eq("weekStart", weekStart))
    .first();
  const payload = { ...summary, updatedAt: Date.now() };
  if (existing) {
    await ctx.db.patch(existing._id, payload);
  } else {
    await ctx.db.insert("weeklySummaries", payload);
  }
  return summary;
}

export const seedPlan = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("workoutDays").first();
    if (existing) {
      const exercises = await ctx.db.query("exercises").collect();
      for (const exercise of exercises) {
        if (!exercise.targetMuscle || !exercise.equipment || !exercise.substitutes) {
          await ctx.db.patch(exercise._id, enrichExerciseSeed(exercise.name));
        }
      }
      return { inserted: false };
    }

    for (const day of plan) {
      const workoutDayId = await ctx.db.insert("workoutDays", {
        dayNumber: day.dayNumber,
        title: day.title,
        subtitle: day.subtitle,
        focus: [...day.focus],
        accent: day.accent,
      });

      for (const [index, exercise] of day.exercises.entries()) {
        const details = enrichExerciseSeed(exercise[0]);
        await ctx.db.insert("exercises", {
          workoutDayId,
          order: index + 1,
          name: exercise[0],
          sets: exercise[1],
          reps: exercise[2],
          restSeconds: exercise[3],
          notes: exercise[4],
          ...details,
        });
      }
    }

    return { inserted: true };
  },
});

export const getWorkoutDays = query({
  args: { weekStart: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const weekStart = args.weekStart ?? getFridayWeekStart(Date.now());
    const days = await ctx.db.query("workoutDays").withIndex("by_dayNumber").collect();
    const completions = await ctx.db
      .query("exerciseCompletions")
      .withIndex("by_week", (q) => q.eq("weekStart", weekStart))
      .collect();

    return Promise.all(
      days.map(async (day) => {
        const exercises = await ctx.db
          .query("exercises")
          .withIndex("by_workoutDay", (q) => q.eq("workoutDayId", day._id))
          .collect();
        const completed = completions.filter((item) => item.workoutDayId === day._id).length;
        return {
          ...day,
          exerciseCount: exercises.length,
          completedCount: completed,
          progress: exercises.length === 0 ? 0 : completed / exercises.length,
        };
      }),
    );
  },
});

export const getWorkoutDay = query({
  args: { workoutDayId: v.id("workoutDays"), weekStart: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const weekStart = args.weekStart ?? getFridayWeekStart(Date.now());
    const day = await ctx.db.get(args.workoutDayId);
    if (!day) return null;

    const exercises = await ctx.db
      .query("exercises")
      .withIndex("by_workoutDay", (q) => q.eq("workoutDayId", args.workoutDayId))
      .collect();
    const completions = await ctx.db
      .query("exerciseCompletions")
      .withIndex("by_week_day", (q) => q.eq("weekStart", weekStart).eq("workoutDayId", args.workoutDayId))
      .collect();
    const notes = await Promise.all(
      exercises.map(async (exercise) => {
        const personalNote = await ctx.db
          .query("exerciseNotes")
          .withIndex("by_exercise", (q) => q.eq("exerciseId", exercise._id))
          .first();
        return [exercise._id, personalNote?.note ?? ""] as const;
      }),
    );
    const noteMap = new Map(notes);
    const completedIds = new Set(completions.map((item) => item.exerciseId));

    return {
      ...day,
      exercises: exercises
        .sort((a, b) => a.order - b.order)
        .map((exercise) => ({
          ...exercise,
          equipment: exercise.equipment ?? "Gym station",
          targetMuscle: exercise.targetMuscle ?? "Primary muscle",
          substitutes: exercise.substitutes ?? [],
          videoUrl: exercise.videoUrl ?? `https://www.youtube.com/results?search_query=${encodeURIComponent(`${exercise.name} exercise proper form`)}`,
          personalNote: noteMap.get(exercise._id) ?? "",
          completed: completedIds.has(exercise._id),
        })),
    };
  },
});

export const toggleExerciseCompletion = mutation({
  args: {
    exerciseId: v.id("exercises"),
    weekStart: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const exercise = await ctx.db.get(args.exerciseId);
    if (!exercise) throw new Error("Exercise not found");

    const weekStart = args.weekStart ?? getFridayWeekStart(Date.now());
    const existing = await ctx.db
      .query("exerciseCompletions")
      .withIndex("by_week_exercise", (q) => q.eq("weekStart", weekStart).eq("exerciseId", args.exerciseId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      await upsertWeeklySummary(ctx, weekStart);
      return { completed: false };
    }

    await ctx.db.insert("exerciseCompletions", {
      exerciseId: args.exerciseId,
      workoutDayId: exercise.workoutDayId as Id<"workoutDays">,
      weekStart,
      completedAt: Date.now(),
    });
    await upsertWeeklySummary(ctx, weekStart);

    return { completed: true };
  },
});

export const updateExerciseDetails = mutation({
  args: {
    exerciseId: v.id("exercises"),
    notes: v.string(),
    targetMuscle: v.string(),
    equipment: v.string(),
    restSeconds: v.number(),
    substitutes: v.array(v.string()),
    videoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.exerciseId, {
      notes: args.notes,
      targetMuscle: args.targetMuscle,
      equipment: args.equipment,
      restSeconds: args.restSeconds,
      substitutes: args.substitutes,
      videoUrl: args.videoUrl,
    });
    return { saved: true };
  },
});

export const saveExerciseNote = mutation({
  args: {
    exerciseId: v.id("exercises"),
    note: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("exerciseNotes")
      .withIndex("by_exercise", (q) => q.eq("exerciseId", args.exerciseId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { note: args.note, updatedAt: Date.now() });
      return { saved: true };
    }
    await ctx.db.insert("exerciseNotes", {
      exerciseId: args.exerciseId,
      note: args.note,
      updatedAt: Date.now(),
    });
    return { saved: true };
  },
});

export const startWorkoutSession = mutation({
  args: {
    workoutDayId: v.id("workoutDays"),
    weekStart: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const weekStart = args.weekStart ?? getFridayWeekStart(Date.now());
    const exercises = await ctx.db
      .query("exercises")
      .withIndex("by_workoutDay", (q) => q.eq("workoutDayId", args.workoutDayId))
      .collect();
    return await ctx.db.insert("workoutSessions", {
      workoutDayId: args.workoutDayId,
      weekStart,
      startedAt: Date.now(),
      exerciseCount: exercises.length,
      completedExerciseCount: 0,
    });
  },
});

export const logSet = mutation({
  args: {
    workoutDayId: v.id("workoutDays"),
    exerciseId: v.id("exercises"),
    weekStart: v.optional(v.string()),
    sessionId: v.optional(v.id("workoutSessions")),
    setNumber: v.number(),
    reps: v.number(),
    weight: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const weekStart = args.weekStart ?? getFridayWeekStart(Date.now());
    const id = await ctx.db.insert("setLogs", {
      workoutDayId: args.workoutDayId,
      exerciseId: args.exerciseId,
      weekStart,
      sessionId: args.sessionId,
      setNumber: args.setNumber,
      reps: args.reps,
      weight: args.weight,
      notes: args.notes,
      completedAt: Date.now(),
    });
    await upsertWeeklySummary(ctx, weekStart);
    return id;
  },
});

export const finishWorkoutSession = mutation({
  args: {
    workoutDayId: v.id("workoutDays"),
    weekStart: v.optional(v.string()),
    sessionId: v.optional(v.id("workoutSessions")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const weekStart = args.weekStart ?? getFridayWeekStart(Date.now());
    const completions = await ctx.db
      .query("exerciseCompletions")
      .withIndex("by_week_day", (q) => q.eq("weekStart", weekStart).eq("workoutDayId", args.workoutDayId))
      .collect();
    const exercises = await ctx.db
      .query("exercises")
      .withIndex("by_workoutDay", (q) => q.eq("workoutDayId", args.workoutDayId))
      .collect();

    let sessionId = args.sessionId;
    if (sessionId) {
      await ctx.db.patch(sessionId, {
        finishedAt: Date.now(),
        completedExerciseCount: completions.length,
        exerciseCount: exercises.length,
        notes: args.notes,
      });
    } else {
      sessionId = await ctx.db.insert("workoutSessions", {
        workoutDayId: args.workoutDayId,
        weekStart,
        startedAt: Date.now(),
        finishedAt: Date.now(),
        completedExerciseCount: completions.length,
        exerciseCount: exercises.length,
        notes: args.notes,
      });
    }

    const summary = await upsertWeeklySummary(ctx, weekStart);
    return { sessionId, summary };
  },
});

export const getWeeklyProgress = query({
  args: { weekStart: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const weekStart = args.weekStart ?? getFridayWeekStart(Date.now());
    const completions = await ctx.db
      .query("exerciseCompletions")
      .withIndex("by_week", (q) => q.eq("weekStart", weekStart))
      .collect();
    const days = await ctx.db.query("workoutDays").collect();
    const completedWorkoutDays = await Promise.all(
      days.map(async (day) => {
        const exercises = await ctx.db
          .query("exercises")
          .withIndex("by_workoutDay", (q) => q.eq("workoutDayId", day._id))
          .collect();
        const completedForDay = completions.filter((item) => item.workoutDayId === day._id).length;
        return exercises.length > 0 && completedForDay === exercises.length;
      }),
    );
    const weekEnd = new Date(`${weekStart}T00:00:00`);
    weekEnd.setDate(weekEnd.getDate() + 6);

    return {
      weekStart,
      weekEnd: formatDateKey(weekEnd),
      completedWorkoutDays: completedWorkoutDays.filter(Boolean).length,
      totalWorkoutDays: days.length,
      totalExercisesCompleted: completions.length,
      totalSetsLogged: (await ctx.db
        .query("setLogs")
        .withIndex("by_week", (q) => q.eq("weekStart", weekStart))
        .collect()).length,
    };
  },
});

export const getWeeklyHistory = query({
  args: {},
  handler: async (ctx) => {
    const summaries = await ctx.db.query("weeklySummaries").collect();
    return summaries.sort((a, b) => b.weekStart.localeCompare(a.weekStart)).slice(0, 8);
  },
});
