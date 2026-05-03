import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const findState = async (ctx: any, key: string, shared: boolean) => {
  return await ctx.db
    .query("appState")
    .withIndex("by_key_shared", (q: any) => q.eq("key", key).eq("shared", shared))
    .unique();
};

export const get = query({
  args: { key: v.string(), shared: v.boolean() },
  handler: async (ctx, args) => {
    const row = await findState(ctx, args.key, args.shared);
    return row ? { value: row.value, updatedAt: row.updatedAt, updatedBy: row.updatedBy } : null;
  },
});

export const set = mutation({
  args: {
    key: v.string(),
    value: v.string(),
    shared: v.boolean(),
    updatedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await findState(ctx, args.key, args.shared);
    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, {
        value: args.value,
        updatedAt: now,
        updatedBy: args.updatedBy,
      });
    } else {
      await ctx.db.insert("appState", {
        key: args.key,
        value: args.value,
        shared: args.shared,
        updatedAt: now,
        updatedBy: args.updatedBy,
      });
    }
    await ctx.db.insert("auditLog", {
      action: existing ? "update" : "create",
      table: "appState",
      key: args.key,
      actor: args.updatedBy,
      before: existing?.value,
      after: args.value,
      createdAt: now,
    });
    return { value: args.value };
  },
});

export const remove = mutation({
  args: {
    key: v.string(),
    shared: v.boolean(),
    updatedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await findState(ctx, args.key, args.shared);
    if (!existing) return null;
    await ctx.db.delete(existing._id);
    await ctx.db.insert("auditLog", {
      action: "delete",
      table: "appState",
      key: args.key,
      actor: args.updatedBy,
      before: existing.value,
      createdAt: Date.now(),
    });
    return null;
  },
});
