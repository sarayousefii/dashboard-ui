import type {
  PermissionAction,
  PermissionKey,
  PermissionResource,
} from '../constants/permission-catalog';

export interface Role {
  id: string;
  name: string;
  slug: string;
  description: string;
  isSystem: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Permission {
  id: string;
  key: PermissionKey;
  resource: PermissionResource;
  action: PermissionAction;
  labelKey: string;
}

export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
}

export interface UserRoleAssignment {
  id: string;
  userId: number;
  roleId: string;
  assignedAt?: string;
}

export interface UserAccessSnapshot {
  roles: Role[];
  permissions: PermissionKey[];
}

export interface CreateRolePayload {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
}

export interface AssignRolePermissionPayload {
  roleId: string;
  permissionId: string;
}

export interface AssignUserRolePayload {
  userId: number;
  roleId: string;
}

export interface AccessControlListResponse<T> {
  items: T[];
  total: number;
}
