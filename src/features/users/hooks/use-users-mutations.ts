import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createUser, deleteUser, updateUser } from "../api/users.mutations";
import type { UpdateUserVariables } from "../api/users.mutations";
import { usersKeys } from "../api/users.query-keys";

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: usersKeys.all });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateUserVariables) => updateUser(id, data),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: usersKeys.all }),
        queryClient.invalidateQueries({ queryKey: usersKeys.detail(variables.id) }),
      ]);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: usersKeys.all });
    },
  });
}
