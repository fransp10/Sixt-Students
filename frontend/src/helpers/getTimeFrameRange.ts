import { endOfMonth, startOfMonth, startOfYear, subMonths } from "date-fns";
import type { TimeFrame } from "../types/timeFrame";

export function getTimeFrameRange(
  timeFrame: TimeFrame,
  now = new Date(),
): { startDate?: Date | null; endDate?: Date } {
  switch (timeFrame) {
    case "this-month":
      return {
        startDate: startOfMonth(now),
        endDate: now,
      };
    case "last-month":
      return {
        startDate: startOfMonth(subMonths(now, 1)),
        endDate: endOfMonth(subMonths(now, 1)),
      };
    case "last-3-months":
      return {
        startDate: startOfMonth(subMonths(now, 2)),
        endDate: now,
      };
    case "this-year":
      return {
        startDate: startOfYear(now),
        endDate: now,
      };
    case "all-time":
      return { startDate: null, endDate: now };
  }
}
