import CellFrame from "./CellFrame";

function ShiftPassedCell({
  onClick,
  ariaLabel,
}: {
  onClick: () => void;
  ariaLabel?: string;
}) {
  return <CellFrame kind="passed" onClick={onClick} ariaLabel={ariaLabel} />;
}

export default ShiftPassedCell;
