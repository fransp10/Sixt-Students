import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../api/usersApi";
import type { UserWithoutPassword } from "../types/user";

export function useGetUserById(userId: string) {
  const user = useQuery<UserWithoutPassword>({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
  });

  return user;
}
