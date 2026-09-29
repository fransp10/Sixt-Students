import { CheckIcon, PlusIcon } from "@heroicons/react/24/outline";
import { getAvatarColor, getInitials } from "../../../helpers/helpers";
import type { UserMeType } from "../../../types/user";

type AssignOtherStudentsCardProps = {
  student: UserMeType;
  isAssigned: boolean;
  isPending: boolean;
  handleAssign: (student: UserMeType) => void;
};

function AssignOtherStudentsCard({
  student,
  isAssigned,
  isPending,
  handleAssign,
}: AssignOtherStudentsCardProps) {
  const studentName = `${student.first_name} ${student.last_name}`;
  return (
    <div
      key={student.id}
      className="flex items-center gap-3 rounded-xl   bg-studentCard p-2 transition-colors hover:border-surfaceCards"
    >
      <span
        className={`${getAvatarColor(student.id)} flex size-10 shrink-0 items-center justify-center rounded-full text-base font-semibold text-white`}
      >
        {getInitials(studentName)}
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="truncate">{studentName}</span>
        <span className="truncate text-xs text-secondaryText">
          @{student.username}
        </span>
      </div>

      {isAssigned ? (
        <span className="ml-auto mr-2 flex items-center gap-1 text-sm text-success">
          <CheckIcon className="size-5" />
          Assigned
        </span>
      ) : (
        <button
          onClick={() => handleAssign(student)}
          disabled={isPending}
          className="ml-auto mr-2 flex cursor-pointer items-center gap-1 rounded-xl border border-primary px-4 py-2 text-sm text-primary transition-all duration-300 hover:bg-primary hover:text-primaryText disabled:cursor-wait disabled:opacity-60"
        >
          <PlusIcon className="size-4" />
          {isPending ? "Assigning…" : "Assign"}
        </button>
      )}
    </div>
  );
}

export default AssignOtherStudentsCard;
