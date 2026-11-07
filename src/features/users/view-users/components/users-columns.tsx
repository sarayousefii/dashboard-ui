
'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useEffect, useId, useRef, useState } from 'react';

import { UserManagementActions } from '../../shared/components/user-management-actions';
import type { User } from '../../shared/types/user.types';

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

type UserRole = NonNullable<User['roles']>[number];

type UserColumnTranslator = (
  key: UserColumnTranslationKey,
) => string;

function getRoleLabel(
  role: UserRole,
  t: UserColumnTranslator,
): string {
  switch (role.slug) {
    case 'admin':
      return t('roles.admin');
    case 'editor':
      return t('roles.editor');
    case 'viewer':
      return t('roles.viewer');
    default:
      return role.name;
  }
}

function UserRoleBadges({
  roles,
  t,
}: {
  roles: UserRole[];
  t: UserColumnTranslator;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const popoverId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (roles.length === 0) {
    return (
      <span className="text-xs text-muted-foreground">
        —
      </span>
    );
  }

  const firstRole = roles[0];
  const remainingCount = roles.length - 1;

  return (
    <div
      ref={containerRef}
      className="relative flex min-w-0 items-center gap-1.5"
      onClick={(event) => event.stopPropagation()}
    >
      <span
        className="inline-flex max-w-28 items-center truncate whitespace-nowrap rounded-md border border-border bg-muted/50 px-2 py-1 text-xs font-medium text-foreground"
        title={getRoleLabel(firstRole, t)}
      >
        {getRoleLabel(firstRole, t)}
      </span>

      {remainingCount > 0 && (
        <>
          <button
            type="button"
            aria-label={`${remainingCount} more roles`}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            aria-controls={popoverId}
            onClick={() => setIsOpen((current) => !current)}
            className={[
              'inline-flex h-6 shrink-0 items-center justify-center rounded-md',
              'border border-border bg-muted px-1.5 text-xs font-semibold',
              'tabular-nums text-muted-foreground transition-colors',
              'hover:border-primary/30 hover:bg-primary/10 hover:text-primary',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            ].join(' ')}
          >
            +{remainingCount}
          </button>

          {isOpen && (
            <div
              id={popoverId}
              role="dialog"
              aria-label={t('table.role')}
              className={[
                'absolute start-0 top-full z-50 mt-2',
                'w-56 max-w-[calc(100vw-2rem)]',
                'rounded-lg border border-border bg-popover p-3',
                'text-popover-foreground shadow-lg',
                'animate-in fade-in-0 zoom-in-95',
              ].join(' ')}
              onClick={(event) => event.stopPropagation()}
            >
              <p className="mb-2 text-xs font-semibold text-muted-foreground">
                {t('table.role')}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {roles.map((role) => (
                  <span
                    key={role.id}
                    className="inline-flex max-w-full items-center rounded-md border border-border bg-muted/50 px-2 py-1 text-xs font-medium text-foreground"
                  >
                    {getRoleLabel(role, t)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function createUserColumns(
  t: UserColumnTranslator,
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
      id: 'roles',
      accessorFn: (row) =>
        row.roles?.map((role) => role.name).join(', ') ?? '',
      header: t('table.role'),
      size: 150,
      minSize: 120,
      cell: ({ row }) => (
        <UserRoleBadges
          roles={row.original.roles ?? []}
          t={t}
        />
      ),
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
            className={`inline-flex items-center whitespace-nowrap rounded-md border px-2 py-1 text-xs font-medium ${statusStyles}`}
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
