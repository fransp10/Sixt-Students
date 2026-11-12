import { parseISO } from "date-fns";
import ShiftBadge from "./ShiftBadge";
import { format } from "date-fns";
import type { ShiftsWorkedHistoryData } from "../types/Shift";
import type { TimeFrame } from "../types/timeFrame";
import { getTimeFrameRange } from "../helpers/getTimeFrameRange";

function ShiftHistoryTable({
  shiftsWorkedHistoryData,
  timeFrame,
}: {
  shiftsWorkedHistoryData: ShiftsWorkedHistoryData[];
  timeFrame: TimeFrame;
}) {
  const { startDate, endDate } = getTimeFrameRange(timeFrame);
  return (
    <div
      className="min-h-0  w-full h-full hidden md:flex flex-1 overflow-auto scrollbar-thin 
      scrollbar-thumb-surfaceCards scrollbar-track-cardBG"
    >
      <table className="w-full  border-collapse text-left text-sm h-26">
        <thead className="sticky z-10 top-0 bg-cardBG">
          <tr className="border-b border-borderDividers text-xs uppercase text-secondaryText">
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Shift</th>
            <th className="px-4 py-3 font-medium">Time</th>
            <th className="px-4 py-3 font-medium text-right">Hours worked</th>
          </tr>
        </thead>
        <tbody>
          {shiftsWorkedHistoryData.map((shift) => (
            <tr
              key={shift.assigned_shift_id}
              className="border-b border-borderDividers last:border-b-0
                 hover:bg-studentCard"
            >
              <td className="px-4 py-3 text-sm text-primaryText">
                {format(parseISO(shift.date), "MMM dd yyyy")}
              </td>
              <td className="px-4 py-3 ">
                <ShiftBadge shiftType={shift.shift_type} />
              </td>
              <td className="px-4 py-3 text-sm text-secondaryText">
                {shift.scheduled_start_time} - {shift.scheduled_end_time}
              </td>
              <td
                className="px-4 py-3 text-right  text-sm 
                font-medium text-primaryText"
              >
                {shift.hours_worked}h
              </td>
            </tr>
          ))}
          {shiftsWorkedHistoryData.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-3 text-center text-sm text-secondaryText"
              >
                No shifts worked {format(startDate!, "MM/dd/yyyy")}
                {" - "}
                {format(endDate!, "MM/dd/yyyy")}.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ShiftHistoryTable;
