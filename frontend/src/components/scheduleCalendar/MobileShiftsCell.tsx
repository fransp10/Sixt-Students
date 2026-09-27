import { getInitials } from "../../helpers/helpers";
import type {
  ShiftType,
  ShiftWithStudentsAndRequesters,
} from "../../types/Shift";

function MobileShiftsCell({
  shiftType,
  shift,
  handleShiftClick,
}: {
  shiftType: ShiftType;
  shift?: ShiftWithStudentsAndRequesters;
  handleShiftClick: (shift?: ShiftWithStudentsAndRequesters) => void;
}) {
  const studentsToDisplay = shift?.students_assigned.slice(0, 2) ?? [];
  const remainingStudents =
    (shift?.students_assigned.length ?? 0) - studentsToDisplay.length;
  const timeToDisplay =
    shiftType === "morning"
      ? "07:00 - 15:00"
      : shiftType === "middle"
        ? "10:00 - 18:00"
        : "14:00 - 22:00";
  return (
    <div
      onClick={() => handleShiftClick(shift)}
      className="p-6 border border-l-18 border-l-primary h-62 border-borderDividers rounded-xl
      "
    >
      <div className="flex justify-between">
        <div>
          <p className="text-xl font-semibold">
            {shiftType[0].toUpperCase() + shiftType.slice(1, shiftType.length)}
          </p>
          <p className="text-sm text-secondaryText">{timeToDisplay}</p>
        </div>
        <div className="p-2 px-6  bg-borderDividers flex items-center justify-center rounded-full">
          <span className="text-sm">2/4</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        {shift?.students_assigned && shift?.students_assigned.length > 0
          ? studentsToDisplay.map((student) => (
              <div key={student.id} className="flex gap-2 items-center">
                <div className="w-8 h-8 rounded-full bg-surfaceCards flex items-center justify-center">
                  <span className="text-sm">
                    {getInitials(`${student.first_name} ${student.last_name}`)}
                  </span>
                </div>
                <span className="text-sm">{student.first_name}</span>
              </div>
            ))
          : ""}

        {remainingStudents > 0 && (
          <div className="flex gap-2 items-center">
            <div>
              <span>+{remainingStudents}</span>
            </div>
            <span>more</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MobileShiftsCell;
