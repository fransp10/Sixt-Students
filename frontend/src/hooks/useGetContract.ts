import { useMutation } from "@tanstack/react-query";
import { getContract } from "../api/usersApi";

export function useGetContract(month: string) {
  return useMutation({
    mutationFn: (download: boolean) => getContract(month, download),
    onSuccess: (contract, download) => {
      if (download) {
        window.location.href = contract.signed_url;
      } else {
        window.open(contract.signed_url, "_blank");
      }
    },
  });
}
