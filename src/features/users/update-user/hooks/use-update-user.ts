import { useMutation, useQueryClient } from '@tanstack/react-query';

import { usersKeys } from '../../shared/api/users.query-keys';
import { updateUser, type UpdateUserVariables } from '../api/update-user.api';

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateUserVariables) => updateUser(id, data),

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
