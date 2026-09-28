import { createPortal } from "react-dom";
import { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import AssignOtherStudent from "./AssignOtherStudent";
import ScheduleModalHeader from "./ScheduleModalHeader";
import ScheduleCalendarFooter from "./ScheduleCalendarFooter";
import type {
  ShiftType,
  ShiftWithStudentsAndRequesters,
} from "../../types/Shift";
import AdminModalRequestingSutdentsList from "./AdminModal/AdminModalRequestingSutdents";
import AdminModalAssignedSutdents from "./AdminModal/AdminModalAssignedSutdents";
import { useAssignStudentToShift } from "../../hooks/auth/useAssignStudentToShift";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { useUnAssignStudentFromShift } from "../../hooks/auth/useUnAssignStudentFromShift";

type scheduleCalendarModalProps = {
  shift: ShiftWithStudentsAndRequesters | null;
  onClose: () => void;
};

function AdminScheduleCalendarModal({
  shift,
  onClose,
}: scheduleCalendarModalProps) {
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

  const assignStudentToShift = useAssignStudentToShift();
  const unAssignStudentFromShift = useUnAssignStudentFromShift();
  if (!shift) return null;
  const startDate = format(
    startOfWeek(shift.date, { weekStartsOn: 1 }),
    "yyyy-MM-dd",
  );
  const endDate = format(
    endOfWeek(shift.date, { weekStartsOn: 1 }),
    "yyyy-MM-dd",
  );

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

  const handleClickAssignStudent = (userId: number) => {
    assignStudentToShift.mutate({
      shiftId: shift.shift_id,
      userId: userId,
      startDate: startDate,
      endDate: endDate,
    });
  };

  const handleClickUnAssignStudent = (userId: number) => {
    unAssignStudentFromShift.mutate({
      shiftId: shift.shift_id,
      userId: userId,
      startDate: startDate,
      endDate: endDate,
    });
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="w-8/12 h-10/12 overflow-y-hidden rounded-2xl border border-borderDividers bg-cardBG p-8 text-primaryText relative flex flex-col"
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
            <AdminModalAssignedSutdents
              students={shift.students_assigned}
              scheduledStart={shift.scheduled_start_time}
              scheduledEnd={shift.scheduled_end_time}
              shiftId={shift.shift_id}
              header="Assigned Students"
              onClickAssignedStudents={(userId) =>
                handleClickUnAssignStudent(userId)
              }
            />

            <AdminModalRequestingSutdentsList
              students={shift.students_requesting}
              onClickRequestingStudent={(userId) =>
                handleClickAssignStudent(userId)
              }
            />
          </div>
          {/* Bottom bar */}
          <AssignOtherStudent />
        </div>
        {/* FOOTER */}
        <ScheduleCalendarFooter onClose={onClose} />

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-3 border border-borderDividers hover:bg-surfaceCards transition-colors duration-200 rounded-lg cursor-pointer"
        >
          <XMarkIcon className="h-6 w-6 text-primaryText" />
        </button>
      </div>
    </div>,
    document.body,
  );
}

export default AdminScheduleCalendarModal;
