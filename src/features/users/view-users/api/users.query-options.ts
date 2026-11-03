import { keepPreviousData, queryOptions } from '@tanstack/react-query';

import { usersKeys } from '../../shared/api/users.query-keys';
import type { GetUsersParams } from '../../shared/types/user.types';

import { getUsers } from './users-list.api';

export function usersListQuery(params: GetUsersParams) {
  return queryOptions({
    queryKey: usersKeys.list(params),
    queryFn: () => getUsers(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });
}
