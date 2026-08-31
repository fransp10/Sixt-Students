import { createPortal } from "react-dom";
import type { selectedShiftType } from "./SchedulePageCalendar";
import { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import AssignedSutdents from "./AssignedSutdents";
import AssignOtherStudent from "./AssignOtherStudent";
import ScheduleModalHeader from "./ScheduleModalHeader";
import ScheduleCalendarFooter from "./ScheduleCalendarFooter";

type scheduleCalendarModalProps = {
  shift: selectedShiftType | null;
  onClose: () => void;
};

function ScheduleCalendarModal({ shift, onClose }: scheduleCalendarModalProps) {
  console.log("Shift in modal:", shift);

  // Close the modal when the Escape key is pressed
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
    shift.shiftType === "Morning"
      ? "7:00 - 15:00"
      : shift.shiftType === "Middle"
        ? "10:00 - 18:00"
        : "14:00 - 22:00";

  const shiftType: "Morning" | "Afternoon" | "Middle" = shift.shiftType;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="w-8/12  h-10/12 overflow-y-hidden rounded-2xl border border-borderDividers bg-pageBackground p-8 text-primaryText relative flex flex-col   "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex min-h-0 flex-1 flex-col gap-6 ">
          {/* Header */}
          <ScheduleModalHeader
            formatedDate={formatedDate}
            shiftTime={shiftTime}
            shiftType={shiftType}
          />
          <div className="flex min-h-0 flex-1 gap-4 ">
            <AssignedSutdents header="Assigned Students" />

            <AssignedSutdents header="Students requesting this shift" />
          </div>
          {/* Bottom bar */}
          <AssignOtherStudent />
        </div>
        {/* FOOTER */}
        <ScheduleCalendarFooter onClose={onClose} />

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-4 bg-borderDividers hover:cursor-pointer hover:bg-red-800"
        >
          <XMarkIcon className="h-6 w-6 text-primaryText" />
        </button>
      </div>
    </div>,
    document.body,
  );
}

export default ScheduleCalendarModal;
