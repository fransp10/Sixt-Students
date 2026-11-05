import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useId, useState } from "react";
import type { Attendance } from "../../../types/attendance";
import type { StudentAssigned } from "../../../types/students";
import { useUpdateShiftAssignmentTimes } from "../../../hooks/useUpdateShiftAssignmentTimes";

const ATTENDANCE_OPTIONS: {
  value: Attendance;
  label: string;
  activeClassName: string;
}[] = [
  {
    value: "full",
    label: "Full shift",
    activeClassName: "bg-success/15 text-success",
  },
  {
    value: "adjusted",
    label: "Adjusted",
    activeClassName: "bg-warning/15 text-warning",
  },
  {
    value: "no-show",
    label: "No show",
    activeClassName: "bg-danger/15 text-danger",
  },
];

const TIME_STEP_MINUTES = 60;

// "HH:mm" -> minutes since midnight
function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

// minutes since midnight -> "HH:mm"
function toTime(totalMinutes: number) {
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const minutes = String(totalMinutes % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function getTimeOptions(from: number, to: number) {
  const options: string[] = [];
  for (let minutes = from; minutes <= to; minutes += TIME_STEP_MINUTES) {
    options.push(toTime(minutes));
  }
  return options;
}

function formatDuration(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
}

type TimeSelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
};

function TimeSelect({
  label,
  value,
  options,
  onChange,
  disabled,
}: TimeSelectProps) {
  return (
    <label className="relative block h-12 flex-1 rounded-lg border border-borderDividers bg-cardBG transition-colors hover:border-secondaryText focus-within:border-primary">
      <span className="pointer-events-none absolute left-3 top-1.5 text-xs text-secondaryText">
        {label}
      </span>

      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 cursor-pointer appearance-none rounded-lg bg-transparent px-3 pt-4 text-sm font-semibold text-primaryText outline-none [&>option]:bg-darkBackground
        disabled:cursor-not-allowed disabled:text-secondaryText disabled:opacity-50"
      >
        {options.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>

      <ChevronDownIcon className="pointer-events-none absolute bottom-2.5 right-2 size-4 text-secondaryText" />
    </label>
  );
}

type AdminStudentTimeManagementProps = {
  scheduledStart: string; // "HH:mm"
  scheduledEnd: string; // "HH:mm"
  student: StudentAssigned;
  shiftId: number;
};

function AdminStudentTimeManagement({
  scheduledStart,
  scheduledEnd,
  student,
  shiftId,
}: AdminStudentTimeManagementProps) {
  const radioGroupName = useId();
  const shiftStart = toMinutes(scheduledStart);
  const shiftEnd = toMinutes(scheduledEnd);

  //   16:00
  let initialAttendance: Attendance = "full";

  if (
    student.no_show &&
    student.actual_start_time === null &&
    student.actual_end_time === null
  ) {
    initialAttendance = "no-show";
  }

  // No-shows have no times, so fall back to the schedule for the pickers
  const studentActualStartTime = student.actual_start_time
    ? toMinutes(student.actual_start_time)
    : shiftStart;
  const studentActualEndTime = student.actual_end_time
    ? toMinutes(student.actual_end_time)
    : shiftEnd;

  const areShiftTimesDifferent =
    studentActualStartTime !== shiftStart || studentActualEndTime !== shiftEnd;
  if (areShiftTimesDifferent && initialAttendance === "full") {
    initialAttendance = "adjusted";
  }

  const [attendance, setAttendance] = useState<Attendance>(initialAttendance);
  const [arrivedAt, setArrivedAt] = useState(studentActualStartTime);
  const [leftAt, setLeftAt] = useState(studentActualEndTime);
  const [isEditable, setIsEditable] = useState(false);
  const { mutate: updateShiftAssignmentTimes } =
    useUpdateShiftAssignmentTimes();

  function handleArrivedChange(time: string) {
    const minutes = toMinutes(time);
    setArrivedAt(minutes);
    // Keep "left" after "arrived"
    if (leftAt <= minutes) setLeftAt(minutes + TIME_STEP_MINUTES);
  }

  function handleConfirmChanges() {
    setIsEditable(false);
    if (leftAt - arrivedAt === shiftEnd - shiftStart) {
      handleAttendanceChange("full");
    } else
      updateShiftAssignmentTimes({
        userId: student.id,
        shiftId: shiftId,
        arrivedAt: toTime(arrivedAt),
        leftAt: toTime(leftAt),
        no_show: false,
      });
  }

  function handleAttendanceChange(newAttendance: Attendance) {
    setAttendance(newAttendance);
    if (newAttendance === "full") {
      setArrivedAt(shiftStart);
      setLeftAt(shiftEnd);
      updateShiftAssignmentTimes({
        userId: student.id,
        shiftId: shiftId,
        arrivedAt: toTime(shiftStart),
        leftAt: toTime(shiftEnd),
        no_show: false,
      });
    }
    if (newAttendance === "no-show") {
      setArrivedAt(shiftStart);
      setLeftAt(shiftEnd);
      updateShiftAssignmentTimes({
        userId: student.id,
        shiftId: shiftId,
        arrivedAt: toTime(shiftStart),
        leftAt: toTime(shiftEnd),
        no_show: true,
      });
    }
  }

  let minutesWorked = shiftEnd - shiftStart;
  if (attendance === "adjusted") minutesWorked = leftAt - arrivedAt;
  if (attendance === "no-show") minutesWorked = 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div
          role="radiogroup"
          className="flex flex-1 lg:flex-initial gap-1 rounded-lg border border-borderDividers bg-cardBG p-1"
        >
          {ATTENDANCE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex-1 lg:flex-initial text-center lg:text-start cursor-pointer rounded-md px-3 py-2.5 lg:py-1.5 text-xs font-semibold transition-colors has-focus-visible:ring-2 has-focus-visible:ring-primary ${
                attendance === option.value
                  ? option.activeClassName
                  : "text-secondaryText hover:text-primaryText"
              }`}
            >
              <input
                type="radio"
                name={radioGroupName}
                value={option.value}
                checked={attendance === option.value}
                onChange={() => handleAttendanceChange(option.value)}
                className="hidden"
              />
              {option.label}
            </label>
          ))}
        </div>

        <span className="shrink-0 text-sm text-secondaryText">
          <span className="font-semibold text-primaryText">
            {formatDuration(minutesWorked)}
          </span>{" "}
          / {formatDuration(shiftEnd - shiftStart)}
        </span>
      </div>
      {/* {attendance === "adjusted" && (

      )} */}
      {attendance === "adjusted" && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <TimeSelect
              label="Arrived"
              disabled={!isEditable}
              value={toTime(arrivedAt)}
              options={getTimeOptions(shiftStart, shiftEnd - TIME_STEP_MINUTES)}
              onChange={handleArrivedChange}
            />
            <TimeSelect
              label="Left"
              disabled={!isEditable}
              value={toTime(leftAt)}
              options={getTimeOptions(arrivedAt + TIME_STEP_MINUTES, shiftEnd)}
              onChange={(time) => setLeftAt(toMinutes(time))}
            />
            <button
              onClick={() => setIsEditable((prev) => !prev)}
              className={`overflow-hidden whitespace-nowrap text-xs cursor-pointer rounded-lg bg-surfaceCards hover:bg-surfaceCards/40 text-primaryText font-semibold transition-all duration-300 ${
                isEditable
                  ? "w-0 -ml-2 opacity-0 pointer-events-none"
                  : "w-14 ml-0 opacity-100"
              }`}
            >
              Edit
            </button>
          </div>
          <div
            className={`grid transition-[grid-template-rows,opacity] duration-200 ${
              isEditable
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditable(false)}
                  className="flex-1 h-10 border bg-surfaceCards border-borderDividers cursor-pointer rounded-lg hover:bg-surfaceCards/40  text-primaryText font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmChanges}
                  className="flex-1 h-10 bg-primary/80 cursor-pointer rounded-lg hover:bg-primary/60 text-primaryText font-semibold transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminStudentTimeManagement;
