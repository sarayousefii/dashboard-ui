'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import {
  Activity,
  Cake,
  CheckCircle2,
  CircleDashed,
  Mail,
  Pencil,
  ShieldCheck,
  UserRound,
  X,
  type LucideIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { useRouter } from '@/i18n/navigation';

import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useUpdateUser } from '@/features/users/update-user/hooks/use-update-user';
import { UserForm } from '@/features/users/shared/components/user-form';
import { UserManagementActions } from '@/features/users/shared/components/user-management-actions';

import type { UserFormValues } from '@/features/users/shared/schemas/user-form.schema';
import type { User } from '@/features/users/shared/types/user.types';

import { profileKeys } from '../api/profile.query-keys';
import { useProfileQuery } from '../hooks/use-profile-query';
import { useUpdateMyProfile } from '../hooks/use-update-my-profile';

import { DashboardLayout } from '@/shared/components/layout/dashboard-layout';
import { hasPermission } from '@/shared/lib/permissions';

export default function ProfilePage() {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const router = useRouter();

  const userId = Number(params.id);
  const isValidId = Number.isInteger(userId) && userId > 0;

  const t = useTranslations('profile');
  const usersT = useTranslations('users');

  const [isEditing, setIsEditing] = useState(false);

  const currentUserQuery = useCurrentUser();
  const currentUser = currentUserQuery.data?.user as User | null | undefined;

  const isSelf = currentUser?.id === userId;

  const canViewProfile =
    !!currentUser && (isSelf || hasPermission(currentUser, 'users.view'));

  const canEditProfile =
    !!currentUser && (isSelf || hasPermission(currentUser, 'users.edit'));

  const profileQuery = useProfileQuery({
    userId,
    isSelf,
    enabled:
      !currentUserQuery.isLoading &&
      !!currentUser &&
      isValidId &&
      canViewProfile,
  });

  const updateMyProfile = useUpdateMyProfile();
  const updateUser = useUpdateUser();

  const user = profileQuery.data;

  const isSaving = isSelf ? updateMyProfile.isPending : updateUser.isPending;

  const handleSubmit = (values: UserFormValues) => {
    if (isSelf) {
      updateMyProfile.mutate(values, {
        onSuccess: () => {
          setIsEditing(false);
        },
      });

      return;
    }

    updateUser.mutate(
      {
        id: userId,
        data: values,
      },
      {
        onSuccess: async () => {
          setIsEditing(false);

          await queryClient.invalidateQueries({
            queryKey: profileKeys.detail(userId),
          });
        },
      },
    );
  };

  const roleLabel = user
    ? usersT(
        `roles.${user.role}` as 'roles.admin' | 'roles.editor' | 'roles.viewer',
      )
    : '';

  const status = user?.status ?? 'active';

  const statusLabel = usersT(
    `statuses.${status}` as
      'statuses.active' | 'statuses.inactive' | 'statuses.pending',
  );

  const statusStyles =
    status === 'active'
      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
      : status === 'pending'
        ? 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400'
        : 'border-muted-foreground/20 bg-muted text-muted-foreground';

  let content;

  if (currentUserQuery.isLoading) {
    content = <ProfileMessage message={t('loading')} />;
  } else if (!currentUser) {
    content = <ProfileMessage message={t('accessDenied')} />;
  } else if (!isValidId) {
    content = <ProfileMessage message={t('notFound')} />;
  } else if (!canViewProfile) {
    content = <ProfileMessage message={t('accessDenied')} />;
  } else if (profileQuery.isLoading) {
    content = <ProfileMessage message={t('loading')} />;
  } else if (profileQuery.isError || !user) {
    content = <ProfileMessage message={t('notFound')} />;
  } else if (isEditing && canEditProfile) {
    content = (
      <div className="w-full min-w-0 space-y-5">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-bold sm:text-2xl">
              {isSelf ? t('selfTitle') : t('title')}
            </h1>

            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              {t('description')}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => setIsEditing(false)}
          >
            <X className="size-4" />
            {t('cancel')}
          </Button>
        </div>

        <UserForm
          mode="edit"
          fullWidth
          initialValues={user}
          onSubmit={handleSubmit}
          isLoading={isSaving}
          title={t('form.editTitle')}
          description={t('form.manageDescription')}
          submitLabel={t('form.update')}
        />
      </div>
    );
  } else {
    const initials =
      `${user.firstName?.trim().charAt(0) ?? ''}${user.lastName?.trim().charAt(0) ?? ''}`.toUpperCase();

    content = (
      <div className="w-full min-w-0 space-y-5">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-base font-semibold sm:text-lg">
              {isSelf ? t('selfTitle') : t('title')}
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              {t('description')}
            </p>
          </div>

          <div className="flex w-full shrink-0 items-center gap-2 sm:w-auto">
            {canEditProfile && (
              <Button
                type="button"
                className="flex-1 sm:flex-none"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="size-4" />
                {t('edit')}
              </Button>
            )}

            {!isSelf && (
              <UserManagementActions
                user={user}
                context="profile"
                onDeleted={() => router.push('/users')}
              />
            )}
          </div>
        </div>

        <Card className="w-full gap-4 overflow-hidden p-3 sm:gap-5 sm:p-5">
          {/* Profile summary */}
          <div className="relative overflow-hidden rounded-xl border border-primary/15 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4 sm:p-5">
            <div className="pointer-events-none absolute -left-8 -top-12 size-36 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-background text-lg font-bold text-primary shadow-sm sm:size-16 sm:text-xl">
                {initials || <UserRound className="size-7" />}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="break-words text-base font-bold sm:text-lg">
                  {user.firstName} {user.lastName}
                </h2>

                <p className="mt-1 break-all text-xs text-muted-foreground sm:text-sm">
                  {user.email}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    <ShieldCheck className="size-3.5" />
                    {roleLabel}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles}`}
                  >
                    {status === 'active' ? (
                      <CheckCircle2 className="size-3.5" />
                    ) : (
                      <CircleDashed className="size-3.5" />
                    )}
                    {statusLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* User details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <span className="size-1.5 rounded-full bg-primary" />
              <h3 className="text-sm font-semibold">{t('title')}</h3>
            </div>

            <div className="grid w-full min-w-0 grid-cols-2 gap-2.5 sm:gap-3">
              <ProfileField
                icon={UserRound}
                label={t('fields.firstName')}
                value={user.firstName}
              />

              <ProfileField
                icon={UserRound}
                label={t('fields.lastName')}
                value={user.lastName}
              />

              <ProfileField
                icon={Mail}
                label={t('fields.email')}
                value={user.email}
              />

              <ProfileField
                icon={Cake}
                label={t('fields.age')}
                value={String(user.age)}
              />

              <ProfileField
                icon={ShieldCheck}
                label={t('fields.role')}
                value={roleLabel}
              />

              <ProfileField
                icon={Activity}
                label={t('fields.status')}
                value={statusLabel}
              />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto w-full min-w-0 max-w-5xl space-y-6">
        {content}
      </div>
    </DashboardLayout>
  );
}

interface ProfileFieldProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

function ProfileField({ icon: Icon, label, value }: ProfileFieldProps) {
  return (
    <div className="flex min-w-0 items-start gap-2.5 rounded-xl border border-border/70 bg-muted/20 p-3 transition-colors hover:border-primary/30 hover:bg-primary/[0.03] sm:gap-3 sm:p-3.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:size-9">
        <Icon className="size-4" />
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-[11px] leading-5 text-muted-foreground sm:text-xs">
          {label}
        </p>

        <p className="mt-0.5 break-all text-xs font-semibold leading-5 text-foreground sm:text-sm">
          {value || '—'}
        </p>
      </div>
    </div>
  );
}

function ProfileMessage({ message }: { message: string }) {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed bg-card p-6 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
