import { v } from "convex/values";
import { query } from "./_generated/server";

export const recent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("auditLog")
      .withIndex("by_createdAt")
      .order("desc")
      .take(args.limit ?? 100);
  },
});
