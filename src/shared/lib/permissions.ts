import { UserRole } from "@/features/users/types/user.types";

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    "users.view",
    "users.create",
    "users.edit",
    "users.delete",
    "users.changeRole",
    "products.view",
    "products.create",
    "products.edit",
    "products.delete",
    "dashboard.view",
  ],

  editor: [
    "users.view",
    "products.view",
    "products.create",
    "products.edit",
    "dashboard.view",
  ],

  viewer: [
    "products.view",
    "dashboard.view",
  ],
};

export function hasPermission(
  role: UserRole | undefined,
  permission: string
) {
  if (!role) return false;

  return ROLE_PERMISSIONS[role]?.includes(permission);
}