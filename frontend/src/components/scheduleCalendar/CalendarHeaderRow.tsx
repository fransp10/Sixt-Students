import { CloudIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import type { ShiftType } from "../../types/Shift";

export type CalendarHeaderRowProps = {
  shiftType: ShiftType;
};

function CalendarHeaderRow({ shiftType }: CalendarHeaderRowProps) {
  const icon =
    shiftType === "morning" ? (
      <SunIcon className="h-6 w-6 text-primary" />
    ) : shiftType === "middle" ? (
      <CloudIcon className="h-6 w-6 text-primary" />
    ) : (
      <MoonIcon className="h-6 w-6 text-primary" />
    );

  const formattedShiftType =
    shiftType.charAt(0).toUpperCase() + shiftType.slice(1);
  const shiftTypeTime =
    shiftType === "morning"
      ? "7:00 - 15:00"
      : shiftType === "middle"
        ? "10:00 - 18:00"
        : "14:00 - 22:00";

  return (
    <th className="h-36  px-8 py-4 border border-borderDividers flex flex-col  text-primaryText justify-center text-left ">
      {icon}
      <p className="text-lg">{formattedShiftType}</p>
      <p className="text-xs text-nowrap text-secondaryText">{shiftTypeTime}</p>
    </th>
  );
}

export default CalendarHeaderRow;
