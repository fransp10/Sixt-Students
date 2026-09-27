import { TrashIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import StudentScheduleCard from "../StudentScheduleCard";
import type {
  StudentAssigned,
  StudentRequesting,
} from "../../../types/students";
export type AssignedStudentsProps = {
  header: "Assigned Students" | "Students requesting this shift";
  students?: StudentRequesting[] | StudentAssigned[];
  onClickAssignedStudents?: (studentId: number) => void;
};

function AdminModalAssignedSutdents({
  students,
  onClickAssignedStudents,
}: AssignedStudentsProps) {
  const numberOfAssignedStudents = students ? students.length : 0;

  return (
    <div className="min-w-0 flex-1 rounded-lg overflow-y-auto custom-scrollbar border border-borderDividers">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 items-center gap-2 p-4 font-semibold border-b border-success/30 bg-success/10">
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
      <div className="flex flex-col gap-2 p-4">
        {students && students.length > 0 ? (
          students.map((student) => (
            <StudentScheduleCard
              key={student.id}
              studentId={student.id}
              icon={TrashIcon}
              variant={"assigned"}
              name={`${student.first_name} ${student.last_name}`}
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
