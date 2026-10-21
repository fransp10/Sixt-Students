import { useQuery } from "@tanstack/react-query";
import { getMonthlyTotals } from "../api/adminApi";

export function useMonthlyTotals(months: number) {
  const monthlyTotals = useQuery({
    queryKey: ["monthlyTotals", months],
    queryFn: () => getMonthlyTotals(months),
  });

  return monthlyTotals;
}
