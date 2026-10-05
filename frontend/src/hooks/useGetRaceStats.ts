import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getRaceMonths, getRaceStats } from "../api/usersApi";
import type { RaceStats } from "../types/raceStats";

export function useGetRaceStats(month?: string) {
  const raceStatsQuery = useQuery<RaceStats>({
    queryKey: ["raceStats", month],
    queryFn: () => getRaceStats(month),
    placeholderData: keepPreviousData,
  });

  return raceStatsQuery;
}

export function useGetRaceMonths() {
  const raceMonthsQuery = useQuery<string[]>({
    queryKey: ["raceMonths"],
    queryFn: () => getRaceMonths(),
  });
  return raceMonthsQuery;
}
