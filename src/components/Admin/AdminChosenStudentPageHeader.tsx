import { PhoneIcon, UserIcon } from "@heroicons/react/24/outline";
import InitialsIcon from "../InitialsIcon";
import { useStudentsCtx } from "../../context/StudentsContext";

function AdminChosenStudentPageHeader() {
  const { openStudentSearch, selectedStudent } = useStudentsCtx();
  return (
    <div className="flex flex-row w-full bg-headersCalendar px-6 py-4 items-center justify-between border-b border-borderDividers  ">
      <div className="flex flex-row gap-4">
        <InitialsIcon name="Student Name" size={120} className="text-5xl" />
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-4 items-center">
            <span className="text-4xl">{selectedStudent?.name}</span>
            <span className="bg-green-600/50 px-2 py-1 rounded-xl text-green-200 ">
              Active
            </span>
          </div>

          <span className="text-xl text-secondaryText">
            {selectedStudent?.email}
          </span>
          <span className="text-xl text-secondaryText flex flex-row items-center ">
            <PhoneIcon className="size-4 text-secondaryText mr-2" />
            {selectedStudent?.phone}
          </span>
        </div>
      </div>
      <div className="flex items-center   flex-row gap-8 p-8 ">
        <div className="flex flex-col gap-2  ">
          <span className="text-secondaryText text-sm">Working since</span>
          <span className="text-lg px-2 py-1"> Feb 2024</span>
        </div>
      </div>
      <button
        onClick={openStudentSearch}
        className="flex flex-row items-center focus:outline-none  p-4 border border-borderDividers rounded-lg hover:cursor-pointer hover:bg-borderDividers transition-all duration-300"
      >
        <UserIcon className="size-4 text-primaryText mr-2" />
        <span className=" text-primaryText">Change Student</span>
      </button>
    </div>
  );
}

export default AdminChosenStudentPageHeader;
