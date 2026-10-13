import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../api/usersApi";

export function useGetUserById(userId: string) {
  const user = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
  });

  return user;
}
