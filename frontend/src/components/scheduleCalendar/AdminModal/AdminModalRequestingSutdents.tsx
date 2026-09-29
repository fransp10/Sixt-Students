import { UserPlusIcon } from "@heroicons/react/24/outline";
import type { StudentRequesting } from "../../../types/students";
import RequestingStudentScheduleCard from "./ScheduleCardTypes/RequestingStudentScheduleCard";
export type AssignedStudentsProps = {
  students?: StudentRequesting[];
  onClickRequestingStudent?: (studentId: number) => void;
};

function AdminModalRequestingSutdentsList({
  students,
  onClickRequestingStudent,
}: AssignedStudentsProps) {
  const numberOfAssignedStudents = students ? students.length : 0;

  return (
    <div className="min-w-0 flex-1 flex flex-col rounded-lg  border border-borderDividers">
      {/* Sticky header */}
      <div className="items-center  gap-2 p-4 font-semibold border-b border-pending/30 bg-pending/10 ">
        <div className="flex items-center gap-6  ">
          <UserPlusIcon className="size-12 text-pending" />
          <div className="flex flex-col gap-1 ">
            <div className="flex items-center gap-2">
              <h1 className="text-lg">Students requesting this shift</h1>
              <span
                className={
                  "flex size-8 items-center justify-center rounded-full bg-pending/20 text-pending text-lg font-semibold"
                }
              >
                {numberOfAssignedStudents}
              </span>
            </div>
            <span className="text-secondaryText text-sm">
              Students requesting this shift
            </span>
          </div>
        </div>
      </div>
      {/* Students */}
      <div className="flex flex-col gap-2  p-4 flex-1 overflow-y-auto scrollbar-thin  scrollbar-track-transparent scrollbar-thumb-borderDividers hover:scrollbar-thumb-borderDividers">
        {students && students.length > 0 ? (
          students.map((student) => (
            <RequestingStudentScheduleCard
              key={student.id}
              student={student}
              onClick={onClickRequestingStudent}
            />
          ))
        ) : (
          <p className="text-secondaryText text-base font-semibold flex items-center justify-center h-full">
            No students are currently requesting this shift.
          </p>
        )}
      </div>
    </div>
  );
}

export default AdminModalRequestingSutdentsList;
