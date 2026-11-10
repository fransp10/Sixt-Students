import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markPayrollPaid } from "../api/adminApi";

export function useMarkPayrollPaid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["markPayrollPaid"],
    mutationFn: (month: string) => markPayrollPaid(month),
    onSuccess: (_data, month) => {
      queryClient.invalidateQueries({ queryKey: ["payroll", month] });
    },
  });
}
