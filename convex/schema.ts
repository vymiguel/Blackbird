import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  appState: defineTable({
    key: v.string(),
    value: v.string(),
    shared: v.optional(v.boolean()),
    updatedAt: v.number(),
    updatedBy: v.optional(v.string()),
  })
    .index("by_key", ["key"])
    .index("by_key_shared", ["key", "shared"]),

  auditLog: defineTable({
    action: v.string(),
    table: v.string(),
    key: v.optional(v.string()),
    recordKey: v.optional(v.string()),
    actor: v.optional(v.string()),
    before: v.optional(v.string()),
    after: v.optional(v.string()),
    createdAt: v.number(),
    createdBy: v.optional(v.string()),
  }).index("by_createdAt", ["createdAt"]),

  workers: defineTable({
    name: v.string(),
    role: v.string(),
    workerType: v.optional(v.string()),
    active: v.boolean(),
    pinHash: v.optional(v.string()),
    baseRate: v.optional(v.number()),
    otRate: v.optional(v.number()),
    dtRate: v.optional(v.number()),
    dayRate: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    createdBy: v.optional(v.string()),
    updatedBy: v.optional(v.string()),
  }).index("by_role", ["role"]),

  shifts: defineTable({
    employeeId: v.string(),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    breakMinutes: v.optional(v.number()),
    location: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    createdBy: v.optional(v.string()),
    updatedBy: v.optional(v.string()),
  })
    .index("by_employee", ["employeeId"])
    .index("by_startTime", ["startTime"]),

  fuelEntries: defineTable({
    driverId: v.string(),
    truck: v.optional(v.string()),
    date: v.number(),
    cost: v.optional(v.number()),
    noFuel: v.optional(v.boolean()),
    cardInvalid: v.optional(v.boolean()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    createdBy: v.optional(v.string()),
    updatedBy: v.optional(v.string()),
  })
    .index("by_driver", ["driverId"])
    .index("by_date", ["date"]),

  plates: defineTable({
    registration: v.string(),
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    createdBy: v.optional(v.string()),
    updatedBy: v.optional(v.string()),
  }).index("by_registration", ["registration"]),

  exports: defineTable({
    kind: v.string(),
    payload: v.string(),
    createdAt: v.number(),
    createdBy: v.optional(v.string()),
  }).index("by_createdAt", ["createdAt"]),
});
