import { useQuery } from "@tanstack/react-query";
import { getStatsForShiftsUserHasWorked } from "../api/usersApi";
import type { UserStats } from "../types/stats";

type QueryState<T> =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; data: T };

export function useGetStatsForShiftsUserHasWorked(
  userId: string,
  startDate?: string,
  endDate?: string,
): QueryState<UserStats> {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["getStatsForShiftsUserHasWorked", userId, startDate, endDate],
    queryFn: () => getStatsForShiftsUserHasWorked(userId, startDate, endDate),
  });

  if (isLoading) return { status: "loading" };
  if (isError) return { status: "error" };

  return { data: data, status: "success" };
}
