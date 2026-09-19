import { format, parseISO } from "date-fns";
import type { StudentShiftHistory } from "./Admin/ShiftHistoryPage";
import ShiftBadge from "./ShiftBadge";

function ShiftHistoryMobileCard({ shifts }: { shifts: StudentShiftHistory[] }) {
  return (
    <div className="flex flex-col gap-2 md:hidden">
      {shifts.map((shift) => (
        <div
          key={shift.id}
          className="rounded-lg border border-borderDividers bg-studentCard p-3"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-primaryText">
              {format(parseISO(shift.date), "MMM dd, yyyy")}
            </span>

            <ShiftBadge shiftType={shift.shiftType} />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-secondaryText">
              {shift.startTime} - {shift.endTime}
            </span>

            <span className="text-sm font-semibold text-primaryText">
              {shift.hours}h
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ShiftHistoryMobileCard;
