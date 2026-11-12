import type {
  StudentAssigned,
  StudentRequesting,
} from "../../../types/students";
import { capitalize } from "../../../helpers/capitalize";
import AvatarStack from "../../scheduleCalendar/AvatarStack";
import CellFrame from "./CellFrame";

function OtherStudentsCell({
  students,
  label,
  onClick,
  ariaLabel,
}: {
  students: StudentAssigned[] | StudentRequesting[];
  label: string;
  onClick: () => void;
  ariaLabel?: string;
}) {
  return (
    <CellFrame
      kind="others"
      label={capitalize(label)}
      onClick={onClick}
      ariaLabel={ariaLabel}
    >
      <div className="mt-auto">
        <AvatarStack kind="others" students={students} />
      </div>
    </CellFrame>
  );
}

export default OtherStudentsCell;
