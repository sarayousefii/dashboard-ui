
'use client';

import { Plus, RefreshCw, ShieldCheck, Trash2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ConfirmDialog } from '@/shared/components/common/confirm-dialog';

import { useAssignUserRole } from '../../assign-user-role/hooks/use-assign-user-role';
import { useRevokeUserRole } from '../../revoke-user-role/hooks/use-revoke-user-role';
import { useAssignableRolesQuery } from '../../view-assignable-roles/hooks/use-assignable-roles-query';
import { useUserRolesQuery } from '../../view-user-roles/hooks/use-user-roles-query';

import type { Role } from '../../shared/types/access-control.types';

interface UserRolesSectionProps {
  userId: number;
  canManageRoles: boolean;
}

export function UserRolesSection({
  userId,
  canManageRoles,
}: UserRolesSectionProps) {
  const locale = useLocale();
  const direction = locale === 'fa' ? 'rtl' : 'ltr';

  const t = useTranslations('users.rolesManagement');
  const usersT = useTranslations('users');

  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isRevokeDialogOpen, setIsRevokeDialogOpen] = useState(false);
  const [isRevokeConfirmOpen, setIsRevokeConfirmOpen] = useState(false);

  const [selectedAssignRoleIds, setSelectedAssignRoleIds] = useState<string[]>(
    [],
  );

  const [selectedRevokeRoleIds, setSelectedRevokeRoleIds] = useState<string[]>(
    [],
  );

  const [assignError, setAssignError] = useState<string | null>(null);
  const [revokeError, setRevokeError] = useState<string | null>(null);

  const userRolesQuery = useUserRolesQuery(userId);

  const assignableRolesQuery = useAssignableRolesQuery({
    enabled: canManageRoles && isAssignDialogOpen,
  });

  const assignMutation = useAssignUserRole();
  const revokeMutation = useRevokeUserRole();

  const assignedRoles = userRolesQuery.data?.data.roles ?? [];
  const assignableRoles = assignableRolesQuery.data?.data ?? [];

  const availableRoles = assignableRoles.filter(
    (role) =>
      !assignedRoles.some((assignedRole) => assignedRole.id === role.id),
  );

  function getRoleLabel(role: Role) {
    switch (role.slug) {
      case 'admin':
        return usersT('roles.admin');

      case 'editor':
        return usersT('roles.editor');

      case 'viewer':
        return usersT('roles.viewer');

      default:
        return role.name;
    }
  }

  function getRoleDescription(role: Role) {
    switch (role.slug) {
      case 'admin':
        return t('roleDescriptions.admin');

      case 'editor':
        return t('roleDescriptions.editor');

      case 'viewer':
        return t('roleDescriptions.viewer');

      default:
        return role.description;
    }
  }

  function toggleRoleSelection(
    roleId: string,
    selected: boolean,
    currentIds: string[],
    updateSelection: (ids: string[]) => void,
  ) {
    if (selected) {
      updateSelection(
        currentIds.includes(roleId) ? currentIds : [...currentIds, roleId],
      );
      return;
    }

    updateSelection(currentIds.filter((id) => id !== roleId));
  }

  function handleAssignDialogChange(open: boolean) {
    if (assignMutation.isPending) {
      return;
    }

    setIsAssignDialogOpen(open);

    if (!open) {
      setSelectedAssignRoleIds([]);
      setAssignError(null);
    }
  }

  async function handleAssignRoles() {
    if (!canManageRoles || selectedAssignRoleIds.length === 0) {
      return;
    }

    const requestedRoleIds = [...selectedAssignRoleIds];
    const failedRoleIds: string[] = [];

    setAssignError(null);

    for (const roleId of requestedRoleIds) {
      try {
        await assignMutation.mutateAsync({
          userId,
          roleId,
        });
      } catch {
        failedRoleIds.push(roleId);
      }
    }

    if (failedRoleIds.length > 0) {
      setSelectedAssignRoleIds(failedRoleIds);

      setAssignError(
        failedRoleIds.length === requestedRoleIds.length
          ? t('assignFailed')
          : t('assignPartialFailed'),
      );

      return;
    }

    setIsAssignDialogOpen(false);
    setSelectedAssignRoleIds([]);
    setAssignError(null);
  }

  function handleRevokeDialogChange(open: boolean) {
    if (revokeMutation.isPending) {
      return;
    }

    setIsRevokeDialogOpen(open);

    if (!open) {
      setSelectedRevokeRoleIds([]);
      setRevokeError(null);
    }
  }

  function openRevokeConfirmation() {
    if (!canManageRoles || selectedRevokeRoleIds.length === 0) {
      return;
    }

    setRevokeError(null);
    setIsRevokeDialogOpen(false);
    setIsRevokeConfirmOpen(true);
  }

  function handleRevokeConfirmationChange(open: boolean) {
    if (revokeMutation.isPending) {
      return;
    }

    setIsRevokeConfirmOpen(open);

    if (!open) {
      setIsRevokeDialogOpen(true);
    }
  }

  async function handleRevokeRoles() {
    if (!canManageRoles || selectedRevokeRoleIds.length === 0) {
      return;
    }

    const requestedRoleIds = [...selectedRevokeRoleIds];
    const failedRoleIds: string[] = [];

    setRevokeError(null);

    for (const roleId of requestedRoleIds) {
      try {
        await revokeMutation.mutateAsync({
          userId,
          roleId,
        });
      } catch {
        failedRoleIds.push(roleId);
      }
    }

    setIsRevokeConfirmOpen(false);

    if (failedRoleIds.length > 0) {
      setSelectedRevokeRoleIds(failedRoleIds);

      setRevokeError(
        failedRoleIds.length === requestedRoleIds.length
          ? t('revokeFailed')
          : t('revokePartialFailed'),
      );

      setIsRevokeDialogOpen(true);
      return;
    }

    setSelectedRevokeRoleIds([]);
    setRevokeError(null);
  }

  const selectedRevokeRoleNames = assignedRoles
    .filter((role) => selectedRevokeRoleIds.includes(role.id))
    .map(getRoleLabel)
    .join(locale === 'fa' ? '، ' : ', ');

  function renderRoleOption(
    role: Role,
    selected: boolean,
    onChange: (checked: boolean) => void,
    disabled: boolean,
    variant: 'default' | 'destructive' = 'default',
  ) {
    const description = getRoleDescription(role);

    return (
      <label
        key={role.id}
        dir={direction}
        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-start transition-colors ${
          variant === 'destructive'
            ? 'border-border/70 bg-muted/20 hover:border-destructive/40 hover:bg-destructive/[0.03] has-[:checked]:border-destructive/40 has-[:checked]:bg-destructive/[0.04]'
            : 'border-border/70 bg-muted/20 hover:border-primary/40 hover:bg-primary/[0.03] has-[:checked]:border-primary/40 has-[:checked]:bg-primary/[0.05]'
        }`}
      >
        <input
          type="checkbox"
          checked={selected}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-1 size-4 shrink-0 cursor-pointer accent-primary"
        />

        <span className="min-w-0 flex-1">
          <span className="block break-words text-sm font-medium text-foreground">
            {getRoleLabel(role)}
          </span>

          {description && (
            <span className="mt-1 block break-words text-xs leading-5 text-muted-foreground">
              {description}
            </span>
          )}
        </span>
      </label>
    );
  }

  return (
    <>
      <section
        dir={direction}
        className="flex h-full min-h-full w-full min-w-0 flex-col rounded-xl border border-border bg-card p-4 sm:p-5"
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </div>

            <div className="min-w-0">
              <h3 className="font-semibold">{t('title')}</h3>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {t('description')}
              </p>
            </div>
          </div>

          {canManageRoles && (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                onClick={() => setIsAssignDialogOpen(true)}
              >
                <Plus className="size-4" />
                {t('assignRole')}
              </Button>

              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={
                  userRolesQuery.isPending ||
                  userRolesQuery.isError ||
                  assignedRoles.length === 0
                }
                onClick={() => setIsRevokeDialogOpen(true)}
              >
                <Trash2 className="size-4" />
                {t('revoke')}
              </Button>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground">
            {t('currentRoles')}
          </h4>

          {userRolesQuery.isPending && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              {t('loading')}
            </p>
          )}

          {userRolesQuery.isError && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-destructive/5 p-4">
              <p className="text-sm text-destructive">{t('loadFailed')}</p>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => userRolesQuery.refetch()}
              >
                <RefreshCw className="size-4" />
                {t('retry')}
              </Button>
            </div>
          )}

          {userRolesQuery.isSuccess && assignedRoles.length === 0 && (
            <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              {t('noRoles')}
            </p>
          )}

          {userRolesQuery.isSuccess && assignedRoles.length > 0 && (
            <div className="space-y-2">
              {assignedRoles.map((role) => (
                <div
                  key={role.id}
                  className="flex min-w-0 items-start gap-3 rounded-lg border border-border/70 bg-muted/20 p-3"
                >
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ShieldCheck className="size-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="break-words text-sm font-medium">
                      {getRoleLabel(role)}
                    </p>

                    {getRoleDescription(role) && (
                      <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">
                        {getRoleDescription(role)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Assign roles */}
      <Dialog
        open={isAssignDialogOpen}
        onOpenChange={handleAssignDialogChange}
      >
        <DialogContent dir={direction}>
          <DialogHeader>
            <DialogTitle>{t('assignRole')}</DialogTitle>

            <DialogDescription>
              {t('assignDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {assignableRolesQuery.isPending && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                {t('loading')}
              </p>
            )}

            {assignableRolesQuery.isError && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-destructive">{t('loadFailed')}</p>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => assignableRolesQuery.refetch()}
                >
                  <RefreshCw className="size-4" />
                  {t('retry')}
                </Button>
              </div>
            )}

            {assignableRolesQuery.isSuccess &&
              availableRoles.length === 0 && (
                <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                  {t('noAvailableRoles')}
                </p>
              )}

            {assignableRolesQuery.isSuccess &&
              availableRoles.length > 0 && (
                <div className="max-h-64 space-y-2 overflow-y-auto pe-1">
                  {availableRoles.map((role) =>
                    renderRoleOption(
                      role,
                      selectedAssignRoleIds.includes(role.id),
                      (checked) =>
                        toggleRoleSelection(
                          role.id,
                          checked,
                          selectedAssignRoleIds,
                          setSelectedAssignRoleIds,
                        ),
                      assignMutation.isPending,
                    ),
                  )}
                </div>
              )}

            {assignError && (
              <p role="alert" className="text-sm text-destructive">
                {assignError}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={assignMutation.isPending}
              onClick={() => handleAssignDialogChange(false)}
            >
              {t('cancel')}
            </Button>

            <Button
                type="button"
                disabled={
                    selectedAssignRoleIds.length === 0 ||
                    assignMutation.isPending ||
                    assignableRolesQuery.isPending ||
                    !assignableRolesQuery.isSuccess
                }
                onClick={handleAssignRoles}
                >
                {assignMutation.isPending
                    ? t('assigning')
                    : t('assignSelected', { count: selectedAssignRoleIds.length })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Select roles to revoke */}
      <Dialog
        open={isRevokeDialogOpen}
        onOpenChange={handleRevokeDialogChange}
      >
        <DialogContent dir={direction}>
          <DialogHeader>
            <DialogTitle>{t('revoke')}</DialogTitle>

            <DialogDescription>
              {t('selectRolesToRevoke')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {assignedRoles.length === 0 && (
              <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                {t('noRoles')}
              </p>
            )}

            {assignedRoles.length > 0 && (
              <div className="max-h-64 space-y-2 overflow-y-auto pe-1">
                {assignedRoles.map((role) =>
                  renderRoleOption(
                    role,
                    selectedRevokeRoleIds.includes(role.id),
                    (checked) =>
                      toggleRoleSelection(
                        role.id,
                        checked,
                        selectedRevokeRoleIds,
                        setSelectedRevokeRoleIds,
                      ),
                    revokeMutation.isPending,
                    'destructive',
                  ),
                )}
              </div>
            )}

            {revokeError && (
              <p role="alert" className="text-sm text-destructive">
                {revokeError}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={revokeMutation.isPending}
              onClick={() => handleRevokeDialogChange(false)}
            >
              {t('cancel')}
            </Button>

            <Button
                type="button"
                variant="destructive"
                disabled={
                    selectedRevokeRoleIds.length === 0 ||
                    revokeMutation.isPending
                }
                onClick={openRevokeConfirmation}
                >
                {t('revokeSelected', { count: selectedRevokeRoleIds.length })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm multiple revocations */}
        <ConfirmDialog
            open={isRevokeConfirmOpen}
            onOpenChange={handleRevokeConfirmationChange}
            title={t('revokeMultipleTitle')}
            description={t('revokeMultipleDescription', {
                count: selectedRevokeRoleIds.length,
            })}
            confirmText={t('confirmRevokeSelected')}
            onConfirm={handleRevokeRoles}
            loading={revokeMutation.isPending}
        />
    </>
  );
}
