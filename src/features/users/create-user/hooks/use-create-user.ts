import { useMutation, useQueryClient } from '@tanstack/react-query';

import { usersKeys } from '../../shared/api/users.query-keys';
import { createUser } from '../api/create-user.api';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: usersKeys.all,
      });
    },
  });
}
