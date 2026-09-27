import { useQuery } from "@tanstack/react-query";
import { getUsersShiftsWorked } from "../api/usersApi";
import type { ShiftsWorkedHistoryData } from "../types/Shift";

export function useGetUsersShiftsWorked(
  userId: string,
  startDate?: string,
  endDate?: string,
) {
  const shiftAssignmentsQuery = useQuery<ShiftsWorkedHistoryData[]>({
    queryKey: ["getUsersShiftsWorked", userId, startDate, endDate],
    queryFn: () => getUsersShiftsWorked(userId, startDate, endDate),
  });

  return shiftAssignmentsQuery;
}
