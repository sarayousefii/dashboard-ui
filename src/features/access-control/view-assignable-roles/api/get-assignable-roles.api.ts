import { api } from '@/shared/lib/axios';

import type { ApiResponse } from '@/shared/types/api-response';

import type { Role } from '@/features/access-control/shared/types/access-control.types';

export async function getAssignableRoles(): Promise<ApiResponse<Role[]>> {
  const response = await api.get<ApiResponse<Role[]>>(
    '/access-control/roles',
  );

  return response.data;
}
