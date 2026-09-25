import { capitalize } from "../helpers/capitalize";
import type { ShiftType } from "../types/Shift";

export default function ShiftBadge({ shiftType }: { shiftType: ShiftType }) {
  const styles: { [key in ShiftType]: string } = {
    morning: "bg-primary/10 text-primary",
    middle: "bg-primary/10 text-primary",
    afternoon: "bg-primary/10 text-primary",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[shiftType]}`}
    >
      {capitalize(shiftType)}
    </span>
  );
}
