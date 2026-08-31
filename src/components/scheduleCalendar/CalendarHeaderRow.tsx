import { CloudIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import type { shiftTypeType } from "./SchedulePageCalendar";

export type CalendarHeaderRowProps = {
  shiftType: shiftTypeType;
};
//   {
//     type: "morning",
//     name: "Morning",
//     time: "07:00 - 15:00",
//   },

function CalendarHeaderRow({ shiftType }: CalendarHeaderRowProps) {
  const icon =
    shiftType.name === "Morning" ? (
      <SunIcon className="h-6 w-6 text-primary" />
    ) : shiftType.name === "Middle" ? (
      <CloudIcon className="h-6 w-6 text-primary" />
    ) : (
      <MoonIcon className="h-6 w-6 text-primary" />
    );

  return (
    <div className=" px-8 py-4 border border-borderDividers flex flex-col  text-primaryText justify-center ">
      {icon}
      <p className="text-lg">{shiftType.name}</p>
      <p className="text-xs text-nowrap text-secondaryText">{shiftType.time}</p>
    </div>
  );
}

export default CalendarHeaderRow;
