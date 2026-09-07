import { format } from "date-fns";
import { useEffect } from "react";
import StudentsInTheShiftList from "./StudentsInTheShiftList";
import { XMarkIcon } from "@heroicons/react/24/outline";
import StudentsRequestingShfitList from "./StudentsRequestingShfitList";

type StudentScheduleCalendarModalProps = {
  onClose: () => void;
  shift: {
    date: string;
    shiftType: string;
    shift?: {
      id: number;
      date: string;
      type: string;
      students: { id: number; name: string }[];
    };
  };
};

function StudentScheduleCalendarModal({
  onClose,
  shift,
}: StudentScheduleCalendarModalProps) {
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

  const shiftTime =
    shift.shiftType === "Morning"
      ? "7:00 - 15:00"
      : shift.shiftType === "Middle"
        ? "10:00 - 18:00"
        : "14:00 - 22:00";
  const formattedDate = format(shift.date, "EEEE, d MMMM yyyy");
  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl max-h-[85vh] rounded-2xl border border-borderDividers 
        bg-cardBG p-6 relative overflow-y-auto md:overflow-hidden  flex flex-col gap-4"
      >
        {/* Heading */}
        <div className="flex flex-col   ">
          <p className="text-secondaryText text-base uppercase">
            {formattedDate}
          </p>
          <p className="text-primaryText text-2xl font-semibold">
            {shift.shiftType} shift
          </p>
          <p className="text-secondaryText text-base">{shiftTime}</p>
        </div>
        {/* divider */}
        <div className="w-full h-1 bg-borderDividers" />

        {/* Students lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x divide-borderDividers">
          {/* Students list heading */}

          <div className="flex flex-col p-4 pr-6">
            <div className="flex flex-row items-center gap-2 p-2  ">
              <span className="text-base lg:text-xl font-semibold">
                Already in this shift
              </span>
              <span
                className=" bg-primary rounded-b-lg rounded-t-lg size-8 flex items-center 
                justify-center text-primaryText"
              >
                3
              </span>
            </div>
            {/* students in the shift list */}
            <StudentsInTheShiftList shift={shift} />
          </div>
          {/* Students requesting this shift */}
          <div className="flex flex-col p-4 pl-6 ">
            <div className="flex flex-row items-center gap-2 ">
              <span className="flex flex-row items-center gap-2 p-2">
                Students requesting this shift
              </span>
              <span
                className=" bg-primary rounded-b-lg rounded-t-lg size-8 flex items-center 
                justify-center  text-primaryText"
              >
                3
              </span>
            </div>
            <StudentsRequestingShfitList shift={shift} />
          </div>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between p-6">
          <p className="text-sm text-secondaryText">Want to work this shift?</p>

          <button
            type="button"
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primaryText transition-opacity hover:opacity-90 cursor-pointer"
          >
            Request this shift
          </button>
          {/* Close */}
        </div>
        <button
          onClick={onClose}
          className=" p-3 border border-borderDividers hover:bg-red-800 rounded-lg cursor-pointer absolute  right-6 top-6 "
        >
          <XMarkIcon className="w-6 h-6 " />
        </button>
      </div>
    </div>
  );
}

export default StudentScheduleCalendarModal;
