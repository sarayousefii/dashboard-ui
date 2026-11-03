import { api } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api-response';

import type { User } from '../../shared/types/user.types';
import type { UserFormValues } from '../../shared/schemas/user-form.schema';

export interface UpdateUserVariables {
  id: number;
  data: Partial<UserFormValues>;
}

export async function updateUser(
  id: number,
  data: Partial<UserFormValues>,
): Promise<ApiResponse<User>> {
  const response = await api.put<ApiResponse<User>>(`/users/${id}`, data);

  return response.data;
}
