import { useQuery } from "@tanstack/react-query";
import { getShifts } from "../../api/shiftsApi";

export function useGetShiftsWithStudentsAndRequesters(
  startDate?: string,
  endDate?: string,
) {
  const getShiftsQuery = useQuery({
    queryKey: ["shifts", startDate, endDate],
    queryFn: () => getShifts(startDate, endDate),
  });

  return getShiftsQuery;
}
