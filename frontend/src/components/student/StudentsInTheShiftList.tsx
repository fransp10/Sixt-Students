import type { StudentAssigned } from "../../types/students";
import StudentsInTheShiftListItem from "./StudentsInTheShiftListItem";

function StudentsInTheShiftList({
  students,
}: {
  students: StudentAssigned[] | undefined;
}) {
  return (
    <div className="overflow-auto scrollbar-thin scrollbar-thumb-cardLighterBG h-96 text-primaryText">
      <ul className="flex flex-col gap-2 p-4 w-full">
        {students && students.length > 0 ? (
          students.map((student: StudentAssigned) => (
            <StudentsInTheShiftListItem key={student.id} student={student} />
          ))
        ) : (
          <p className="text-secondaryText text-sm flex justify-center items-center h-full w-full">
            No students are currently assigned to this shift.
          </p>
        )}
      </ul>
    </div>
  );
}

export default StudentsInTheShiftList;
