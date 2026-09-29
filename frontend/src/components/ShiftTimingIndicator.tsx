import type { ShiftTiming } from "../helpers/shiftTiming";

function ShiftTimingIndicator({ shiftTiming }: { shiftTiming: ShiftTiming }) {
  return (
    <>
      {shiftTiming === "ended" && (
        <div className="ml-6 flex gap-2 items-center bg-danger/20 border border-danger/30 rounded-lg px-4 py-2">
          <p className="text-xs text-danger font-semibold">
            This shift has passed
          </p>
        </div>
      )}

      {shiftTiming === "active" && (
        <div className="ml-6 flex gap-2 items-center bg-warning/20 border border-warning/30 rounded-lg px-4 py-2">
          <p className="text-xs text-warning font-semibold">
            This is an ongoing shift
          </p>
        </div>
      )}

      {shiftTiming === "upcoming" && (
        <div className="ml-6 flex gap-2 items-center bg-pending/20 border border-pending/30 rounded-lg px-4 py-2">
          <p className="text-xs text-pending font-semibold">
            This is an upcoming shift
          </p>
        </div>
      )}
    </>
  );
}

export default ShiftTimingIndicator;
