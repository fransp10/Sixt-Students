import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getPayroll } from "../api/adminApi";

export function useGetPayroll(month: string) {
  const payrollQuery = useQuery({
    queryKey: ["payroll", month],
    queryFn: () => getPayroll(month),
    placeholderData: keepPreviousData,
  });

  return payrollQuery;
}
