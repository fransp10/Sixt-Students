import { useQuery } from "@tanstack/react-query";
import { getStudentContracts } from "../api/adminApi";

export function useGetAllContractsAdmin(month?: string) {
  const contractsQuery = useQuery({
    queryKey: ["contracts", month],
    queryFn: () => getStudentContracts(month),
  });

  return contractsQuery;
}
