export const USER_ROLES = [
  "admin",
  "editor",
  "viewer",
] as const;

export type UserRole =
  (typeof USER_ROLES)[number];

export const USER_STATUSES = [
  "active",
  "inactive",
  "pending",
] as const;

export type UserStatus =
  (typeof USER_STATUSES)[number];

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  role: UserRole;
  status?: UserStatus;
}

export interface GetUsersParams {
  limit?: number;
  page?: number;
  search?: string;
  sortBy?: string;
  order?: string;
}