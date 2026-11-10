import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markStudentPaid } from "../api/adminApi";

export function useMarkStudentPaid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["markStudentPaid"],
    mutationFn: ({ month, userId }: { month: string; userId: number }) =>
      markStudentPaid(month, userId),
    onSuccess: (_data, { month }) => {
      queryClient.invalidateQueries({ queryKey: ["payroll", month] });
    },
  });
}
