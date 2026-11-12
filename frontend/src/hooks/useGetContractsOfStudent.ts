import { useQuery } from "@tanstack/react-query";
import { getContractsOfStudent } from "../api/adminApi";

export function useGetContractsOfStudent(userId: number) {
  return useQuery({
    queryKey: ["contracts", "student", userId],
    queryFn: () => getContractsOfStudent(userId),
  });
}
