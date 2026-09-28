import { getAvatarColor, getInitials } from "../../helpers/helpers";
import type { StudentAssigned, StudentRequesting } from "../../types/students";

function StudentsInTheShiftListItem({
  student,
}: {
  student: StudentRequesting | StudentAssigned;
}) {
  const fullName = student?.first_name.concat(" ", student.last_name);
  return (
    <li className="flex items-center gap-3 rounded-lg bg-cardLighterBG px-3 py-2.5">
      <span
        className={`${getAvatarColor(Number(student.id))} text-sm font-semibold text-white rounded-full size-10 flex items-center justify-center`}
      >
        {getInitials(fullName)}
      </span>
      <span className="text-base">{fullName}</span>
    </li>
  );
}

export default StudentsInTheShiftListItem;
