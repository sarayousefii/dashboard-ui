import type { PermissionKey } from '@/features/access-control/shared/constants/permission-catalog';
import type { Role } from '@/features/access-control/shared/types/access-control.types';

export const USER_ROLES = ['admin', 'editor', 'viewer'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const USER_STATUSES = ['active', 'inactive', 'pending'] as const;

export type UserStatus = (typeof USER_STATUSES)[number];

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;

  /**
   * Profile image stored as an optimized WebP Data URL.
   * Null means the user has no profile image.
   */
  avatarUrl?: string | null;

  /**
   * Legacy role field retained for backward compatibility.
   * Dynamic role assignments are represented by roles.
   */
  role: UserRole;

  roles?: Role[];
  permissions?: PermissionKey[];
  status?: UserStatus;
}

export interface UserListData {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

export interface GetUsersParams {
  limit?: number;
  page?: number;
  search?: string;
  sortBy?: string;
  order?: string;
}