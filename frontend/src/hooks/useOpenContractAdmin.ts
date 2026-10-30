import { useMutation } from "@tanstack/react-query";
import { getStudentContractWithSignedUrl } from "../api/adminApi";

export function useOpenContractAdmin() {
  return useMutation({
    mutationFn: (vars: { contractId: number; download: boolean }) =>
      getStudentContractWithSignedUrl(vars.contractId, vars.download),
  });
}
