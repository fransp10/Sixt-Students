import {
  PlusIcon,
  TrashIcon,
  UserCircleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import StudentScheduleCard from "./StudentScheduleCard";
export type AssignedStudentsProps = {
  header: "Assigned Students" | "Students requesting this shift";
};

function AssignedStudents({ header }: AssignedStudentsProps) {
  const Icon = header === "Assigned Students" ? TrashIcon : PlusIcon;
  const secondHeader =
    header === "Assigned Students"
      ? "People working this shift"
      : "Students who requested this";

  const HeaderIcon =
    header === "Assigned Students" ? UserCircleIcon : UserPlusIcon;
  return (
    <div className="min-w-0 flex-1   rounded-lg overflow-y-auto custom-scrollbar">
      {/* Sticky header */}
      <div className="sticky top-0 z-10  items-center gap-2 bg-cardBG p-4 font-semibold  ">
        <div className="flex items-center gap-6  ">
          <HeaderIcon className="size-12 text-primary" />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg">{header}</h1>
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-lg">
                4
              </span>
            </div>
            <span className="text-secondaryText text-sm">{secondHeader}</span>
          </div>
        </div>
      </div>
      {/* Students */}
      <div className="flex flex-col gap-2 p-4">
        <StudentScheduleCard icon={Icon} name="Student Name" initials="SN" />
        <StudentScheduleCard icon={Icon} name="Student Name" initials="SN" />
        <StudentScheduleCard icon={Icon} name="Student Name" initials="SN" />
        <StudentScheduleCard icon={Icon} name="Student Name" initials="SN" />
        <StudentScheduleCard icon={Icon} name="Student Name" initials="SN" />
      </div>
    </div>
  );
}

export default AssignedStudents;
