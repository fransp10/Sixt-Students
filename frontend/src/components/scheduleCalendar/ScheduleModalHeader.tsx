import {
  CalendarIcon,
  ClockIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import type { ShiftType } from "../../types/Shift";
import type { ShiftTiming } from "../../helpers/shiftTiming";
import ShiftTimingIndicator from "../ShiftTimingIndicator";

function ScheduleModalHeader({
  formatedDate,
  shiftTime,
  shiftType,
  activeTab,
  setActiveTab,
  shiftTiming,
}: {
  formatedDate: string;
  shiftTime: string;
  shiftType: ShiftType;
  activeTab: "staffing" | "attendance";
  setActiveTab: (tab: "staffing" | "attendance") => void;
  shiftTiming: ShiftTiming;
}) {
  const formattedShiftType =
    shiftType.charAt(0).toUpperCase() + shiftType.slice(1) + " " + "Shift";

  return (
    <div className="flex justify-between  gap-4 items-center mb-4 ">
      <div className="flex gap-4 items-center">
        <CalendarIcon className="h-18 w-18 p-4 rounded-full text-primary bg-primary/20 " />
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <p className="text-3xl font-semibold">{formattedShiftType}</p>
            <p className="text-xs">●</p>
            <p className="text-xl text-secondaryText">{formatedDate}</p>
          </div>
          <p className="text-secondaryText text-xl">{shiftTime}</p>
        </div>
        <ShiftTimingIndicator shiftTiming={shiftTiming} />
      </div>
      <div className="flex gap-2 items-center border p-1 rounded-lg border-borderDividers mr-14">
        <button
          onClick={() => setActiveTab("staffing")}
          className={`p-4  rounded-lg flex flex-row gap-2 items-center  text-xs cursor-pointer hover:bg-surfaceCards hover:text-primaryText transition-all duration-300 ${activeTab === "staffing" ? "bg-surfaceCards text-primaryText" : "text-secondaryText bg-cardLighterBG"}`}
        >
          <UsersIcon className="size-4" />
          <span>STAFFING</span>
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          className={`p-4 bg-cardLighterBG rounded-lg flex flex-row gap-2 items-center  text-xs cursor-pointer hover:bg-surfaceCards hover:text-primaryText transition-all duration-300 ${activeTab === "attendance" ? "bg-surfaceCards text-primaryText" : "text-secondaryText bg-cardLighterBG"}`}
        >
          <ClockIcon className="size-4" />
          <span>ATTENDANCE</span>
        </button>
      </div>
    </div>
  );
}

export default ScheduleModalHeader;
