
'use client';

import { Pencil, UserRound, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { UserManagementActions } from '@/features/users/shared/components/user-management-actions';
import type { User } from '@/features/users/shared/types/user.types';

interface ProfilePageHeaderProps {
  title: string;
  description: string;
  editLabel: string;
  cancelLabel: string;
  mode: 'view' | 'edit';
  user: User;
  isSelf: boolean;
  canEdit: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onDeleted: () => void;
}

export function ProfilePageHeader({
  title,
  description,
  editLabel,
  cancelLabel,
  mode,
  user,
  isSelf,
  canEdit,
  onEdit,
  onCancel,
  onDeleted,
}: ProfilePageHeaderProps) {
  const isEditing = mode === 'edit';

  return (
    <div className="flex min-w-0 flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {isEditing ? (
            <Pencil className="size-5" />
          ) : (
            <UserRound className="size-5" />
          )}
        </div>

        <div className="min-w-0">
          <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
            {title}
          </h1>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      {isEditing ? (
        <Button
          type="button"
          variant="outline"
          className="w-full shrink-0 sm:w-auto"
          onClick={onCancel}
        >
          <X className="size-4" />
          {cancelLabel}
        </Button>
      ) : (
        (canEdit || !isSelf) && (
          <div className="flex w-full shrink-0 items-center gap-2 sm:w-auto">
            {canEdit && (
              <Button
                type="button"
                className="flex-1 sm:flex-none"
                onClick={onEdit}
              >
                <Pencil className="size-4" />
                {editLabel}
              </Button>
            )}

            {!isSelf && (
              <UserManagementActions
                user={user}
                context="profile"
                onDeleted={onDeleted}
              />
            )}
          </div>
        )
      )}
    </div>
  );
}
