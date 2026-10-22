import { EnvelopeIcon, PhoneIcon, UserIcon } from "@heroicons/react/24/outline";
import InitialsIcon from "../InitialsIcon";
import { useStudentsCtx } from "../../hooks/auth/useStudentsContext";
import type { UserMeType } from "../../types/user";
import { format } from "date-fns";
import { formatPhone } from "../../helpers/formatPhoneNumber";

function AdminChosenStudentPageHeader({
  selectedStudent,
}: {
  selectedStudent: UserMeType | undefined;
}) {
  const { openStudentSearch } = useStudentsCtx();
  const fullName = `${selectedStudent?.first_name} ${selectedStudent?.last_name}`;
  const formattedWorkStartDate = selectedStudent?.created_at
    ? format(selectedStudent.created_at, "MMMM dd, yyyy")
    : "N/A";
  const formattedPhone = selectedStudent?.phone
    ? formatPhone(selectedStudent.phone)
    : "N/A";
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
            <span className="text-2xl sm:text-3xl lg:text-4xl">{fullName}</span>
            <span
              className={` px-2 py-1 rounded-xl text-green-200 ${
                selectedStudent?.is_active ? "bg-success/70" : "bg-warning"
              } `}
            >
              {selectedStudent?.is_active ? "Active" : "Inactive"}
            </span>
          </div>

          <span className="flex items-center text-base text-secondaryText sm:text-base lg:text-lg">
            <EnvelopeIcon className="size-4 mr-2 shrink-0" />
            {selectedStudent?.email ? selectedStudent.email : "email: N/A"}
          </span>
          <span className="flex items-center text-base text-secondaryText sm:text-base lg:text-lg">
            <PhoneIcon className="size-4 mr-2 shrink-0" />
            {formattedPhone}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1  ">
        <span className="text-secondaryText text-sm">Working since</span>
        <span className="text-base sm:text-lg px-2 py-1">
          {formattedWorkStartDate}
        </span>
      </div>

      <button
        onClick={openStudentSearch}
        className="lg:w-auto bg-studentCard flex flex-row items-center focus:outline-none p-4 border border-borderDividers rounded-lg hover:cursor-pointer hover:bg-borderDividers transition-all duration-300 justify-center lg:justify-start"
      >
        <UserIcon className="size-4 text-primaryText mr-2" />
        <span className=" text-primaryText justify-center">Change Student</span>
      </button>
    </div>
  );
}

export default AdminChosenStudentPageHeader;
