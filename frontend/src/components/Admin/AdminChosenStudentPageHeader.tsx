import { PhoneIcon, UserIcon } from "@heroicons/react/24/outline";
import InitialsIcon from "../InitialsIcon";
import { useStudentsCtx } from "../../context/StudentsContext";
import type { Student } from "../../types/students";

function AdminChosenStudentPageHeader({
  selectedStudent,
}: {
  selectedStudent: Student | undefined;
}) {
  const { openStudentSearch } = useStudentsCtx();

  return (
    <div className="flex flex-col gap-6  w-full bg-headersCalendar px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between border-b border-borderDividers  ">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <InitialsIcon
          name="Student Name"
          size={120}
          className="text-3xl sm:text-4xl"
        />
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
            <span className="text-2xl sm:text-3xl lg:text-4xl">
              {selectedStudent?.name}
            </span>
            <span className="bg-green-600/50 px-2 py-1 rounded-xl text-green-200 ">
              Active
            </span>
          </div>

          <span className="break-all text-base sm:text-lg  lg:text-xl text-secondaryText">
            {selectedStudent?.email}
          </span>
          <span className="flex items-center text-base text-secondaryText sm:text-lg lg:text-xl">
            <PhoneIcon className="size-4 mr-2 shrink-0" />
            {selectedStudent?.phone}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1  ">
        <span className="text-secondaryText text-sm">Working since</span>
        <span className="text-base sm:text-lg px-2 py-1"> Feb 2024</span>
      </div>

      <button
        onClick={openStudentSearch}
        className="w-1/2 lg:w-auto flex flex-row items-center focus:outline-none p-4 border border-borderDividers rounded-lg hover:cursor-pointer hover:bg-borderDividers transition-all duration-300"
      >
        <UserIcon className="size-4 text-primaryText mr-2" />
        <span className=" text-primaryText">Change Student</span>
      </button>
    </div>
  );
}

export default AdminChosenStudentPageHeader;
