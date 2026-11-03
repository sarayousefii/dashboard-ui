import { useMutation, useQueryClient } from '@tanstack/react-query';

import { usersKeys } from '../../shared/api/users.query-keys';

import {
  updateUserRole,
  type UpdateUserRoleVariables,
} from '../api/update-user-role.api';

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: UpdateUserRoleVariables) =>
      updateUserRole(id, role),

    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: usersKeys.all,
        }),

        queryClient.invalidateQueries({
          queryKey: usersKeys.detail(variables.id),
        }),

        // Refresh effective permissions if the current user's role changed.
        queryClient.invalidateQueries({
          queryKey: ['me'],
        }),
      ]);
    },
  });
}
