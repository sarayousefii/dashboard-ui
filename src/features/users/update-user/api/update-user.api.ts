
import { api } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api-response';

import type { UserFormValues } from '../../shared/schemas/user-form.schema';
import type { User } from '../../shared/types/user.types';

export type UpdateUserData = Partial<UserFormValues> & {
  avatarUrl?: string | null;
};

export interface UpdateUserVariables {
  id: number;
  data: UpdateUserData;
}

export async function updateUser(
  id: number,
  data: UpdateUserData,
): Promise<ApiResponse<User>> {
  const response = await api.put<ApiResponse<User>>(
    `/users/${id}`,
    data,
  );

  return response.data;
}
