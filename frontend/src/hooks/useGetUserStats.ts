import { useQuery } from "@tanstack/react-query";
import { getMyStats } from "../api/statsApi";
import { getStatsForShiftsUserHasWorked } from "../api/usersApi";
import type { UserStats } from "../types/stats";

export function useGetUserStats(userId?: string) {
  const stats = useQuery<UserStats>({
    queryKey: userId ? ["userStats", userId] : ["myStats"],
    queryFn: () =>
      userId ? getStatsForShiftsUserHasWorked(userId) : getMyStats(),
  });

  return stats;
}
