type ShiftBadgeProps = {
  shiftType: "Morning" | "Middle" | "Afternoon";
};

export default function ShiftBadge({ shiftType }: ShiftBadgeProps) {
  const styles = {
    Morning: "bg-primary/10 text-primary",
    Middle: "bg-primary/10 text-primary",
    Afternoon: "bg-primary/10 text-primary",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[shiftType]}`}
    >
      {shiftType}
    </span>
  );
}
