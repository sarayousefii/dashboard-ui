import { USER_ROLES, USER_STATUSES } from "@/features/users/types/user.types";
import type { User } from "@/features/users/types/user.types";

interface FetchUsersParams {
  limit?: number;
  skip?: number;
  search?: string;
  sortBy?: string;
  order?: string;
}

type DummyJsonUser = Pick<
  User,
  "id" | "firstName" | "lastName" | "email" | "age"
>;

interface DummyJsonUsersResponse {
  users: DummyJsonUser[];
  total: number;
  skip: number;
  limit: number;
}

export async function fetchUsers({
  limit = 10,
  skip = 0,
  search = "",
  sortBy,
  order,
}: FetchUsersParams) {
  const baseUrl = search
    ? "https://dummyjson.com/users/search"
    : "https://dummyjson.com/users";

  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  });

  if (search) params.set("q", search);
  if (sortBy) params.set("sortBy", sortBy);
  if (order) params.set("order", order);

  const response = await fetch(`${baseUrl}?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const data = (await response.json()) as DummyJsonUsersResponse;
  const users: User[] = data.users.map((user, index) => ({
    ...user,
    role: USER_ROLES[index % USER_ROLES.length],
    status: USER_STATUSES[index % USER_STATUSES.length],
  }));

  return { ...data, users };
}

export async function fetchUserById(id: number): Promise<User> {
  const response = await fetch(`https://dummyjson.com/users/${id}`);

  if (!response.ok) {
    throw new Error("User not found");
  }

  const user = (await response.json()) as DummyJsonUser;

  return {
    ...user,
    role: USER_ROLES[user.id % USER_ROLES.length],
    status: USER_STATUSES[user.id % USER_STATUSES.length],
  };
}

export async function updateUserService(
  id: number,
  data: unknown,
): Promise<unknown> {
  const response = await fetch(`https://dummyjson.com/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  return response.json();
}

export async function deleteUserService(id: number): Promise<unknown> {
  const response = await fetch(`https://dummyjson.com/users/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }

  return response.json();
}
