import { getAvatarColor, getInitials } from "../../helpers/helpers";
import type {
  Student,
  StudentAssigned,
  StudentRequesting,
} from "../../types/students";

function StudentsInTheShiftListItem({
  student,
}: {
  student: Student | StudentRequesting | StudentAssigned;
}) {
  return (
    <li className="flex items-center gap-3 rounded-lg bg-cardLighterBG px-3 py-2.5">
      <span
        className={`${getAvatarColor(Number(student.id))} text-sm font-semibold text-white rounded-full size-10 flex items-center justify-center`}
      >
        {getInitials(student.first_name.concat(" ", student.last_name))}
      </span>
      <span className="text-base">
        {student?.first_name.concat(" ", student.last_name)}
      </span>
    </li>
  );
}

export default StudentsInTheShiftListItem;
