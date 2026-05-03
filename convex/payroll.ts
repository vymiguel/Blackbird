import { v } from "convex/values";
import { query } from "./_generated/server";

const BREAK_AFTER_HRS = 6;
const BREAK_HRS = 0.5;
const OT_THRESHOLD_HRS = 8;
const DT_THRESHOLD_HRS = 10;

const wageForShift = (shift: any, worker: any, now: number) => {
  const endT = shift.endTime || now;
  const workedHrs = Math.max(0, endT - shift.startTime) / 3600000;
  if ((worker.workerType || "driver") === "subcontractor") {
    return {
      workedHrs,
      paidHrs: workedHrs,
      earned: shift.endTime ? worker.dayRate ?? 0 : 0,
    };
  }
  const breakHrs = workedHrs >= BREAK_AFTER_HRS ? BREAK_HRS : 0;
  const paidHrs = Math.max(0, workedHrs - breakHrs);
  const base = worker.baseRate ?? 33.09;
  const ot = worker.otRate ?? base * 1.5;
  const dt = worker.dtRate ?? base * 2;
  const t1 = Math.min(paidHrs, OT_THRESHOLD_HRS);
  const t2 = Math.max(0, Math.min(paidHrs, DT_THRESHOLD_HRS) - OT_THRESHOLD_HRS);
  const t3 = Math.max(0, paidHrs - DT_THRESHOLD_HRS);
  return { workedHrs, paidHrs, earned: t1 * base + t2 * ot + t3 * dt };
};

export const calculateWeek = query({
  args: {
    workersJson: v.string(),
    shiftsJson: v.string(),
    start: v.number(),
    end: v.number(),
    now: v.number(),
  },
  handler: async (_ctx, args) => {
    const workers = JSON.parse(args.workersJson);
    const shifts = JSON.parse(args.shiftsJson);
    return workers.map((worker: any) => {
      const workerShifts = shifts.filter(
        (shift: any) =>
          shift.employeeId === worker.id &&
          shift.startTime >= args.start &&
          shift.startTime <= args.end,
      );
      return workerShifts.reduce(
        (acc: any, shift: any) => {
          const wage = wageForShift(shift, worker, args.now);
          acc.shifts += 1;
          acc.paidHrs += wage.paidHrs;
          acc.earned += wage.earned;
          return acc;
        },
        { workerId: worker.id, shifts: 0, paidHrs: 0, earned: 0 },
      );
    });
  },
});
