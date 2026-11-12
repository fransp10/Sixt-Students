import { UserPlusIcon } from "@heroicons/react/24/outline";
import { getFullName } from "../../helpers/helpers";
import type { UserWithoutPassword } from "../../types/user";
import { ShieldExclamationIcon } from "@heroicons/react/16/solid";

type ActivateStudentCardProps = {
  student: UserWithoutPassword;
  handleActivateStudent: () => void;
};
function ActivateStudentCard({
  student,
  handleActivateStudent,
}: ActivateStudentCardProps) {
  return (
    <div
      className="w-full bg-warning/5 p-2 sm:p-4 rounded-lg flex flex-col gap-2 sm:gap-6 
    border-warning/10 border"
    >
      <div className="flex items-center gap-2 sm:gap-4">
        <div className=" shrink-0 flex items-center justify-center w-12 h-12 bg-warning/10 rounded-full">
          <ShieldExclamationIcon className="w-8 h-8 text-warning" />
        </div>
        <div className="flex flex-col">
          <p className="text-warning">Danger zone</p>
          <p className="text-sm text-secondaryText">
            This action will set the student to be active.
          </p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row  md:items-center  w-full p-4 border rounded-lg border-warning/10 gap-4">
        <div className="shrink-0 flex items-center justify-center w-12 h-12 bg-warning/10 rounded-full">
          <UserPlusIcon className="w-8 h-8 text-warning" />
        </div>
        <div className="flex flex-col ">
          <p className=" text-sm sm:text-base text-warning">Activate student</p>
          <p className="text-xs sm:text-sm text-secondaryText">
            {getFullName(student)} will be able to sign in and request shifts.
            You can deactivate their account again in the future.
          </p>
        </div>
        <button
          onClick={handleActivateStudent}
          className="ml-auto w-full shrink-0 rounded-lg border border-warning px-4 py-2 text-sm font-medium text-warning transition-colors hover:bg-warning hover:text-white hover:cursor-pointer md:w-auto"
        >
          Activate student
        </button>
      </div>
    </div>
  );
}

export default ActivateStudentCard;
