import { fakeStudents } from "../../helpers/helpers";
import type { Student } from "../../types/students";
import StudentSearchCard from "./StudentSearchCard";

function AdminStudentSearchResults() {
  return (
    <div className="flex flex-col gap-2 p-4 pt-0">
      {fakeStudents.map((student: Student) => (
        <StudentSearchCard key={student.id} student={student} />
      ))}
    </div>
  );
}

export default AdminStudentSearchResults;
