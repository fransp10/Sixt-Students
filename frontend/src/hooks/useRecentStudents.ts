import { useQuery } from "@tanstack/react-query";
import { getRecentStudents } from "../api/adminApi";

export function useRecentStudents(limit: number) {
  const recentStudents = useQuery({
    queryKey: ["recentStudents", limit],
    queryFn: () => getRecentStudents(limit),
  });

  return recentStudents;
}
