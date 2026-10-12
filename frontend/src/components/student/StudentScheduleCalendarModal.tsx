import { endOfWeek, format, startOfWeek } from "date-fns";
import { useEffect } from "react";
import StudentsInTheShiftList from "./StudentsInTheShiftList";
import { CalendarDateRangeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import StudentsRequestingShfitList from "./StudentsRequestingShfitList";
import type {
  ShiftStatus,
  ShiftWithStudentsAndRequesters,
} from "../../types/Shift";
import { useRequestShift } from "../../hooks/auth/useRequestShift";
import { useCurrentUser } from "../../hooks/auth/useCurrentUser";
import { useDeleteShiftRequest } from "../../hooks/auth/useDeleteShiftRequest";
import { getShiftStatus } from "../../helpers/getShiftStatus";

type StudentScheduleCalendarModalProps = {
  onClose: () => void;
  shift: ShiftWithStudentsAndRequesters | null;
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

  const { data: currentUser } = useCurrentUser();
  const shiftRequestMutation = useRequestShift();
  const shiftDeleteRequestMutation = useDeleteShiftRequest();

  if (!shift) {
    return null;
  }

  if (!currentUser) {
    return null;
  }

  const shiftWeekStartDate = format(
    startOfWeek(shift.date, { weekStartsOn: 1 }),
    "yyyy-MM-dd",
  );
  const shiftWeekEndDate = format(
    endOfWeek(shift.date, { weekStartsOn: 1 }),
    "yyyy-MM-dd",
  );

  const shiftTime = `${shift.scheduled_start_time} - ${shift.scheduled_end_time}`;
  const formattedDate = format(shift.date, "EEEE, d MMMM yyyy");
  const formattedShiftType =
    shift.shift_type.charAt(0).toUpperCase() + shift.shift_type.slice(1);

  const { students_requesting: studentsRequestingShift } = shift;
  const { students_assigned: studentsAssignedShift } = shift;
  //  ["shifts", startDate, endDate]

  const shiftId = shift.shift_id;
  function handleRequestShift() {
    shiftRequestMutation.mutate({
      shiftId,
      startDate: shiftWeekStartDate,
      endDate: shiftWeekEndDate,
    });
  }

  function handleDeleteShiftRequest() {
    shiftDeleteRequestMutation.mutate({
      shiftId,
      startDate: shiftWeekStartDate,
      endDate: shiftWeekEndDate,
    });
  }

  const shiftStatus: ShiftStatus = getShiftStatus(shift, currentUser.id);

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
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-6">
          <div className="flex flex-row items-center gap-4">
            <CalendarDateRangeIcon className="size-12 text-primary" />
            <div className="flex flex-col gap-2">
              <p className="text-secondaryText text-sm uppercase">
                {formattedDate}
              </p>
              <p className="text-primaryText text-2xl font-semibold">
                {formattedShiftType} shift
              </p>
              <p className="text-secondaryText text-base">{shiftTime}</p>
            </div>
          </div>
          {shiftStatus === "passed" && (
            <div className="flex items-center gap-3 w-full sm:w-auto px-4 py-3 rounded-lg border border-warning/30 bg-warning/10 text-primaryText">
              <ClockIcon className="size-6 shrink-0 text-warning" />
              <div className="flex flex-col">
                <p className="text-base font-semibold text-warning">
                  Shift passed
                </p>
                <p className="text-sm text-secondaryText">
                  This shift has already passed. You can still view the students
                  assigned and requesting this shift.
                </p>
              </div>
            </div>
          )}
          {shiftStatus === "requested" && (
            <div className="flex items-center gap-3 w-full sm:w-auto px-4 py-3 mr-8 rounded-lg border border-success/30 bg-success/10 text-primaryText">
              <CheckCircleIcon className="size-6 shrink-0 text-success" />
              <div className="flex flex-col">
                <p className="text-base font-semibold text-success">
                  Shift requested
                </p>
                <p className="text-sm text-secondaryText">
                  Waiting for an admin to assign you
                </p>
              </div>
            </div>
          )}
        </div>
        {/* divider */}
        <div className="w-full h-px bg-borderDividers" />

        {/* Students lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x divide-borderDividers">
          {/* Students list heading */}

          <div className="flex flex-col p-4 pr-6">
            <div className="flex flex-row items-center gap-2 p-2">
              <CheckCircleIcon className="size-5 shrink-0 text-success" />
              <span className="text-base lg:text-xl font-semibold text-primaryText">
                Already in this shift
              </span>
              <span className="bg-success/15 text-success rounded-full size-8 flex items-center justify-center text-sm font-semibold">
                {studentsAssignedShift.length ?? 0}
              </span>
            </div>
            {/* students in the shift list */}
            <StudentsInTheShiftList students={studentsAssignedShift} />
          </div>
          {/* Students requesting this shift */}
          <div className="flex flex-col p-4 pl-6  ">
            <div className="flex flex-row items-center gap-2 p-2">
              <ClockIcon className="size-5 shrink-0 text-pending" />
              <span className="text-base lg:text-xl font-semibold text-primaryText">
                Students requesting this shift
              </span>
              <span className="bg-pending/15 text-pending rounded-full size-8 flex items-center justify-center text-sm font-semibold">
                {studentsRequestingShift.length ?? 0}
              </span>
            </div>
            <StudentsRequestingShfitList
              studentsRequestingThisShift={studentsRequestingShift}
            />
          </div>
        </div>
        {/* Footer */}
        <div className="flex  flex-col gap-2  sm:flex-row items-center justify-between p-0">
          <p className="text-sm text-secondaryText">Want to work this shift?</p>

          {shiftStatus === "requested" ? (
            <button
              type="button"
              onClick={handleDeleteShiftRequest}
              disabled={shiftDeleteRequestMutation.isPending}
              className="rounded-lg w-full sm:w-auto bg-danger px-6 py-2.5 text-sm font-medium text-primaryText transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete shift request
            </button>
          ) : (
            shiftStatus !== "passed" &&
            shiftStatus !== "ongoing" &&
            shiftStatus !== "assigned" && (
              <button
                type="button"
                onClick={handleRequestShift}
                disabled={shiftRequestMutation.isPending}
                className="rounded-lg  w-full sm:w-auto bg-primary px-6 py-2.5 text-sm font-medium text-primaryText transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Request this shift
              </button>
            )
          )}
          {/* Close */}
        </div>
        <button
          onClick={onClose}
          className="p-3 border border-borderDividers hover:bg-surfaceCards transition-colors duration-200 rounded-lg cursor-pointer absolute right-4 top-4 text-primaryText"
        >
          <XMarkIcon className="size-4 " />
        </button>
      </div>
    </div>
  );
}

export default StudentScheduleCalendarModal;
