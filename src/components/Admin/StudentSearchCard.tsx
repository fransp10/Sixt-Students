import { ArrowRightIcon } from "@heroicons/react/16/solid";
import InitialsIcon from "../InitialsIcon";

function StudentSearchCard() {
  return (
    <div className="flex flex-row  gap-1  border border-borderDividers cursor-pointer hover:bg-headersCalendar items-center justify-around px-4 pl-6">
      <InitialsIcon name="Student Name" size={42} />
      <div className="flex flex-col  flex-1 gap-0 p-4 justify-center text">
        <span className="text-primaryText">Student Name</span>
        <span className="text-secondaryText">Student email</span>
      </div>
      <ArrowRightIcon className="size-6 text-secondaryText " />
    </div>
  );
}

export default StudentSearchCard;
