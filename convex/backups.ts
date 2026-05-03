import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const exportAppState = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("appState").collect();
    return JSON.stringify(rows, null, 2);
  },
});

export const saveSnapshot = mutation({
  args: {
    kind: v.string(),
    payload: v.string(),
    createdBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("exports", {
      kind: args.kind,
      payload: args.payload,
      createdAt: Date.now(),
      createdBy: args.createdBy,
    });
  },
});
