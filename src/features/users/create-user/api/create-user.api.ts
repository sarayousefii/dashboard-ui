import { api } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api-response';

import type { UserFormValues } from '../../shared/schemas/user-form.schema';
import type { User } from '../../shared/types/user.types';

export async function createUser(
  data: UserFormValues,
): Promise<ApiResponse<User>> {
  const response = await api.post<ApiResponse<User>>('/users', data);

  return response.data;
}
