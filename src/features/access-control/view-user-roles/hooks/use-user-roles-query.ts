import { useQuery } from '@tanstack/react-query';

import { accessControlKeys } from '../../shared/api/access-control.query-keys';

import { getUserRoles } from '../api/get-user-roles.api';

export function useUserRolesQuery(userId: number) {
  return useQuery({
    queryKey: accessControlKeys.userRoles(userId),
    queryFn: () => getUserRoles(userId),
    enabled: Number.isSafeInteger(userId) && userId > 0,
    staleTime: 1000 * 30,
  });
}
