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
}: {
  students: StudentAssigned[] | StudentRequesting[];
  label: string;
  onClick: () => void;
}) {
  return (
    <CellFrame kind="others" label={capitalize(label)} onClick={onClick}>
      <div className="mt-auto">
        <AvatarStack kind="others" students={students} />
      </div>
    </CellFrame>
  );
}

export default OtherStudentsCell;
