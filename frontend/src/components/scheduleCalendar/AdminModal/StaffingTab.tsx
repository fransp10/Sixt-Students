import { endOfWeek, format, startOfWeek } from "date-fns";
import { useAssignStudentToShift } from "../../../hooks/auth/useAssignStudentToShift";
import { useUnAssignStudentFromShift } from "../../../hooks/auth/useUnAssignStudentFromShift";
import AdminModalAssignedSutdents from "./AdminModalAssignedSutdents";
import AdminModalRequestingSutdentsList from "./AdminModalRequestingSutdents";
import type { UserMeType } from "../../../types/user";
import AssignOtherStudent from "../AssignOtherStudent";
import type { ShiftWithStudentsAndRequesters } from "../../../types/Shift";

function StaffingTab({ shift }: { shift: ShiftWithStudentsAndRequesters }) {
  const assignStudentToShift = useAssignStudentToShift();
  const unAssignStudentFromShift = useUnAssignStudentFromShift();

  const startDate = format(
    startOfWeek(shift.date, { weekStartsOn: 1 }),
    "yyyy-MM-dd",
  );
  const endDate = format(
    endOfWeek(shift.date, { weekStartsOn: 1 }),
    "yyyy-MM-dd",
  );

  const handleClickAssignOtherStudent = (student: UserMeType) => {
    assignStudentToShift.mutate({
      shiftId: shift.shift_id,
      userId: student.id,
      startDate: startDate,
      endDate: endDate,
      student: {
        id: student.id,
        first_name: student.first_name,
        last_name: student.last_name,
        username: student.username,
      },
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
  const handleClickAssignStudent = (userId: number) => {
    assignStudentToShift.mutate({
      shiftId: shift.shift_id,
      userId: userId,
      startDate: startDate,
      endDate: endDate,
    });
  };

  return (
    <>
      {/* basis-0 so the lists' content doesn't stretch the modal; min-h-72 is how far they can shrink before the modal scrolls instead */}
      {/* below lg the lists stack and keep their full height; the modal scrolls instead */}
      <div className="flex flex-col shrink-0 lg:flex-row lg:shrink lg:basis-0 lg:min-h-102  gap-4 mb-4">
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
      <AssignOtherStudent
        assignedIds={shift.students_assigned.map((s) => s.id)}
        requestingIds={shift.students_requesting.map((s) => s.id)}
        pendingUserId={
          assignStudentToShift.isPending
            ? assignStudentToShift.variables?.userId
            : undefined
        }
        onAssign={handleClickAssignOtherStudent}
      />
    </>
  );
}

export default StaffingTab;
