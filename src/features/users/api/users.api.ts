import { api } from "@/shared/lib/axios";
import { GetUsersParams } from "../types/user.types";

export async function getUsers(params: GetUsersParams) {
  const page = Number(params.page ?? "1");
  const skip = (page - 1) * (params.limit ?? 10);

  const searchParams = new URLSearchParams({
    limit: String(params.limit ?? 10),
    skip: String(skip),
  });

  if (params.search) searchParams.set("q", params.search);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.order) searchParams.set("order", params.order);

  const { data } = await api.get(`/users?${searchParams.toString()}`);
  return data;
}

export async function getUserById(id: number) {
  const { data } = await api.get(`/users/${id}`);
  return data;
}

