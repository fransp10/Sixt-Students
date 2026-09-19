import { UsersIcon } from "@heroicons/react/24/outline";

function EmptyCell({ onClick }: { onClick: () => void }) {
  return (
    <td
      onClick={onClick}
      className="h-36 cursor-pointer border border-borderDividers p-3 hover:bg-headersCalendar transition-all duration-300"
    >
      <div className="flex flex-col h-full w-full rounded-lg  border-dashed border-2 border-cardLighterBG items-center justify-center  ">
        <UsersIcon className="size-8 text-secondaryText" />
        <p className="text-center text-sm text-secondaryText">
          No requests or assignments
        </p>
        <p className="text-xs">Click to sign up </p>
        <span className="hidden text-secondaryText">+ Signup for shift</span>
      </div>
    </td>
  );
}

export default EmptyCell;
