export const PERMISSION_CATALOG = [
  {
    key: 'dashboard.view',
    resource: 'dashboard',
    action: 'view',
    labelKey: 'permissions.dashboard.view',
  },

  {
    key: 'products.view',
    resource: 'products',
    action: 'view',
    labelKey: 'permissions.products.view',
  },
  {
    key: 'products.create',
    resource: 'products',
    action: 'create',
    labelKey: 'permissions.products.create',
  },
  {
    key: 'products.edit',
    resource: 'products',
    action: 'edit',
    labelKey: 'permissions.products.edit',
  },
  {
    key: 'products.delete',
    resource: 'products',
    action: 'delete',
    labelKey: 'permissions.products.delete',
  },

  {
    key: 'users.view',
    resource: 'users',
    action: 'view',
    labelKey: 'permissions.users.view',
  },
  {
    key: 'users.create',
    resource: 'users',
    action: 'create',
    labelKey: 'permissions.users.create',
  },
  {
    key: 'users.edit',
    resource: 'users',
    action: 'edit',
    labelKey: 'permissions.users.edit',
  },
  {
    key: 'users.delete',
    resource: 'users',
    action: 'delete',
    labelKey: 'permissions.users.delete',
  },
  {
    key: 'users.changeRole',
    resource: 'users',
    action: 'changeRole',
    labelKey: 'permissions.users.changeRole',
  },

  {
    key: 'roles.view',
    resource: 'roles',
    action: 'view',
    labelKey: 'permissions.roles.view',
  },
  {
    key: 'roles.create',
    resource: 'roles',
    action: 'create',
    labelKey: 'permissions.roles.create',
  },
  {
    key: 'roles.edit',
    resource: 'roles',
    action: 'edit',
    labelKey: 'permissions.roles.edit',
  },
  {
    key: 'roles.delete',
    resource: 'roles',
    action: 'delete',
    labelKey: 'permissions.roles.delete',
  },
  {
    key: 'roles.assignPermissions',
    resource: 'roles',
    action: 'assignPermissions',
    labelKey: 'permissions.roles.assignPermissions',
  },
] as const;

export type PermissionKey = (typeof PERMISSION_CATALOG)[number]['key'];

export type PermissionResource =
  (typeof PERMISSION_CATALOG)[number]['resource'];

export type PermissionAction = (typeof PERMISSION_CATALOG)[number]['action'];
