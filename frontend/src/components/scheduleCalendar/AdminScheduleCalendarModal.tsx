import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ScheduleModalHeader from "./ScheduleModalHeader";
import ScheduleCalendarFooter from "./ScheduleCalendarFooter";
import type {
  ShiftType,
  ShiftWithStudentsAndRequesters,
} from "../../types/Shift";

import StaffingTab from "./AdminModal/StaffingTab";
import AttendanceTab from "./AdminModal/AttendanceTab";
import { getShiftTiming } from "../../helpers/shiftTiming";

type scheduleCalendarModalProps = {
  shift: ShiftWithStudentsAndRequesters | null;
  onClose: () => void;
};

function AdminScheduleCalendarModal({
  shift,
  onClose,
}: scheduleCalendarModalProps) {
  const [tab, setTab] = useState<"staffing" | "attendance">("staffing");
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!shift) return null;

  const formatedDate = new Date(shift.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const shiftTime =
    shift.shift_type === "morning"
      ? "7:00 - 15:00"
      : shift.shift_type === "middle"
        ? "10:00 - 18:00"
        : "14:00 - 22:00";

  const shiftType: ShiftType = shift.shift_type;
  const shiftTiming = getShiftTiming(shift);
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 lg:p-4"
      onClick={onClose}
    >
      <div
        className="w-full h-dvh lg:w-8/12 lg:h-10/12 overflow-y-auto  scrollbar-thin scrollbar-thumb-surfaceCards  lg:rounded-2xl lg:border border-borderDividers bg-cardBG p-4 lg:p-8 text-primaryText relative flex flex-col"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        {/* Header */}
        <ScheduleModalHeader
          formatedDate={formatedDate}
          shiftTime={shiftTime}
          shiftType={shiftType}
          activeTab={tab}
          setActiveTab={setTab}
          shiftTiming={shiftTiming}
        />
        {tab === "staffing" && <StaffingTab shift={shift} />}
        {tab === "attendance" && <AttendanceTab shift={shift} />}
        {/* FOOTER */}
        <ScheduleCalendarFooter onClose={onClose} />

        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-3 border border-borderDividers hover:bg-surfaceCards transition-colors  rounded-lg cursor-pointer"
        >
          <XMarkIcon className="h-6 w-6 text-primaryText" />
        </button>
      </div>
    </div>,
    document.body,
  );
}

export default AdminScheduleCalendarModal;
