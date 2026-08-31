import { PhoneIcon } from "@heroicons/react/24/outline";
import InitialsIcon from "../InitialsIcon";

function AdminChosenStudentPageHeader() {
  return (
    <div className="flex flex-row items-center justify-between border-b border-borderDividers pb-4 ">
      <div className="flex flex-row gap-4">
        <InitialsIcon name="Student Name" size={120} className="text-5xl" />
        <div className="flex flex-col gap-2">
          <span className="text-4xl">Student Name</span>
          <span className="text-xl text-secondaryText">
            student.email@gmail.com
          </span>
          <span className="text-xl text-secondaryText flex flex-row items-center ">
            <PhoneIcon className="size-4 text-secondaryText mr-2" />
            +385 91 123 4567
          </span>
        </div>
      </div>
      <div className="flex flex-row gap-8 p-8 ">
        <div className="flex flex-col gap-2 ">
          <span className="text-secondaryText">Working since</span>
          <span> Feb 2024</span>
        </div>
        <div className="flex flex-col gap-2 ">
          <span className="text-secondaryText">Status</span>
          <span className="bg-green-600/50 px-2 py-1 rounded-xl text-green-200 ">
            Active
          </span>
        </div>
      </div>
    </div>
  );
}

export default AdminChosenStudentPageHeader;
