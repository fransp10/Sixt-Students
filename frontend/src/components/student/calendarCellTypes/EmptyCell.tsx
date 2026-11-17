import { UsersIcon } from "@heroicons/react/24/outline";
import CellFrame from "./CellFrame";

function EmptyCell({ onClick }: { onClick: () => void }) {
  return (
    <CellFrame kind="empty" hideHeader onClick={onClick}>
      <span className="flex flex-1 flex-col items-center justify-center gap-1 text-center">
        <UsersIcon className="size-6 text-icons" />
        <span className="text-xs text-secondaryText">
          No requests or assignments
        </span>
        <span className="text-xs font-medium text-primaryText">
          Click to sign up
        </span>
      </span>
    </CellFrame>
  );
}

export default EmptyCell;
