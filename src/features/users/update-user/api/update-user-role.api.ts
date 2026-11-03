import { api } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api-response';

import type { User, UserRole } from '../../shared/types/user.types';

export interface UpdateUserRoleVariables {
  id: number;
  role: UserRole;
}

export async function updateUserRole(
  id: number,
  role: UserRole,
): Promise<ApiResponse<User>> {
  const response = await api.patch<ApiResponse<User>>(`/users/${id}`, { role });

  return response.data;
}
