import { api } from '@/shared/lib/axios';

import type { ApiResponse } from '@/shared/types/api-response';

export interface RevokeUserRoleVariables {
  userId: number;
  roleId: string;
}

export interface RevokeUserRoleResult {
  userId: number;
  roleId: string;
  revoked: boolean;
}

export async function revokeUserRole(
  variables: RevokeUserRoleVariables,
): Promise<ApiResponse<RevokeUserRoleResult>> {
  const response = await api.delete<ApiResponse<RevokeUserRoleResult>>(
    `/users/${variables.userId}/roles/${encodeURIComponent(variables.roleId)}`,
  );

  return response.data;
}
