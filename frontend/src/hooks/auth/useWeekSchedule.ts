import { useMemo } from "react";
import { eachDayOfInterval, endOfWeek, format, startOfWeek } from "date-fns";
import { useGetShiftsWithStudentsAndRequesters } from "./useGetShiftsWithStudentsAndRequesters";
import type {
  ShiftType,
  ShiftWithStudentsAndRequesters,
} from "../../types/Shift";

function getCellKey(dateString: string, shiftType: ShiftType) {
  return `${dateString}_${shiftType}`;
}

export function useWeekSchedule(selectedDate: Date) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekStartString = format(weekStart, "yyyy-MM-dd");
  const weekEndString = format(weekEnd, "yyyy-MM-dd");

  const { data: shifts, isLoading } = useGetShiftsWithStudentsAndRequesters(
    weekStartString,
    weekEndString,
  );

  const days = useMemo(
    () => eachDayOfInterval({ start: weekStartString, end: weekEndString }),
    [weekStartString, weekEndString],
  );

  const { shiftsByCell, shiftsById } = useMemo(() => {
    const shiftsByCell = new Map<string, ShiftWithStudentsAndRequesters>();
    const shiftsById = new Map<number, ShiftWithStudentsAndRequesters>();

    shifts?.forEach((shift) => {
      const dateKey = format(new Date(shift.date), "yyyy-MM-dd");
      shiftsByCell.set(getCellKey(dateKey, shift.shift_type), shift);
      shiftsById.set(shift.shift_id, shift);
    });

    return { shiftsByCell, shiftsById };
  }, [shifts]);

  function getShift(day: Date, shiftType: ShiftType) {
    return shiftsByCell.get(getCellKey(format(day, "yyyy-MM-dd"), shiftType));
  }

  function getShiftById(shiftId: number) {
    return shiftsById.get(shiftId);
  }

  return { days, isLoading, getShift, getShiftById };
}
