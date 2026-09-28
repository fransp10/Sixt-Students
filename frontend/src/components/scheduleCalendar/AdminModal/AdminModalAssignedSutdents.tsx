import { UserCircleIcon } from "@heroicons/react/24/outline";
import type { StudentAssigned } from "../../../types/students";
import AssignedStudentScheduleCard from "./ScheduleCardTypes/AssignedStudentScheduleCard";
export type AssignedStudentsProps = {
  header: "Assigned Students" | "Students requesting this shift";
  students?: StudentAssigned[];
  scheduledStart: string;
  scheduledEnd: string;
  onClickAssignedStudents?: (studentId: number) => void;
  shiftId: number;
};

function AdminModalAssignedSutdents({
  students,
  scheduledStart,
  scheduledEnd,
  onClickAssignedStudents,
  shiftId,
}: AssignedStudentsProps) {
  const numberOfAssignedStudents = students ? students.length : 0;

  return (
    <div className="min-w-0 flex-1 rounded-lg flex flex-col border border-borderDividers">
      {/* Sticky header */}
      <div className="sticky top-0 z- items-center gap-2 p-4 font-semibold border-b border-success/30 bg-success/10">
        <div className="flex items-center gap-6  ">
          <UserCircleIcon className="size-12 text-success text-succes" />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg">Assigned Students</h1>
              <span className="flex size-8 items-center justify-center rounded-full bg-success/20 text-success text-lg font-semibold">
                {numberOfAssignedStudents}
              </span>
            </div>
            <span className="text-secondaryText text-sm">
              People working this shift
            </span>
          </div>
        </div>
      </div>
      {/* Students */}
      <div className="flex flex-col gap-2 p-4 flex-1 overflow-y-auto scrollbar-thin  scrollbar-track-transparent scrollbar-thumb-borderDividers hover:scrollbar-thumb-borderDividers">
        {students && students.length > 0 ? (
          students.map((student) => (
            <AssignedStudentScheduleCard
              shiftId={shiftId}
              key={student.id}
              student={student}
              scheduledStart={scheduledStart}
              scheduledEnd={scheduledEnd}
              onClick={onClickAssignedStudents}
            />
          ))
        ) : (
          <p className="text-secondaryText text-sm">
            No students are currently assigned to this shift.{" "}
          </p>
        )}
      </div>
    </div>
  );
}

export default AdminModalAssignedSutdents;
