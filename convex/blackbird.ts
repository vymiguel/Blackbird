import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAllState = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("appState").collect();
  },
});

export const setState = mutation({
  args: {
    key: v.string(),
    value: v.string(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("appState")
      .withIndex("by_key", q => q.eq("key", args.key))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        value: args.value,
        updatedAt: args.updatedAt,
        updatedBy: args.updatedBy,
      });
    } else {
      await ctx.db.insert("appState", {
        key: args.key,
        value: args.value,
        shared: true,
        updatedAt: args.updatedAt,
        updatedBy: args.updatedBy,
      });
    }

    await ctx.db.insert("auditLog", {
      action: existing ? "update_state" : "create_state",
      table: "appState",
      recordKey: args.key,
      before: existing?.value,
      after: args.value,
      createdAt: args.updatedAt,
      createdBy: args.updatedBy,
    });
  },
});

export const exportAll = query({
  args: {},
  handler: async (ctx) => {
    const [appState, workers, shifts, fuelEntries, plates, auditLog] = await Promise.all([
      ctx.db.query("appState").collect(),
      ctx.db.query("workers").collect(),
      ctx.db.query("shifts").collect(),
      ctx.db.query("fuelEntries").collect(),
      ctx.db.query("plates").collect(),
      ctx.db.query("auditLog").collect(),
    ]);

    return {
      exportedAt: Date.now(),
      appState,
      workers,
      shifts,
      fuelEntries,
      plates,
      auditLog,
    };
  },
});
