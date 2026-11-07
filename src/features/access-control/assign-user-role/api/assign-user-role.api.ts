import { api } from '@/shared/lib/axios';

import type { ApiResponse } from '@/shared/types/api-response';

import type { UserRoleAssignment } from '@/features/access-control/shared/types/access-control.types';

export interface AssignUserRoleVariables {
  userId: number;
  roleId: string;
}

export async function assignUserRole(
  variables: AssignUserRoleVariables,
): Promise<ApiResponse<UserRoleAssignment>> {
  const response = await api.post<ApiResponse<UserRoleAssignment>>(
    `/users/${variables.userId}/roles`,
    {
      roleId: variables.roleId,
    },
  );

  return response.data;
}
