import { api } from "@/shared/lib/axios";
import type { ApiResponse } from "@/shared/types/api-response";

import type { GetUsersParams, User, UserListData } from "../types/user.types";

export async function getUsers(
  params: GetUsersParams,
): Promise<ApiResponse<UserListData>> {
  const page = Math.max(1, Number(params.page ?? 1));
  const limit = params.limit ?? 10;
  const skip = (page - 1) * limit;

  const searchParams = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  });

  if (params.search) searchParams.set("q", params.search);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.order) searchParams.set("order", params.order);

  const response = await api.get<ApiResponse<UserListData>>(
    `/users?${searchParams.toString()}`,
  );

  return response.data;
}

export async function getUserById(id: number): Promise<ApiResponse<User>> {
  const response = await api.get<ApiResponse<User>>(`/users/${id}`);
  return response.data;
}
