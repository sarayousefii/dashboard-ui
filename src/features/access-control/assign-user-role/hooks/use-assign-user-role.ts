import { useMutation, useQueryClient } from '@tanstack/react-query';

import { usersKeys } from '@/features/users/shared/api/users.query-keys';

import { accessControlKeys } from '../../shared/api/access-control.query-keys';

import {
  assignUserRole,
  type AssignUserRoleVariables,
} from '../api/assign-user-role.api';

export function useAssignUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: AssignUserRoleVariables) =>
      assignUserRole(variables),

    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: accessControlKeys.userRoles(variables.userId),
        }),
        queryClient.invalidateQueries({
          queryKey: accessControlKeys.roles(),
        }),
        queryClient.invalidateQueries({
          queryKey: usersKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: usersKeys.detail(variables.userId),
        }),
        queryClient.invalidateQueries({
          queryKey: ['me'],
        }),
      ]);
    },
  });
}
