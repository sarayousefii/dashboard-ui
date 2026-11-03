import { PERMISSION_CATALOG } from '../constants/permission-catalog';

import type {
  Permission,
  Role,
  RolePermission,
  UserAccessSnapshot,
  UserRoleAssignment,
} from '../types/access-control.types';

import type { User } from '@/features/users/shared/types/user.types';

import { fetchMockApi } from '@/shared/lib/mock-api';

async function fetchCollection<T>(path: string): Promise<T[]> {
  const response = await fetchMockApi(path);

  if (!response.ok) {
    throw new Error(`Failed to load RBAC collection: ${path}`);
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error(`Invalid RBAC collection: ${path}`);
  }

  return data as T[];
}

const permissionKeys = new Set<string>(
  PERMISSION_CATALOG.map((permission) => permission.key),
);

export async function resolveUserAccess(
  user: Pick<User, 'id'>,
): Promise<UserAccessSnapshot> {
  const [roles, permissions, rolePermissions, userRoles] = await Promise.all([
    fetchCollection<Role>('/roles'),
    fetchCollection<Permission>('/permissions'),
    fetchCollection<RolePermission>('/rolePermissions'),
    fetchCollection<UserRoleAssignment>('/userRoles'),
  ]);

  const assignments = userRoles.filter(
    (assignment) => Number(assignment.userId) === Number(user.id),
  );

  const assignedRoleIds = new Set(
    assignments.map((assignment) => String(assignment.roleId)),
  );

  // No assignment means no role and no permissions.
  // Do not fall back to the legacy user.role field.
  const assignedRoles = roles.filter((role) =>
    assignedRoleIds.has(String(role.id)),
  );

  const assignedRolePermissions = rolePermissions.filter((item) =>
    assignedRoleIds.has(String(item.roleId)),
  );

  const assignedPermissionIds = new Set(
    assignedRolePermissions.map((item) => String(item.permissionId)),
  );

  const effectivePermissions = Array.from(
    new Set(
      permissions
        .filter(
          (permission) =>
            assignedPermissionIds.has(String(permission.id)) &&
            permissionKeys.has(permission.key),
        )
        .map((permission) => permission.key),
    ),
  );

  return {
    roles: assignedRoles,
    permissions: effectivePermissions,
  };
}
