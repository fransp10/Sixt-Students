import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStudent } from "../api/adminApi";

export function useAdminDeleteStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["adminDeleteStudent"],
    mutationFn: (id: number) => deleteStudent(id),

    onSuccess: () => {
      // Invalidate queries related to students and admin stats
      queryClient.invalidateQueries({ queryKey: ["deletableStudents"] });
      queryClient.invalidateQueries({ queryKey: ["recentStudents"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      queryClient.invalidateQueries({ queryKey: ["monthlyTotals"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}
