import { PlusIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import type { StudentRequesting } from "../../../types/students";
import StudentScheduleCard from "../StudentScheduleCard";
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
    <div className="min-w-0 flex-1 rounded-lg overflow-y-auto custom-scrollbar border border-borderDividers">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 items-center gap-2 p-4 font-semibold border-b border-pending/30 bg-pending/10">
        <div className="flex items-center gap-6  ">
          <UserPlusIcon className="size-12 text-pending" />
          <div className="flex flex-col gap-1">
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
      <div className="flex flex-col gap-2 p-4">
        {students && students.length > 0 ? (
          students.map((student) => (
            <StudentScheduleCard
              key={student.id}
              studentId={student.id}
              icon={PlusIcon}
              variant={"requesting"}
              name={`${student.first_name} ${student.last_name}`}
              onClick={onClickRequestingStudent}
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

export default AdminModalRequestingSutdentsList;
