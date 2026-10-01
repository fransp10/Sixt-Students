import { useQuery } from "@tanstack/react-query";
import { getNextShiftForUser } from "../api/usersApi";

export function useGetNextShift() {
  const nextShift = useQuery({
    queryKey: ["nextShift"],
    queryFn: () => getNextShiftForUser(),
  });

  return nextShift;
}
