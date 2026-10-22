import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useGetShiftsWithStudentsAndRequesters } from "../../hooks/auth/useGetShiftsWithStudentsAndRequesters";
import { getShiftTiming, type ShiftTiming } from "../../helpers/shiftTiming";
import { capitalize } from "../../helpers/capitalize";
import type { ShiftWithStudentsAndRequesters } from "../../types/Shift";

const timingStyles: Record<
  ShiftTiming,
  { text: string; dot: string; border: string }
> = {
  ended: {
    text: "text-success",
    dot: "bg-success",
    border: "border-transparent",
  },
  active: {
    text: "text-primary",
    dot: "bg-primary",
    border: "border-primary/40",
  },
  upcoming: {
    text: "text-pending",
    dot: "bg-pending",
    border: "border-transparent",
  },
};

function timingLabel(
  shift: ShiftWithStudentsAndRequesters,
  timing: ShiftTiming,
) {
  if (timing === "ended") return "Finished";
  if (timing === "active") return "In progress";
  return `Starts ${shift.scheduled_start_time}`;
}

function TodayShiftRow({ shift }: { shift: ShiftWithStudentsAndRequesters }) {
  const timing = getShiftTiming(shift);
  const styles = timingStyles[timing];
  const assigned = shift.students_assigned;

  return (
    <li
      className={`flex flex-col gap-3 rounded-lg border bg-studentCard p-4 ${styles.border}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="font-semibold text-primaryText">
            {capitalize(shift.shift_type)}
          </p>
          <p className="text-xs text-secondaryText">
            {shift.scheduled_start_time}–{shift.scheduled_end_time}
          </p>
        </div>
        <span
          className={`flex items-center gap-1.5 text-xs font-semibold ${styles.text}`}
        >
          <span className={`size-2 rounded-full ${styles.dot}`} />
          {timingLabel(shift, timing)}
          {assigned.length > 0 && ` · ${assigned.length}`}
        </span>
      </div>

      {assigned.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {assigned.map((student) => (
            <span
              key={student.id}
              title={`${student.first_name} ${student.last_name}${student.no_show ? " (no-show)" : ""}`}
              className={`flex size-8 items-center justify-center rounded-full bg-darkBackground text-[11px] font-semibold text-primaryText ${student.no_show ? "opacity-40 line-through" : ""}`}
            >
              {student.first_name[0]}
              {student.last_name[0]}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-warning">No students assigned</p>
      )}
    </li>
  );
}

function AdminTodayShifts() {
  const today = format(new Date(), "yyyy-MM-dd");
  const { data: shifts, isLoading } = useGetShiftsWithStudentsAndRequesters(
    today,
    today,
  );

  return (
    <div className="flex flex-col gap-4 p-4 bg-cardBG col-span-2 h-120 rounded-lg">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-primaryText font-bold">Today</h2>
        <Link
          to="/admin/schedule"
          className="text-sm font-semibold text-secondaryText hover:text-primaryText"
        >
          Open schedule
        </Link>
      </div>

      {isLoading && <p className="text-sm text-secondaryText">Loading...</p>}

      {!isLoading && !shifts?.length && (
        <p className="text-sm text-secondaryText">No shifts today</p>
      )}

      {!!shifts?.length && (
        <ul className="flex flex-col gap-2.5 overflow-y-auto">
          {shifts.map((shift) => (
            <TodayShiftRow key={shift.shift_id} shift={shift} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminTodayShifts;
