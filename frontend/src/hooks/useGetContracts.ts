import { useQuery } from "@tanstack/react-query";
import { getContracts } from "../api/usersApi";

export function useGetContracts() {
  return useQuery({
    queryKey: ["contracts"],
    queryFn: () => getContracts(),
  });
}
