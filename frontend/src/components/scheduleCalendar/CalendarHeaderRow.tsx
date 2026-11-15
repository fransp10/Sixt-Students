import { CloudIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import type { ShiftType } from "../../types/Shift";
import { formatShiftRange } from "../../config/shiftHours";
import { capitalize } from "../../helpers/capitalize";
import ShiftTimeRail from "./ShiftTimeRail";

export type CalendarHeaderRowProps = {
  shiftType: ShiftType;
};

const ICONS = { morning: SunIcon, middle: CloudIcon, afternoon: MoonIcon };

function CalendarHeaderRow({ shiftType }: CalendarHeaderRowProps) {
  const Icon = ICONS[shiftType];

  return (
    <div
      role="rowheader"
      className="flex flex-col justify-center gap-1.5 pr-3 text-left text-primaryText"
    >
      <div className="flex items-center gap-2">
        <Icon className="size-5 shrink-0 text-primary" />
        <p className="text-lg font-semibold">{capitalize(shiftType)}</p>
      </div>
      <p className="text-xs tabular-nums text-secondaryText">
        {formatShiftRange(shiftType)}
      </p>
      <ShiftTimeRail shiftType={shiftType} />
    </div>
  );
}

export default CalendarHeaderRow;
