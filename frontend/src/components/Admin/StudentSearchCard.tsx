import { ArrowRightIcon } from "@heroicons/react/16/solid";
import InitialsIcon from "../InitialsIcon";
import { useNavigate } from "react-router-dom";
import { useStudentsCtx } from "../../hooks/auth/useStudentsContext";
import type { UserMeType } from "../../types/user";

type StudentSearchCardProps = {
  student: UserMeType;
};

function StudentSearchCard({ student }: StudentSearchCardProps) {
  const { closeStudentSearch } = useStudentsCtx();
  const navigate = useNavigate();
  function handleStudentClick(student: UserMeType) {
    navigate(`/admin/students/${student?.id}`);
    closeStudentSearch();
  }
  const studentFullName = `${student?.first_name} ${student?.last_name}`;
  return (
    <button
      onClick={() => handleStudentClick(student)}
      className="flex flex-row  gap-1  border border-borderDividers cursor-pointer hover:bg-headersCalendar items-center  px-4 pl-6"
    >
      <InitialsIcon name={studentFullName} size={42} />
      <div className="flex flex-col  flex-1 gap-0 p-4 items-start text">
        <span className="text-primaryText">{studentFullName}</span>
        <span className="text-secondaryText">{student?.email}</span>
      </div>
      <ArrowRightIcon className="size-6 text-secondaryText " />
    </button>
  );
}

export default StudentSearchCard;
