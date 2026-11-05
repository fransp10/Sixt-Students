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
    <div className="flex flex-col gap-4 -mx-4 -mt-4 mb-4 p-4 border-b border-borderDividers lg:flex-row lg:justify-between lg:items-center lg:m-0 lg:mb-4 lg:p-0 lg:border-b-0">
      {/* below lg: stacked full-width header; lg classes keep the desktop layout */}
      <div className="flex flex-col items-start gap-3 pr-14 lg:flex-row lg:items-center lg:gap-4 lg:pr-0">
        <CalendarIcon className="hidden lg:block h-18 w-18 p-4 rounded-full text-primary bg-primary/20 " />
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap lg:flex-nowrap gap-x-2 gap-y-1 items-center">
            <p className="text-2xl lg:text-3xl font-semibold">
              {formattedShiftType}
            </p>
            <p className="hidden lg:block text-xs">●</p>
            <p className="basis-full lg:basis-auto text-sm lg:text-xl text-secondaryText">
              {formatedDate}
            </p>
          </div>
          <p className="text-secondaryText text-sm lg:text-xl">{shiftTime}</p>
        </div>
        <ShiftTimingIndicator shiftTiming={shiftTiming} />
      </div>
      <div className="grid grid-cols-2 gap-1 items-center border p-1 rounded-lg border-borderDividers lg:flex lg:gap-2 lg:mr-14">
        <button
          onClick={() => setActiveTab("staffing")}
          className={`p-4  rounded-lg flex flex-row justify-center gap-2 items-center  text-xs cursor-pointer hover:bg-surfaceCards hover:text-primaryText transition-all duration-300 ${activeTab === "staffing" ? "bg-surfaceCards text-primaryText" : "text-secondaryText bg-cardLighterBG"}`}
        >
          <UsersIcon className="size-4" />
          <span>STAFFING</span>
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          className={`p-4 bg-cardLighterBG rounded-lg flex flex-row justify-center gap-2 items-center  text-xs cursor-pointer hover:bg-surfaceCards hover:text-primaryText transition-all duration-300 ${activeTab === "attendance" ? "bg-surfaceCards text-primaryText" : "text-secondaryText bg-cardLighterBG"}`}
        >
          <ClockIcon className="size-4" />
          <span>ATTENDANCE</span>
        </button>
      </div>
    </div>
  );
}

export default ScheduleModalHeader;
