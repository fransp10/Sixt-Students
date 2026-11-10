import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unmarkStudentPaid } from "../api/adminApi";

export function useUnmarkStudentPaid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["unmarkStudentPaid"],
    mutationFn: ({ month, userId }: { month: string; userId: number }) =>
      unmarkStudentPaid(month, userId),
    onSuccess: (_data, { month }) => {
      queryClient.invalidateQueries({ queryKey: ["payroll", month] });
    },
  });
}
