import { useQuery } from "@tanstack/react-query";
import { getMyStats } from "../api/statsApi";
import type { UserStats } from "../types/stats";

export function useGetMyStats() {
  const stats = useQuery<UserStats>({
    queryKey: ["myStats"],
    queryFn: () => getMyStats(),
  });

  return stats;
}
