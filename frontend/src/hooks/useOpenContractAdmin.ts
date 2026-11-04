import { useMutation } from "@tanstack/react-query";
import { getStudentContractWithSignedUrl } from "../api/adminApi";

export function useOpenContractAdmin() {
  return useMutation({
    mutationFn: (vars: { contractId: number; download: boolean }) =>
      getStudentContractWithSignedUrl(vars.contractId, vars.download),
    onSuccess: (contract, vars) => {
      if (vars.download) {
        window.location.href = contract.signed_url;
      } else {
        window.open(contract.signed_url, "_blank");
      }
    },
  });
}
