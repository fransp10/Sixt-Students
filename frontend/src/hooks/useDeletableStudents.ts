import { useQuery } from "@tanstack/react-query";
import { getDeletableStudents } from "../api/adminApi";

export function useDeletableStudents() {
  const deletableStudents = useQuery({
    queryKey: ["deletableStudents"],
    queryFn: () => getDeletableStudents(),
  });

  return deletableStudents;
}
