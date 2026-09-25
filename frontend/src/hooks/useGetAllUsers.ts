import { useQuery } from "@tanstack/react-query";
import type { UserMeType, UserRoles } from "../types/user";
import { getUsers } from "../api/usersApi";

export function useGetAllUsers(role?: UserRoles) {
  const getAllUsersQuery = useQuery<UserMeType[]>({
    queryKey: ["users", role],
    queryFn: () => getUsers(role),
  });

  return getAllUsersQuery;
}
