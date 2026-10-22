import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useGetShiftsWithStudentsAndRequesters } from "../../hooks/auth/useGetShiftsWithStudentsAndRequesters";
import { useAssignStudentToShift } from "../../hooks/auth/useAssignStudentToShift";
import { capitalize } from "../../helpers/capitalize";
import { getShiftTiming } from "../../helpers/shiftTiming";
import type { ShiftWithStudentsAndRequesters } from "../../types/Shift";
import type { StudentRequesting } from "../../types/students";

type PendingRequest = {
  shift: ShiftWithStudentsAndRequesters;
  student: StudentRequesting;
};

function formatShiftDay(date: string) {
  const day = parseISO(date);
  if (isToday(day)) return "Today";
  if (isTomorrow(day)) return "Tomorrow";
  return format(day, "EEE d MMM");
}

function AdminPendingRequests() {
  const queryClient = useQueryClient();
  const today = format(new Date(), "yyyy-MM-dd");
  // no end date, so requests for every upcoming shift are included
  const { data: shifts, isLoading } =
    useGetShiftsWithStudentsAndRequesters(today);
  const assignMutation = useAssignStudentToShift();

  // shifts already come sorted by date and start time
  // skip shifts that already started, they can't be assigned anymore
  const requests: PendingRequest[] =
    shifts
      ?.filter((shift) => getShiftTiming(shift) === "upcoming")
      .flatMap((shift) =>
        shift.students_requesting.map((student) => ({ shift, student })),
      ) ?? [];

  function handleAssign({ shift, student }: PendingRequest) {
    assignMutation.mutate(
      { shiftId: shift.shift_id, userId: student.id, startDate: today },
      {
        onSuccess: () =>
          queryClient.invalidateQueries({ queryKey: ["adminStats"] }),
      },
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-cardBG col-span-2 h-120 rounded-lg">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="flex items-center gap-2 text-primaryText font-bold">
          Pending requests
          {requests.length > 0 && (
            <span className="rounded-full bg-pending/15 px-2 py-0.5 text-xs font-semibold text-pending">
              {requests.length}
            </span>
          )}
        </h2>
        <Link
          to="/admin/schedule"
          className="text-sm font-semibold text-secondaryText hover:text-primaryText"
        >
          View all
        </Link>
      </div>

      {isLoading && <p className="text-sm text-secondaryText">Loading...</p>}

      {!isLoading && requests.length === 0 && (
        <p className="text-sm text-secondaryText">No pending requests</p>
      )}

      {requests.length > 0 && (
        <ul className="flex flex-col gap-2 overflow-y-auto -mr-2 scrollbar-thumb-cardLighterBG scrollbar-track-cardBG">
          {requests.map((request) => {
            const { shift, student } = request;
            const isAssigning =
              assignMutation.isPending &&
              assignMutation.variables?.shiftId === shift.shift_id &&
              assignMutation.variables?.userId === student.id;

            return (
              <li
                key={`${shift.shift_id}-${student.id}`}
                className="mr-2 flex flex-wrap items-center gap-3 rounded-lg bg-studentCard px-3 py-2.5"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-darkBackground text-xs font-semibold text-primaryText">
                  {student.first_name[0]}
                  {student.last_name[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-primaryText">
                    {student.first_name} {student.last_name}
                  </p>
                  <p className="text-sm text-secondaryText">
                    {capitalize(shift.shift_type)} ·{" "}
                    {formatShiftDay(shift.date)}
                  </p>
                </div>
                <span className="text-xs text-secondaryText">
                  {shift.students_assigned.length} assigned
                </span>
                <button
                  type="button"
                  onClick={() => handleAssign(request)}
                  disabled={assignMutation.isPending}
                  className="min-h-10 rounded-lg border border-primary px-3.5 text-sm font-semibold text-primary cursor-pointer hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isAssigning ? "Assigning..." : "Assign"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default AdminPendingRequests;
