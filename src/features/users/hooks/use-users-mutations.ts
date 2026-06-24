
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createUser,
  updateUser,
  deleteUser,
} from "../api/users.mutations";
import { usersKeys } from "../api/users.query-keys";

export function useCreateUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: usersKeys.all });
    },
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: any) =>
      updateUser(id, data),

    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: usersKeys.all });
      qc.invalidateQueries({
        queryKey: usersKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: usersKeys.all });
    },
  });
}