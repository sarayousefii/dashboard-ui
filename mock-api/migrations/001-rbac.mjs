
import { constants } from 'node:fs';
import {
  access,
  copyFile,
  readFile,
  writeFile,
} from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const migrationDirectory = dirname(fileURLToPath(import.meta.url));

const databasePath = join(migrationDirectory, '..', 'db.json');

const backupPath = join(
  migrationDirectory,
  '..',
  'db.json.before-rbac.bak',
);

const permissionDefinitions = [
  ['dashboard.view', 'dashboard', 'view'],

  ['products.view', 'products', 'view'],
  ['products.create', 'products', 'create'],
  ['products.edit', 'products', 'edit'],
  ['products.delete', 'products', 'delete'],

  ['users.view', 'users', 'view'],
  ['users.create', 'users', 'create'],
  ['users.edit', 'users', 'edit'],
  ['users.delete', 'users', 'delete'],
  ['users.changeRole', 'users', 'changeRole'],

  ['roles.view', 'roles', 'view'],
  ['roles.create', 'roles', 'create'],
  ['roles.edit', 'roles', 'edit'],
  ['roles.delete', 'roles', 'delete'],
  ['roles.assignPermissions', 'roles', 'assignPermissions'],
];

const roleDefinitions = [
  {
    id: 'role-admin',
    name: 'Administrator',
    slug: 'admin',
    description: 'Full access to all application features.',
    isSystem: true,
  },
  {
    id: 'role-editor',
    name: 'Editor',
    slug: 'editor',
    description: 'Can view users and manage products.',
    isSystem: true,
  },
  {
    id: 'role-viewer',
    name: 'Viewer',
    slug: 'viewer',
    description: 'Read-only access to products and dashboard.',
    isSystem: true,
  },
];

const rolePermissionMap = {
  admin: permissionDefinitions.map(([key]) => key),

  editor: [
    'users.view',
    'products.view',
    'products.create',
    'products.edit',
    'dashboard.view',
  ],

  viewer: [
    'products.view',
    'dashboard.view',
  ],
};

function ensureCollection(database, name) {
  if (database[name] === undefined) {
    database[name] = [];
  }

  if (!Array.isArray(database[name])) {
    throw new Error(`Invalid database collection: ${name}`);
  }

  return database[name];
}

function addIfMissing(collection, item, predicate) {
  const existing = collection.find(predicate);

  if (existing) {
    return {
      item: existing,
      added: false,
    };
  }

  collection.push(item);

  return {
    item,
    added: true,
  };
}

async function ensureBackup() {
  try {
    await access(backupPath);

    console.log('Existing database backup found. Keeping it.');
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }

    await copyFile(
      databasePath,
      backupPath,
      constants.COPYFILE_EXCL,
    );

    console.log('Database backup created.');
  }
}

async function migrate() {
  const rawDatabase = await readFile(databasePath, 'utf8');
  const database = JSON.parse(rawDatabase);

  if (!Array.isArray(database.users)) {
    throw new Error(
      'The users collection does not exist or is invalid.',
    );
  }

  const roles = ensureCollection(database, 'roles');
  const permissions = ensureCollection(database, 'permissions');
  const rolePermissions = ensureCollection(database, 'rolePermissions');
  const userRoles = ensureCollection(database, 'userRoles');

  const roleIds = new Map();
  const permissionIds = new Map();

  let addedRoles = 0;
  let addedPermissions = 0;
  let addedRolePermissions = 0;
  let addedUserRoles = 0;

  // Seed system roles without replacing existing records.
  for (const roleDefinition of roleDefinitions) {
    const existingById = roles.find(
      (role) => String(role.id) === roleDefinition.id,
    );

    const existingBySlug = roles.find(
      (role) => role.slug === roleDefinition.slug,
    );

    if (
      existingById &&
      existingById.slug !== roleDefinition.slug
    ) {
      throw new Error(
        `Role ID conflict detected: ${roleDefinition.id}`,
      );
    }

    if (
      existingBySlug &&
      String(existingBySlug.id) !== roleDefinition.id
    ) {
      throw new Error(
        `Role slug conflict detected: ${roleDefinition.slug}`,
      );
    }

    const result = addIfMissing(
      roles,
      roleDefinition,
      (role) =>
        role.slug === roleDefinition.slug ||
        String(role.id) === roleDefinition.id,
    );

    roleIds.set(
      roleDefinition.slug,
      String(result.item.id),
    );

    if (result.added) {
      addedRoles += 1;
    }
  }

  // Seed the application's permission catalog.
  for (const [key, resource, action] of permissionDefinitions) {
    const permissionDefinition = {
      id: key,
      key,
      resource,
      action,
      labelKey: `permissions.${key}`,
    };

    const existingByKey = permissions.find(
      (permission) => permission.key === key,
    );

    const existingById = permissions.find(
      (permission) => String(permission.id) === key,
    );

    if (
      existingById &&
      existingById.key !== key
    ) {
      throw new Error(
        `Permission ID conflict detected: ${key}`,
      );
    }

    if (
      existingByKey &&
      String(existingByKey.id) !== key
    ) {
      throw new Error(
        `Permission key conflict detected: ${key}`,
      );
    }

    const result = addIfMissing(
      permissions,
      permissionDefinition,
      (permission) =>
        permission.key === key ||
        String(permission.id) === key,
    );

    permissionIds.set(
      key,
      String(result.item.id),
    );

    if (result.added) {
      addedPermissions += 1;
    }
  }

  // Connect system roles to their permissions.
  for (const [slug, permissionKeys] of Object.entries(rolePermissionMap)) {
    const roleId = roleIds.get(slug);

    if (!roleId) {
      throw new Error(`Missing role: ${slug}`);
    }

    for (const permissionKey of permissionKeys) {
      const permissionId = permissionIds.get(permissionKey);

      if (!permissionId) {
        throw new Error(
          `Missing permission: ${permissionKey}`,
        );
      }

      const result = addIfMissing(
        rolePermissions,
        {
          id: `${roleId}::${permissionId}`,
          roleId,
          permissionId,
        },
        (item) =>
          String(item.roleId) === roleId &&
          String(item.permissionId) === permissionId,
      );

      if (result.added) {
        addedRolePermissions += 1;
      }
    }
  }

  // Migrate each user's legacy role into userRoles.
  for (const user of database.users) {
    const userId = Number(user.id);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      throw new Error(
        `Invalid user ID found: ${user.id}`,
      );
    }

    const legacyRole = user.role ?? 'viewer';
    const roleId = roleIds.get(legacyRole);

    if (!roleId) {
      console.warn(
        `Skipping user ${userId}: unknown legacy role "${legacyRole}".`,
      );

      continue;
    }

    const result = addIfMissing(
      userRoles,
      {
        id: `user-${userId}::${roleId}`,
        userId,
        roleId,
      },
      (assignment) =>
        Number(assignment.userId) === userId &&
        String(assignment.roleId) === roleId,
    );

    if (result.added) {
      addedUserRoles += 1;
    }
  }

  // Backup the database before writing any changes.
  await ensureBackup();

  // JSON Server 0.17.4 only accepts collection objects at the root.
  // Migration metadata must not be stored as a top-level number.
  delete database.rbacMigrationVersion;

  await writeFile(
    databasePath,
    `${JSON.stringify(database, null, 2)}\n`,
    'utf8',
  );

  console.log('\nRBAC migration completed successfully.');

  console.table({
    existingUsers: database.users.length,
    totalRoles: roles.length,
    addedRoles,
    totalPermissions: permissions.length,
    addedPermissions,
    totalRolePermissions: rolePermissions.length,
    addedRolePermissions,
    totalUserRoles: userRoles.length,
    addedUserRoles,
  });

  console.log('\nDatabase backup:');
  console.log(backupPath);
}

migrate().catch((error) => {
  console.error('\nRBAC migration failed:');
  console.error(error);

  process.exitCode = 1;
});
