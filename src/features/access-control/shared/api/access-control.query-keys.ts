
export const accessControlKeys = {
  all: ['access-control'] as const,

  roles: () => [...accessControlKeys.all, 'roles'] as const,

  userRoles: (userId: number) =>
    [...accessControlKeys.all, 'users', userId, 'roles'] as const,
};
