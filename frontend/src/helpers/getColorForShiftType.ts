export function getColorForShiftType(shiftType: string): string {
  return shiftType === "morning"
    ? "#ff5f00"
    : shiftType === "middle"
      ? "#ff7a2f"
      : "#ff945c";
}
