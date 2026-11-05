import type { StudentRequesting } from "../../types/students";
import StudentsInTheShiftListItem from "./StudentsInTheShiftListItem";

type StudentsRequestingShfitListProps = {
  studentsRequestingThisShift: StudentRequesting[] | undefined;
};

function StudentsRequestingShfitList({
  studentsRequestingThisShift,
}: StudentsRequestingShfitListProps) {
  return (
    <div className="overflow-auto scrollbar-thin scrollbar-thumb-cardLighterBG lg:h-96 text-primaryText">
      <ul className="flex flex-col gap-2 p-2 lg:p-4 w-full">
        {studentsRequestingThisShift &&
        studentsRequestingThisShift.length > 0 ? (
          studentsRequestingThisShift.map((student: StudentRequesting) => (
            <StudentsInTheShiftListItem key={student.id} student={student} />
          ))
        ) : (
          <p className="text-secondaryText text-sm">
            No students are currently requesting this shift.
          </p>
        )}
      </ul>
    </div>
  );
}

export default StudentsRequestingShfitList;
