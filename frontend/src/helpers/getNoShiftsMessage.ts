import { format } from "date-fns";
import type { TimeFrame } from "../types/timeFrame";
import { getTimeFrameRange } from "./getTimeFrameRange";

// "all-time" has no start date, so there is no range to show for it
export function getNoShiftsMessage(timeFrame: TimeFrame): string {
  const { startDate, endDate } = getTimeFrameRange(timeFrame);

  if (!startDate || !endDate) return "No shifts worked yet.";

  return `No shifts worked ${format(startDate, "MM/dd/yyyy")} - ${format(endDate, "MM/dd/yyyy")}.`;
}
