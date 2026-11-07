import { api } from '@/shared/lib/axios';

import type { ApiResponse } from '@/shared/types/api-response';

import type {
  Role,
  UserRoleAssignment,
} from '@/features/access-control/shared/types/access-control.types';

export interface UserRolesData {
  roles: Role[];
  assignments: UserRoleAssignment[];
}

export async function getUserRoles(
  userId: number,
): Promise<ApiResponse<UserRolesData>> {
  const response = await api.get<ApiResponse<UserRolesData>>(
    `/users/${userId}/roles`,
  );

  return response.data;
}
