import type { UserRole } from '@/features/users/shared/types/user.types';

type PermissionSubject =
  | UserRole
  | {
      role?: UserRole;
      permissions?: readonly string[];
    }
  | null
  | undefined;

// Legacy fallback. Dynamic permissions take precedence whenever
// the permissions array is available, including an empty array.
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    'users.view',
    'users.create',
    'users.edit',
    'users.delete',
    'users.changeRole',
    'products.view',
    'products.create',
    'products.edit',
    'products.delete',
    'dashboard.view',
    'roles.view',
    'roles.create',
    'roles.edit',
    'roles.delete',
    'roles.assignPermissions',
  ],

  editor: [
    'users.view',
    'products.view',
    'products.create',
    'products.edit',
    'dashboard.view',
  ],

  viewer: ['products.view', 'dashboard.view'],
};

export function hasPermission(
  subject: PermissionSubject,
  permission: string,
): boolean {
  if (!subject) {
    return false;
  }

  if (typeof subject === 'string') {
    return ROLE_PERMISSIONS[subject]?.includes(permission) ?? false;
  }

  if (subject.permissions !== undefined) {
    return subject.permissions.includes(permission);
  }

  if (!subject.role) {
    return false;
  }

  return ROLE_PERMISSIONS[subject.role]?.includes(permission) ?? false;
}
