import { useMutation } from "@tanstack/react-query";
import { sendContractReminders } from "../api/adminApi";

export function useSendContractReminders() {
  return useMutation({
    mutationFn: (vars: { month: string; userIds?: number[] }) =>
      sendContractReminders(vars.month, vars.userIds),
  });
}
