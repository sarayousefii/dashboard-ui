
'use client';

import {
  Check,
  ChevronDown,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  useEffect,
  useId,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import type { Role } from '@/features/access-control/shared/types/access-control.types';

import { useAssignUserRole } from '@/features/access-control/assign-user-role/hooks/use-assign-user-role';
import { useRevokeUserRole } from '@/features/access-control/revoke-user-role/hooks/use-revoke-user-role';
import { useAssignableRolesQuery } from '@/features/access-control/view-assignable-roles/hooks/use-assignable-roles-query';
import { useUserRolesQuery } from '@/features/access-control/view-user-roles/hooks/use-user-roles-query';

import type { User } from '@/features/users/shared/types/user.types';

import { ConfirmDialog } from '@/shared/components/common/confirm-dialog';
import { getErrorMessage } from '@/shared/lib/api-error';
import { appToast } from '@/shared/lib/toast';

interface UserRolesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

export function UserRolesDialog({
  open,
  onOpenChange,
  user,
}: UserRolesDialogProps) {
  const t = useTranslations('users.rolesManagement');
  const usersT = useTranslations('users');

  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [selectedRevokeRoleIds, setSelectedRevokeRoleIds] = useState<string[]>([]);
  const [isAssignDropdownOpen, setIsAssignDropdownOpen] = useState(false);
  const [isRevokeConfirmOpen, setIsRevokeConfirmOpen] = useState(false);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  const assignDropdownRef = useRef<HTMLDivElement>(null);
  const assignOptionsId = useId();

  const assignableRolesQuery = useAssignableRolesQuery();
  const userRolesQuery = useUserRolesQuery(user.id);

  const assignMutation = useAssignUserRole();
  const revokeMutation = useRevokeUserRole();

  const assignableRoles = assignableRolesQuery.data?.data ?? [];
  const currentRoles = userRolesQuery.data?.data.roles ?? [];

  const assignedRoleIds = new Set(
    currentRoles.map((role) => String(role.id)),
  );

  const availableRoles = assignableRoles.filter(
    (role) => !assignedRoleIds.has(String(role.id)),
  );

  const selectedAvailableRoles = availableRoles.filter((role) =>
    selectedRoleIds.includes(String(role.id)),
  );

  const isSaving =
    assignMutation.isPending ||
    revokeMutation.isPending ||
    isBulkProcessing;

  const isLoading =
    assignableRolesQuery.isLoading || userRolesQuery.isLoading;

  const queryError =
    assignableRolesQuery.error ?? userRolesQuery.error;

  // Close the assignment dropdown when clicking outside or pressing Escape.
  useEffect(() => {
    if (!isAssignDropdownOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (
        assignDropdownRef.current &&
        !assignDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAssignDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        setIsAssignDropdownOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAssignDropdownOpen]);

  const getRoleName = (role: Role): string => {
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
  };

  const getRoleDescription = (role: Role): string => {
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
  };

  const closeAfterSuccess = () => {
    setSelectedRoleIds([]);
    setSelectedRevokeRoleIds([]);
    setIsAssignDropdownOpen(false);
    setIsRevokeConfirmOpen(false);
    onOpenChange(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isSaving) {
      return;
    }

    onOpenChange(nextOpen);

    if (!nextOpen) {
      setSelectedRoleIds([]);
      setSelectedRevokeRoleIds([]);
      setIsAssignDropdownOpen(false);
      setIsRevokeConfirmOpen(false);
    }
  };

  const toggleSelection = (
    roleId: string,
    setSelectedIds: Dispatch<SetStateAction<string[]>>,
  ) => {
    setSelectedIds((current) =>
      current.includes(roleId)
        ? current.filter((id) => id !== roleId)
        : [...current, roleId],
    );
  };

  const handleAssign = async () => {
    if (selectedRoleIds.length === 0 || isSaving) {
      return;
    }

    const availableRoleIds = new Set(
      availableRoles.map((role) => String(role.id)),
    );

    const roleIdsToAssign = selectedRoleIds.filter((roleId) =>
      availableRoleIds.has(roleId),
    );

    if (roleIdsToAssign.length === 0) {
      setSelectedRoleIds([]);
      return;
    }

    setIsAssignDropdownOpen(false);
    setIsBulkProcessing(true);

    const failedRoleIds: string[] = [];
    let firstError: unknown;

    try {
      for (const roleId of roleIdsToAssign) {
        try {
          await assignMutation.mutateAsync({
            userId: user.id,
            roleId,
          });
        } catch (error) {
          failedRoleIds.push(roleId);
          firstError ??= error;
        }
      }

      const successfulCount =
        roleIdsToAssign.length - failedRoleIds.length;

      if (failedRoleIds.length > 0) {
        setSelectedRoleIds(failedRoleIds);

        await userRolesQuery.refetch();

        if (successfulCount > 0) {
          appToast.success(
            t('assignedMultiple', { count: successfulCount }),
          );

          appToast.error(
            t('assignPartialFailed', {
              count: failedRoleIds.length,
            }),
          );
        } else {
          appToast.error(
            getErrorMessage(firstError) || t('assignFailed'),
          );
        }

        return;
      }

      appToast.success(
        successfulCount === 1
          ? t('assigned')
          : t('assignedMultiple', { count: successfulCount }),
      );

      closeAfterSuccess();
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleRevokeSelected = async () => {
    if (selectedRevokeRoleIds.length === 0 || isSaving) {
      return;
    }

    const currentRoleIds = new Set(
      currentRoles.map((role) => String(role.id)),
    );

    const roleIdsToRevoke = selectedRevokeRoleIds.filter((roleId) =>
      currentRoleIds.has(roleId),
    );

    if (roleIdsToRevoke.length === 0) {
      setSelectedRevokeRoleIds([]);
      setIsRevokeConfirmOpen(false);
      return;
    }

    setIsBulkProcessing(true);

    const failedRoleIds: string[] = [];
    let firstError: unknown;

    try {
      for (const roleId of roleIdsToRevoke) {
        try {
          await revokeMutation.mutateAsync({
            userId: user.id,
            roleId,
          });
        } catch (error) {
          failedRoleIds.push(roleId);
          firstError ??= error;
        }
      }

      setIsRevokeConfirmOpen(false);

      const successfulCount =
        roleIdsToRevoke.length - failedRoleIds.length;

      if (failedRoleIds.length > 0) {
        setSelectedRevokeRoleIds(failedRoleIds);

        await userRolesQuery.refetch();

        if (successfulCount > 0) {
          appToast.success(
            t('revokedMultiple', { count: successfulCount }),
          );

          appToast.error(
            t('revokePartialFailed', {
              count: failedRoleIds.length,
            }),
          );
        } else {
          appToast.error(
            getErrorMessage(firstError) || t('revokeFailed'),
          );
        }

        return;
      }

      appToast.success(
        successfulCount === 1
          ? t('revoked')
          : t('revokedMultiple', { count: successfulCount }),
      );

      closeAfterSuccess();
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const retryQueries = () => {
    void assignableRolesQuery.refetch();
    void userRolesQuery.refetch();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="max-h-[85vh] overflow-y-auto sm:max-w-lg"
          onClick={(event) => event.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              {t('title')}
            </DialogTitle>

            <DialogDescription>
              {t('description', {
                name: `${user.firstName} ${user.lastName}`,
              })}
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              {t('loading')}
            </div>
          ) : queryError ? (
            <div className="space-y-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
              <p className="text-sm text-destructive">
                {getErrorMessage(queryError) || t('loadFailed')}
              </p>

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={retryQueries}
              >
                {t('retry')}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Assigned roles: multi-select list */}
              <details className="group rounded-lg border border-border">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-muted/40 [&::-webkit-details-marker]:hidden">
                  <div className="flex min-w-0 items-center gap-2">
                    <ShieldCheck className="size-4 shrink-0 text-primary" />

                    <span className="text-sm font-semibold">
                      {t('currentRoles')}
                    </span>

                    <span className="rounded-md bg-muted px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
                      {currentRoles.length}
                    </span>
                  </div>

                  <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>

                <div className="space-y-3 border-t border-border px-3 py-3">
                  {currentRoles.length === 0 ? (
                    <div className="py-4 text-center text-sm text-muted-foreground">
                      {t('noRoles')}
                    </div>
                  ) : (
                    <>
                      <div
                        role="group"
                        aria-label={t('selectRolesToRevoke')}
                        className="max-h-56 space-y-2 overflow-y-auto pe-1"
                      >
                        {currentRoles.map((role) => {
                          const selected = selectedRevokeRoleIds.includes(
                            String(role.id),
                          );

                          return (
                            <button
                              key={role.id}
                              type="button"
                              aria-pressed={selected}
                              disabled={isSaving}
                              onClick={() =>
                                toggleSelection(
                                  String(role.id),
                                  setSelectedRevokeRoleIds,
                                )
                              }
                              className={[
                                'flex w-full items-start gap-3 rounded-lg border p-3 text-start transition-colors',
                                selected
                                  ? 'border-destructive/40 bg-destructive/5'
                                  : 'border-border bg-card hover:bg-muted/40',
                                'disabled:cursor-not-allowed disabled:opacity-60',
                              ].join(' ')}
                            >
                              <span
                                className={[
                                  'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border',
                                  selected
                                    ? 'border-destructive bg-destructive text-destructive-foreground'
                                    : 'border-muted-foreground/40 text-transparent',
                                ].join(' ')}
                              >
                                {selected && <Check className="size-3.5" />}
                              </span>

                              <span className="min-w-0 flex-1 space-y-1">
                                <span className="block text-sm font-medium text-foreground">
                                  {getRoleName(role)}
                                </span>

                                {getRoleDescription(role) && (
                                  <span className="block text-xs leading-5 text-muted-foreground">
                                    {getRoleDescription(role)}
                                  </span>
                                )}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex flex-col gap-2 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-xs text-muted-foreground">
                          {t('selectedCount', {
                            count: selectedRevokeRoleIds.length,
                          })}
                        </span>

                        <Button
                          type="button"
                          variant="destructive"
                          disabled={
                            selectedRevokeRoleIds.length === 0 || isSaving
                          }
                          onClick={() => setIsRevokeConfirmOpen(true)}
                        >
                          {t('revokeSelected', {
                            count: selectedRevokeRoleIds.length,
                          })}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </details>

              {/* Assign roles: multi-select dropdown */}
              <section className="space-y-3 border-t border-border pt-5">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold">
                    {t('assignRole')}
                  </h3>

                  <p className="text-xs text-muted-foreground">
                    {t('assignDescription')}
                  </p>
                </div>

                {availableRoles.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border px-4 py-4 text-sm text-muted-foreground">
                    {t('noAvailableRoles')}
                  </div>
                ) : (
                  <>
                    <div ref={assignDropdownRef} className="relative">
                      <Button
                        type="button"
                        variant="outline"
                        aria-haspopup="listbox"
                        aria-expanded={isAssignDropdownOpen}
                        aria-controls={assignOptionsId}
                        disabled={isSaving}
                        onClick={() =>
                          setIsAssignDropdownOpen((current) => !current)
                        }
                        className="h-auto min-h-11 w-full justify-between gap-3 px-3 py-2 text-start"
                      >
                        <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                          {selectedAvailableRoles.length > 0 ? (
                            selectedAvailableRoles.map((role) => (
                              <span
                                key={role.id}
                                className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                              >
                                {getRoleName(role)}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm font-normal text-muted-foreground">
                              {t('assignDescription')}
                            </span>
                          )}
                        </span>

                        <ChevronDown
                          className={[
                            'size-4 shrink-0 text-muted-foreground transition-transform',
                            isAssignDropdownOpen ? 'rotate-180' : '',
                          ].join(' ')}
                        />
                      </Button>

                      {isAssignDropdownOpen && (
                        <div
                          id={assignOptionsId}
                          role="listbox"
                          aria-label={t('assignRole')}
                          aria-multiselectable="true"
                          className="absolute inset-x-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-lg border border-border bg-popover p-2 text-popover-foreground shadow-lg"
                        >
                          {availableRoles.map((role) => {
                            const selected = selectedRoleIds.includes(
                              String(role.id),
                            );

                            return (
                              <button
                                key={role.id}
                                type="button"
                                role="option"
                                aria-selected={selected}
                                disabled={isSaving}
                                onClick={() =>
                                  toggleSelection(
                                    String(role.id),
                                    setSelectedRoleIds,
                                  )
                                }
                                className={[
                                  'flex w-full items-start gap-3 rounded-md p-3 text-start transition-colors',
                                  selected
                                    ? 'bg-primary/10'
                                    : 'hover:bg-muted',
                                  'disabled:cursor-not-allowed disabled:opacity-60',
                                ].join(' ')}
                              >
                                <span
                                  className={[
                                    'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border',
                                    selected
                                      ? 'border-primary bg-primary text-primary-foreground'
                                      : 'border-muted-foreground/40',
                                  ].join(' ')}
                                >
                                  {selected && (
                                    <Check className="size-3.5" />
                                  )}
                                </span>

                                <span className="min-w-0 flex-1 space-y-1">
                                  <span className="block text-sm font-medium">
                                    {getRoleName(role)}
                                  </span>

                                  {getRoleDescription(role) && (
                                    <span className="block text-xs leading-5 text-muted-foreground">
                                      {getRoleDescription(role)}
                                    </span>
                                  )}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-xs text-muted-foreground">
                        {t('selectedCount', {
                          count: selectedAvailableRoles.length,
                        })}
                      </span>

                      <Button
                        type="button"
                        onClick={handleAssign}
                        disabled={
                          selectedAvailableRoles.length === 0 || isSaving
                        }
                      >
                        {isSaving && (
                          <Loader2 className="size-4 animate-spin" />
                        )}

                        {t('assignSelected', {
                          count: selectedAvailableRoles.length,
                        })}
                      </Button>
                    </div>
                  </>
                )}
              </section>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSaving}
            >
              {t('cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isRevokeConfirmOpen}
        onOpenChange={(nextOpen) => {
          if (!isSaving) {
            setIsRevokeConfirmOpen(nextOpen);
          }
        }}
        title={t('revokeMultipleTitle')}
        description={t('revokeMultipleDescription', {
          name: `${user.firstName} ${user.lastName}`,
          count: selectedRevokeRoleIds.length,
        })}
        confirmText={t('confirmRevokeSelected')}
        cancelText={t('cancel')}
        loading={isSaving}
        onConfirm={handleRevokeSelected}
      />
    </>
  );
}
