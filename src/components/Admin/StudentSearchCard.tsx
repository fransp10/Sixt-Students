import { ArrowRightIcon } from "@heroicons/react/16/solid";
import InitialsIcon from "../InitialsIcon";
import type { Student } from "../../types/students";
import { useStudentsCtx } from "../../context/StudentsContext";

type StudentSearchCardProps = {
  student: Student;
};

function StudentSearchCard({ student }: StudentSearchCardProps) {
  const { selectStudent } = useStudentsCtx();
  return (
    <button
      onClick={() => selectStudent(student)}
      className="flex flex-row  gap-1  border border-borderDividers cursor-pointer hover:bg-headersCalendar items-center  px-4 pl-6"
    >
      <InitialsIcon name="Student Name" size={42} />
      <div className="flex flex-col  flex-1 gap-0 p-4 items-start text">
        <span className="text-primaryText">{student.name}</span>
        <span className="text-secondaryText">{student.email}</span>
      </div>
      <ArrowRightIcon className="size-6 text-secondaryText " />
    </button>
  );
}

export default StudentSearchCard;
