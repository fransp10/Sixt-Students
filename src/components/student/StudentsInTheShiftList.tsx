import StudentsInTheShiftListItem from "./StudentsInTheShiftListItem";

type StudentsInTheShiftListProps = {
  shift: {
    date: string;
    shiftType: string;
    shift?: {
      id: number;
      date: string;
      type: string;
      students: { id: number; name: string }[];
    };
  };
};

function StudentsInTheShiftList({ shift }: StudentsInTheShiftListProps) {
  return (
    <div className="overflow-auto scrollbar-thin scrollbar-thumb-cardLighterBG h-96">
      <ul className="flex flex-col gap-2 p-4 w-full">
        {shift.shift?.students.map((student) => (
          <StudentsInTheShiftListItem key={student.id} student={student} />
        ))}
      </ul>
    </div>
  );
}

export default StudentsInTheShiftList;
