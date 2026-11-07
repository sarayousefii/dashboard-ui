import { keepPreviousData, queryOptions } from '@tanstack/react-query';

import {
  DEFAULT_PAGE_SIZE,
  normalizePageSize,
} from '@/shared/constants/pagination';

import { usersKeys } from '../../shared/api/users.query-keys';
import type { GetUsersParams } from '../../shared/types/user.types';

import { getUsers } from './users-list.api';

export function usersListQuery(params: GetUsersParams) {
  const normalizedParams: GetUsersParams = {
    ...params,
    page: Math.max(1, Number(params.page ?? 1)),
    limit: normalizePageSize(
      params.limit ?? DEFAULT_PAGE_SIZE,
    ),
  };

  return queryOptions({
    queryKey: usersKeys.list(normalizedParams),

    queryFn: () => getUsers(normalizedParams),

    placeholderData: keepPreviousData,

    staleTime: 1000 * 60,
  });
}