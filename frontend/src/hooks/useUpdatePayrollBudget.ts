import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePayrollBudget } from "../api/adminApi";

export function useUpdatePayrollBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updatePayrollBudget"],
    mutationFn: (vars: { month: string; amount: number }) =>
      updatePayrollBudget(vars.month, vars.amount),
    // the budget carries over, so every cached month after this one can change too
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll"] });
    },
  });
}
