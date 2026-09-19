import { parseISO } from "date-fns";
import ShiftBadge from "./ShiftBadge";
import { format } from "date-fns";
import type { StudentShiftHistory } from "./Admin/ShiftHistoryPage";

function ShiftHistoryTable({ shifts }: { shifts: StudentShiftHistory[] }) {
  return (
    <div className=" hidden p-4 h-120 md:flex flex-col gap-4  rounded-xl border border-borderDividers bg-cardBG">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-primaryText">Shift history</h2>
          <p className="mt-1 text-sm text-secondaryText">
            Previously worked shifts
          </p>
        </div>
        <select
          className="w-full rounded-lg border border-borderDividers
      bg-cardBG px-3 py-2 text-sm text-primaryText
      outline-none focus:border-primary/40
      sm:w-auto"
        >
          <option>This month</option>
          <option>Last month</option>
          <option>Last 3 months</option>
          <option>This year</option>
        </select>
      </div>

      <div
        className="min-h-0 flex-1 overflow-auto scrollbar-thin 
      scrollbar-thumb-surfaceCards scrollbar-track-cardBG"
      >
        <table className="w-full border-collapse text-left text-sm">
          <thead className="sticky z-10 top-0 bg-cardBG">
            <tr className="border-b border-borderDividers text-xs uppercase text-secondaryText">
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Shift</th>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium text-right">Hours</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift) => (
              <tr
                key={shift.id}
                className="border-b border-borderDividers last:border-b-0
                 hover:bg-studentCard"
              >
                <td className="px-4 py-3 text-sm text-primaryText">
                  {format(parseISO(shift.date), "MMM dd yyyy")}
                </td>
                <td className="px-4 py-3 ">
                  <ShiftBadge shiftType={shift.shiftType} />
                </td>
                <td className="px-4 py-3 text-sm text-secondaryText">
                  {shift.startTime} - {shift.endTime}
                </td>
                <td
                  className="px-4 py-3 text-right  text-sm 
                font-medium text-primaryText"
                >
                  {shift.hours}h
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ShiftHistoryTable;
