import { getInitials } from "../../helpers/helpers";

type StudentsScheduleCalendarCellProps = {
  date: string;
  shiftType: string;
  onClick: () => void;
  shift?: {
    id: number;
    date: string;
    type: string;
    students: { id: number; name: string }[];
  };
};

function StudentsShceduleCalendarCell({
  shift,
  onClick,
}: StudentsScheduleCalendarCellProps) {
  if (shift?.students) {
    let leftOverStudents: number | undefined;
    let studentsToShow = shift.students;
    if (shift.students.length >= 3) {
      leftOverStudents = shift.students.length - 3;
      studentsToShow = shift.students.slice(0, 3);
    }

    return (
      <div
        onClick={onClick}
        className="h-36 w-full relative flex  items-center hover:cursor-pointer group  text-primaryText border border-borderDividers p-2"
      >
        <div className="group-hover:opacity-0  transition-opacity duration-300 flex flex-col gap-1">
          {studentsToShow.map((student) => (
            <div key={student.id} className="flex gap-2 items-center ">
              <span className="bg-surfaceCards text-sm rounded-full size-6 flex items-center justify-center">
                {getInitials(student.name)}
              </span>
              <span className="text-sm">{student.name}</span>
            </div>
          ))}
          {leftOverStudents && <p>+ {leftOverStudents} more</p>}
        </div>
        <div className="flex justify-center items-center absolute inset-0 opacity-0 group-hover:opacity-100 hover:bg-headersCalendar transition-all duration-300">
          Details
        </div>
      </div>
    );
  }
  return (
    <div
      onClick={onClick}
      className="h-36 w-full text-primaryText border border-borderDividers  items-center justify-center flex hover:cursor-pointer hover:bg-headersCalendar transition-all duration-300  p-2 group  "
    >
      <span className="opacity-0 group-hover:opacity-100 transition-all duration-300">
        + Signup for shift
      </span>
    </div>
  );
}

export default StudentsShceduleCalendarCell;
