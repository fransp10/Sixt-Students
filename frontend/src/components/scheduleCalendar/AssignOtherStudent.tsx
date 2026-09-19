import { UserPlusIcon, UsersIcon } from "@heroicons/react/24/outline";

function AssignOtherStudent() {
  return (
    <div className="flex gap-4 items-center  border-2 rounded-xl border-borderDividers border-dashed p-4">
      {/* {Icon} */}
      <UsersIcon className="size-16 p-2  rounded-full text-primary bg-primary/20 " />
      {/* Text */}
      <div className="flex flex-col gap-1  ">
        <span className="text-primaryText font-bold">Need someone else?</span>
        <span className="text-secondaryText text-sm">
          Assign a student who didn't request this shift.
        </span>
      </div>
      <button className="ml-auto mr-2 border border-primary b-2 rounded-xl p-4 hover:cursor-pointer hover:bg-primary hover:text-primaryText text-primary transition-all duration-300 flex flex-row gap-2">
        <UserPlusIcon className="size-6 " />
        <span>Assign other student</span>
      </button>
    </div>
  );
}

export default AssignOtherStudent;
