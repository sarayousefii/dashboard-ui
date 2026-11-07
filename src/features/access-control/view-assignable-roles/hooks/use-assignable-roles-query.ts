
import { useQuery } from '@tanstack/react-query';

import { accessControlKeys } from '../../shared/api/access-control.query-keys';

import { getAssignableRoles } from '../api/get-assignable-roles.api';

interface UseAssignableRolesQueryOptions {
  enabled?: boolean;
}

export function useAssignableRolesQuery({
  enabled = true,
}: UseAssignableRolesQueryOptions = {}) {
  return useQuery({
    queryKey: accessControlKeys.roles(),
    queryFn: getAssignableRoles,
    enabled,
    staleTime: 1000 * 60,
  });
}
