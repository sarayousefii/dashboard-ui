import { api } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api-response';

import type { User, UserStatus } from '../../shared/types/user.types';

export interface UpdateUserStatusVariables {
  id: number;
  status: UserStatus;
}

export async function updateUserStatus(
  id: number,
  status: UserStatus,
): Promise<ApiResponse<User>> {
  const response = await api.patch<ApiResponse<User>>(`/users/${id}`, {
    status,
  });

  return response.data;
}
