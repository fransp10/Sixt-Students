import type { UserMeType } from "../../types/user";
import StudentSearchCard from "./StudentSearchCard";

function AdminStudentSearchResults({
  students,
  isLoading,
}: {
  students: UserMeType[] | undefined;
  isLoading: boolean;
}) {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!students || students.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-secondaryText">No students found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-4 pt-0">
      {students?.map((student: UserMeType) => (
        <StudentSearchCard key={student?.id} student={student} />
      ))}
    </div>
  );
}

export default AdminStudentSearchResults;
