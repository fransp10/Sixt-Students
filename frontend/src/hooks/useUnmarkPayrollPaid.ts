import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unmarkPayrollPaid } from "../api/adminApi";

export function useUnmarkPayrollPaid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["unmarkPayrollPaid"],
    mutationFn: (month: string) => unmarkPayrollPaid(month),
    onSuccess: (_data, month) => {
      queryClient.invalidateQueries({ queryKey: ["payroll", month] });
    },
  });
}
