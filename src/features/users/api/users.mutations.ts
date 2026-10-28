import { api } from "@/shared/lib/axios";
import type { ApiResponse } from "@/shared/types/api-response";

import type { User } from "../types/user.types";
import type { UserFormValues } from "../schemas/user-form.schema";

export type UpdateUserVariables = {
  id: number;
  data: Partial<UserFormValues>;
};

export type DeletedUser = User & {
  isDeleted?: boolean;
  deletedOn?: string;
};

export async function deleteUser(id: number): Promise<ApiResponse<DeletedUser>> {
  const response = await api.delete<ApiResponse<DeletedUser>>(`/users/${id}`);
  return response.data;
}

export async function updateUser(
  id: number,
  data: Partial<UserFormValues>,
): Promise<ApiResponse<User>> {
  const response = await api.put<ApiResponse<User>>(`/users/${id}`, data);
  return response.data;
}

export async function createUser(
  data: UserFormValues,
): Promise<ApiResponse<User>> {
  const response = await api.post<ApiResponse<User>>("/users", data);
  return response.data;
}
