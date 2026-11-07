'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import {
  Eye,
  MoreHorizontal,
  Power,
  ShieldCheck,
  Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Link } from '@/i18n/navigation';

import { ConfirmDialog } from '@/shared/components/common/confirm-dialog';

import { UserRolesDialog } from '@/features/access-control/manage-user-roles/components/user-roles-dialog';

import { usePermission } from '@/features/auth/hooks/use-permission';
import { useDeleteUser } from '@/features/users/delete-user/hooks/use-delete-user';
import { useUpdateUserStatus } from '@/features/users/deactivate-user/hooks/use-update-user-status';

import type { User } from '../types/user.types';

interface Props {
  user: User;
  context?: 'list' | 'profile';
  onDeleted?: () => void;
}

export function UserManagementActions({
  user,
  context = 'list',
  onDeleted,
}: Props) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRolesDialogOpen, setIsRolesDialogOpen] = useState(false);

  const locale = useLocale();
  const direction = locale === 'fa' ? 'rtl' : 'ltr';

  const t = useTranslations('users.actions');

  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateUserStatus();

  const { canDeleteUser, canChangeRole, canEditUser } = usePermission();

  const currentStatus = user.status ?? 'active';
  const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';

  const hasManagementPermission =
    canDeleteUser || canChangeRole || canEditUser;

  if (context === 'profile' && !hasManagementPermission) {
    return null;
  }

  const handleDelete = () => {
    deleteUser(user.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        onDeleted?.();
      },
    });
  };

  return (
    <div onClick={(event) => event.stopPropagation()}>
      <div className="flex justify-center">
        <DropdownMenu dir={direction}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label={t('open')}
              title={t('open')}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            style={{ direction }}
            className="w-48"
          >
            {context === 'list' && (
              <>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/users/${user.id}`}
                    className="flex w-full items-center"
                  >
                    <Eye className="me-2 h-4 w-4 shrink-0" />
                    <span>{t('view')}</span>
                  </Link>
                </DropdownMenuItem>

                {hasManagementPermission && <DropdownMenuSeparator />}
              </>
            )}

            {canChangeRole && (
              <DropdownMenuItem
                onClick={(event) => {
                  event.stopPropagation();
                  setIsRolesDialogOpen(true);
                }}
              >
                <ShieldCheck className="me-2 h-4 w-4 shrink-0" />
                <span>{t('manageRoles')}</span>
              </DropdownMenuItem>
            )}

            {canChangeRole && canEditUser && (
              <DropdownMenuSeparator />
            )}

            {canEditUser && (
              <DropdownMenuItem
                disabled={isUpdatingStatus}
                onClick={() =>
                  updateStatus({
                    id: user.id,
                    status: nextStatus,
                  })
                }
              >
                <Power className="me-2 h-4 w-4 shrink-0" />
                <span>
                  {currentStatus === 'active'
                    ? t('deactivate')
                    : t('activate')}
                </span>
              </DropdownMenuItem>
            )}

            {canDeleteUser && (
              <>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-destructive"
                >
                  <Trash2 className="me-2 h-4 w-4 shrink-0" />
                  <span>{t('delete')}</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isRolesDialogOpen && (
        <UserRolesDialog
          open={isRolesDialogOpen}
          onOpenChange={setIsRolesDialogOpen}
          user={user}
        />
      )}

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={t('deleteTitle')}
        description={t('deleteDescription', {
          name: user.firstName,
        })}
        confirmText={t('confirmDelete')}
        loading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
