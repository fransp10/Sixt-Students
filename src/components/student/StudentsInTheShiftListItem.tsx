import { getInitials } from "../../helpers/helpers";

function StudentsInTheShiftListItem({
  student,
}: {
  student: { id: number; name: string };
}) {
  return (
    <li className="flex items-center gap-3 rounded-lg bg-cardLighterBG px-3 py-2.5">
      <span className="bg-headersCalendar text-sm rounded-full size-10  flex items-center justify-center">
        {getInitials(student?.name)}
      </span>
      <span className="text-base">{student.name}</span>
    </li>
  );
}

export default StudentsInTheShiftListItem;
