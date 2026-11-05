import { getAvatarColor, getInitials } from "../../../helpers/helpers";
import type { StudentAssigned } from "../../../types/students";
import AdminStudentTimeManagement from "./AdminStudentTimeManagement";
import type { ShiftWithStudentsAndRequesters } from "../../../types/Shift";

function AttendanceTabCard({
  student,
  shift,
}: {
  student: StudentAssigned;
  shift: ShiftWithStudentsAndRequesters;
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:gap-0 justify-between p-3 bg-studentCard border rounded-xl border-borderDividers">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 gap-3 items-center">
          <span
            className={`${getAvatarColor(student.id)} text-base font-semibold size-10 rounded-full flex items-center justify-center text-white shrink-0`}
          >
            {getInitials(student.first_name + " " + student.last_name)}
          </span>
          <span className="text-lg truncate">
            {student.first_name + " " + student.last_name}
          </span>
        </div>
      </div>

      <AdminStudentTimeManagement
        student={student}
        shiftId={shift.shift_id}
        scheduledStart={shift.scheduled_start_time}
        scheduledEnd={shift.scheduled_end_time}
      />
    </div>
  );
}

export default AttendanceTabCard;
