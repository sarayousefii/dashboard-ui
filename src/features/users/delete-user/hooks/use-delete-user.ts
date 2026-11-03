import { useMutation, useQueryClient } from '@tanstack/react-query';

import { usersKeys } from '../../shared/api/users.query-keys';
import { deleteUser } from '../api/delete-user.api';

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,

    onSuccess: async (_data, userId) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: usersKeys.all,
        }),
        queryClient.removeQueries({
          queryKey: usersKeys.detail(userId),
        }),
      ]);
    },
  });
}
