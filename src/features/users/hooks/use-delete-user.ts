import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "../api/users.mutations";
import { usersKeys } from "../api/users.query-keys";

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersKeys.all,
      });
    },
  });
}