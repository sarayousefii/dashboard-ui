import { useQuery } from '@tanstack/react-query';

import type { GetUsersParams } from '../../shared/types/user.types';
import { usersListQuery } from '../api/users.query-options';

export function useUsersQuery(params: GetUsersParams) {
  return useQuery(usersListQuery(params));
}
