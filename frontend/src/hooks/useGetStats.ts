import { addMonths, format, startOfMonth, subMonths } from "date-fns";
import { useGetStatsForShiftsUserHasWorked } from "./useGetStatsForShiftsUserHasWorked";

export function useGetStats(userId: string) {
  const startOfCurrentMonth = startOfMonth(new Date());
  const startDateCurrentMonth = format(startOfCurrentMonth, "yyyy-MM-dd");
  const endDateCurrentMonth = format(
    addMonths(startOfCurrentMonth, 1),
    "yyyy-MM-dd",
  );

  const startDatePrevMonth = format(
    subMonths(startOfMonth(new Date()), 1),
    "yyyy-MM-dd",
  );
  const endDatePrevMonth = format(startOfMonth(new Date()), "yyyy-MM-dd");

  const thisMonthData = useGetStatsForShiftsUserHasWorked(
    userId!,
    startDateCurrentMonth,
    endDateCurrentMonth,
  );

  const prevMonthData = useGetStatsForShiftsUserHasWorked(
    userId!,
    startDatePrevMonth,
    endDatePrevMonth,
  );

  return {
    thisMonthData,
    prevMonthData,
  };
}
