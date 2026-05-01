import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  workoutDays: defineTable({
    dayNumber: v.number(),
    title: v.string(),
    subtitle: v.string(),
    focus: v.array(v.string()),
    accent: v.string(),
  }).index("by_dayNumber", ["dayNumber"]),

  exercises: defineTable({
    workoutDayId: v.id("workoutDays"),
    order: v.number(),
    name: v.string(),
    sets: v.number(),
    reps: v.string(),
    restSeconds: v.number(),
    notes: v.string(),
    targetMuscle: v.optional(v.string()),
    equipment: v.optional(v.string()),
    substitutes: v.optional(v.array(v.string())),
    videoUrl: v.optional(v.string()),
  }).index("by_workoutDay", ["workoutDayId"]),

  exerciseCompletions: defineTable({
    exerciseId: v.id("exercises"),
    workoutDayId: v.id("workoutDays"),
    weekStart: v.string(),
    completedAt: v.number(),
  })
    .index("by_week", ["weekStart"])
    .index("by_week_exercise", ["weekStart", "exerciseId"])
    .index("by_week_day", ["weekStart", "workoutDayId"]),

  workoutSessions: defineTable({
    workoutDayId: v.id("workoutDays"),
    weekStart: v.string(),
    startedAt: v.number(),
    finishedAt: v.optional(v.number()),
    exerciseCount: v.number(),
    completedExerciseCount: v.number(),
    notes: v.optional(v.string()),
  })
    .index("by_week", ["weekStart"])
    .index("by_week_day", ["weekStart", "workoutDayId"]),

  setLogs: defineTable({
    workoutDayId: v.id("workoutDays"),
    exerciseId: v.id("exercises"),
    weekStart: v.string(),
    sessionId: v.optional(v.id("workoutSessions")),
    setNumber: v.number(),
    reps: v.number(),
    weight: v.number(),
    completedAt: v.number(),
    notes: v.optional(v.string()),
  })
    .index("by_week", ["weekStart"])
    .index("by_session", ["sessionId"])
    .index("by_week_exercise", ["weekStart", "exerciseId"]),

  exerciseNotes: defineTable({
    exerciseId: v.id("exercises"),
    note: v.string(),
    updatedAt: v.number(),
  }).index("by_exercise", ["exerciseId"]),

  weeklySummaries: defineTable({
    weekStart: v.string(),
    weekEnd: v.string(),
    completedWorkoutDays: v.number(),
    totalWorkoutDays: v.number(),
    totalExercisesCompleted: v.number(),
    totalSetsLogged: v.number(),
    updatedAt: v.number(),
  }).index("by_week", ["weekStart"]),
});
