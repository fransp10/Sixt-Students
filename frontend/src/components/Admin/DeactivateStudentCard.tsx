import {
  ExclamationTriangleIcon,
  UserMinusIcon,
} from "@heroicons/react/24/outline";
import { getFullName } from "../../helpers/helpers";
import type { Student } from "../../types/students";

function DeactivateStudentCard({
  student,
  handleDeactivateStudent,
}: {
  student: Student;
  handleDeactivateStudent: () => void;
}) {
  return (
    <div
      className="w-full bg-red-500/5 p-2 sm:p-4 rounded-lg flex flex-col gap-2 sm:gap-6 
    border-red-500/10 border"
    >
      <div className="flex items-center gap-2 sm:gap-4">
        <div className=" shrink-0 flex items-center justify-center w-12 h-12 bg-red-500/10 rounded-full">
          <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
        </div>
        <div className="flex flex-col">
          <p className="text-red-500">Danger zone</p>
          <p className="text-sm text-secondaryText">
            This action will delete the student.
          </p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row  md:items-center  w-full p-4 border rounded-lg border-red-500/10 gap-4">
        <div className="shrink-0 flex items-center justify-center w-12 h-12 bg-red-500/10 rounded-full">
          <UserMinusIcon className="w-8 h-8 text-red-500" />
        </div>
        <div className="flex flex-col ">
          <p className=" text-sm sm:text-base text-red-500">
            Deactivate student
          </p>
          <p className="text-xs sm:text-sm text-secondaryText">
            {getFullName(student)} will no longer be able to sign in or request
            shifts. You can reactivate their account later.
          </p>
        </div>
        <button
          onClick={handleDeactivateStudent}
          className="ml-auto w-full shrink-0 rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500 hover:text-white hover:cursor-pointer md:w-auto"
        >
          Deactivate student
        </button>
      </div>
    </div>
  );
}

export default DeactivateStudentCard;
