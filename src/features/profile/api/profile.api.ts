import { getMe } from '@/features/auth/api/auth.api';
import type { User } from '@/features/users/shared/types/user.types';
import { api } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api-response';
import type { UserFormValues } from '@/features/users/shared/schemas/user-form.schema';

interface CurrentUserResponse {
  user: User | null;
}

export async function getProfile(
  userId: number,
  isSelf: boolean,
): Promise<User> {
  if (isSelf) {
    const response = (await getMe()) as CurrentUserResponse;

    if (!response.user) {
      throw new Error('Current user not found');
    }

    return response.user;
  }

  const response = await api.get<ApiResponse<User>>(`/users/${userId}`);

  return response.data.data;
}

export async function updateMyProfile(data: UserFormValues): Promise<User> {
  const response = await api.patch<ApiResponse<User>>('/profile/me', data);

  return response.data.data;
}
