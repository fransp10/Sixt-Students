import { useQuery } from "@tanstack/react-query";
import { getNextShiftForUser } from "../api/usersApi";

export function useGetNextShift(userId?: string) {
  const nextShift = useQuery({
    queryKey: ["nextShift", userId],
    queryFn: () => getNextShiftForUser(userId),
  });

  return nextShift;
}
