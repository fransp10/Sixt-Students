import { format, parseISO } from "date-fns";
import ShiftBadge from "./ShiftBadge";
import type { ShiftsWorkedHistoryData } from "../types/Shift";

function ShiftHistoryMobileCard({
  shiftsWorkedHistoryData,
}: {
  shiftsWorkedHistoryData: ShiftsWorkedHistoryData[];
}) {
  return (
    <div className="flex w-full flex-col gap-2 mt-4 md:hidden">
      {shiftsWorkedHistoryData.map((shift) => {
        return (
          <div
            key={shift.assigned_shift_id}
            className="rounded-lg border border-borderDividers bg-studentCard p-3"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-primaryText">
                {format(parseISO(shift.date), "MMM dd, yyyy")}
              </span>

              <ShiftBadge shiftType={shift.shift_type} />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-secondaryText">
                {shift.scheduled_start_time.slice(0, -3)} -{" "}
                {shift.scheduled_end_time.slice(0, -3)}
              </span>

              <span className="text-sm font-semibold text-primaryText">
                {shift.hours_worked}h
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ShiftHistoryMobileCard;
