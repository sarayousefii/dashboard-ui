import { api } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api-response';

import type { User } from '../../shared/types/user.types';

export type DeletedUser = User & {
  isDeleted?: boolean;
  deletedOn?: string;
};

export async function deleteUser(
  id: number,
): Promise<ApiResponse<DeletedUser>> {
  const response = await api.delete<ApiResponse<DeletedUser>>(`/users/${id}`);

  return response.data;
}
