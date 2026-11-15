import type { ShiftType } from "../../types/Shift";
import { getShiftSpan } from "../../config/shiftHours";

// A thin track for the working day with the shift's hours filled in, so the
// overlap between morning, middle and afternoon shifts is visible at a glance.
function ShiftTimeRail({
  shiftType,
  className = "max-w-28",
}: {
  shiftType: ShiftType;
  className?: string;
}) {
  const { left, width } = getShiftSpan(shiftType);
  return (
    <div
      aria-hidden="true"
      className={`relative h-1 w-full rounded-full bg-surfaceCards ${className}`}
    >
      <span
        className="absolute inset-y-0 rounded-full bg-primary"
        style={{ left: `${left}%`, width: `${width}%` }}
      />
    </div>
  );
}

export default ShiftTimeRail;
