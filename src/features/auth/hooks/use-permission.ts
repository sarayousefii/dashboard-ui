import { useCurrentUser } from './use-current-user';

import type { User } from '@/features/users/shared/types/user.types';

import { hasPermission } from '@/shared/lib/permissions';

export function usePermission() {
  const { data } = useCurrentUser();

  const user = data?.user as User | undefined;

  const role = user?.role;

  const canAccess = (permission: string) => hasPermission(user, permission);

  return {
    role,
    roles: user?.roles ?? [],
    permissions: user?.permissions ?? [],
    canAccess,

    canCreateUser: canAccess('users.create'),
    canEditUser: canAccess('users.edit'),
    canDeleteUser: canAccess('users.delete'),
    canChangeRole: canAccess('users.changeRole'),
  };
}
