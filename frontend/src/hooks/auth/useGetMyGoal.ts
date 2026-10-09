import { useQuery } from "@tanstack/react-query";
import { getMyGoal } from "../../api/usersApi";

export function useGetMyGoal(month: string) {
  const goalQuery = useQuery({
    queryKey: ["myGoal", month],
    queryFn: () => getMyGoal(month),
  });

  return goalQuery;
}
