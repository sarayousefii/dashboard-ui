import type { ColumnDef } from '@tanstack/react-table';

import type { User } from '../../shared/types/user.types';
import { UserManagementActions } from '../../shared/components/user-management-actions';

type UserColumnTranslationKey =
  | 'table.firstName'
  | 'table.lastName'
  | 'table.email'
  | 'table.age'
  | 'table.role'
  | 'table.status'
  | 'roles.admin'
  | 'roles.editor'
  | 'roles.viewer'
  | 'statuses.active'
  | 'statuses.inactive'
  | 'statuses.pending';

export function createUserColumns(
  t: (key: UserColumnTranslationKey) => string,
): ColumnDef<User>[] {
  return [
    {
      accessorKey: 'firstName',
      header: t('table.firstName'),
      cell: ({ row }) => (
        <span className="text-sm font-medium text-foreground">
          {row.original.firstName}
        </span>
      ),
    },
    {
      accessorKey: 'lastName',
      header: t('table.lastName'),
      cell: ({ row }) => (
        <span className="text-sm font-medium text-foreground">
          {row.original.lastName}
        </span>
      ),
    },
    {
      accessorKey: 'email',
      header: t('table.email'),
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.email}
        </span>
      ),
    },
    {
      accessorKey: 'age',
      header: t('table.age'),
      cell: ({ row }) => (
        <span className="text-sm tabular-nums text-muted-foreground">
          {row.original.age}
        </span>
      ),
    },
    {
      accessorKey: 'role',
      header: t('table.role'),
      cell: ({ row }) => {
        const role = row.original.role ?? 'viewer';

        return (
          <span className="inline-flex items-center rounded-md border border-border bg-muted/50 px-2 py-1 text-xs font-medium text-foreground">
            {t(`roles.${role}` as UserColumnTranslationKey)}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: t('table.status'),
      cell: ({ row }) => {
        const status = row.original.status ?? 'active';

        const statusStyles =
          status === 'active'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400'
            : status === 'pending'
              ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400'
              : 'border-border bg-muted text-muted-foreground';

        return (
          <span
            className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${statusStyles}`}
          >
            {t(`statuses.${status}` as UserColumnTranslationKey)}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: '',
      size: 48,
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          <UserManagementActions user={row.original} context="list" />
        </div>
      ),
    },
  ];
}
