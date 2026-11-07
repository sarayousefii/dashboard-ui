import { useMutation, useQueryClient } from '@tanstack/react-query';

import { usersKeys } from '@/features/users/shared/api/users.query-keys';

import { accessControlKeys } from '../../shared/api/access-control.query-keys';

import {
  revokeUserRole,
  type RevokeUserRoleVariables,
} from '../api/revoke-user-role.api';

export function useRevokeUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: RevokeUserRoleVariables) =>
      revokeUserRole(variables),

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
