import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "../api/usersApi";
import type { CreateUserReqBodyType } from "../types/user";

export function useCreateUser() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["createUser"],
    mutationFn: (newUserObject: CreateUserReqBodyType) =>
      createUser(newUserObject),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["recentStudents"] });
    },
  });

  return mutation;
}
