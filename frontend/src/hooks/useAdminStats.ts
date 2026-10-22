import { useQuery } from "@tanstack/react-query";
import { getAdminStats } from "../api/adminApi";

export function useAdminStats() {
  const adminStats = useQuery({
    queryKey: ["adminStats"],
    queryFn: () => getAdminStats(),
  });

  return adminStats;
}
