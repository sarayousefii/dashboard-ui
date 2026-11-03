import { useMutation, useQueryClient } from '@tanstack/react-query';

import { usersKeys } from '../../shared/api/users.query-keys';

import {
  updateUserStatus,
  type UpdateUserStatusVariables,
} from '../api/update-user-status.api';

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: UpdateUserStatusVariables) =>
      updateUserStatus(id, status),

    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: usersKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: usersKeys.detail(variables.id),
        }),
      ]);
    },
  });
}
