import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteContract } from "../api/usersApi";

export function useDeleteContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (contractId: number) => deleteContract(contractId),
    onSuccess: (_, month) => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["contract", month] });
    },
  });
}
