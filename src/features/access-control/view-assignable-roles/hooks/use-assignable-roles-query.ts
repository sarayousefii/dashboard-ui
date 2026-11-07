import { useQuery } from '@tanstack/react-query';

import { accessControlKeys } from '../../shared/api/access-control.query-keys';

import { getAssignableRoles } from '../api/get-assignable-roles.api';

export function useAssignableRolesQuery() {
  return useQuery({
    queryKey: accessControlKeys.roles(),
    queryFn: getAssignableRoles,
    staleTime: 1000 * 60,
  });
}
