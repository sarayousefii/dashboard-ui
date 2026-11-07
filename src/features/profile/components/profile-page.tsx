
'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState, type ReactNode } from 'react';

import {
  Activity,
  Cake,
  Mail,
  ShieldCheck,
  UserRound,
} from 'lucide-react';

import { Card } from '@/components/ui/card';

import { useRouter } from '@/i18n/navigation';

import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { UserForm } from '@/features/users/shared/components/user-form';
import { useUpdateUser } from '@/features/users/update-user/hooks/use-update-user';

import type { UserFormValues } from '@/features/users/shared/schemas/user-form.schema';
import type { User } from '@/features/users/shared/types/user.types';

import { profileKeys } from '../api/profile.query-keys';
import { useProfileQuery } from '../hooks/use-profile-query';
import { useUpdateMyProfile } from '../hooks/use-update-my-profile';

import { ProfileAvatarEditor } from './profile-avatar-editor';
import { ProfileDetails } from './profile-details';
import { ProfileMessage } from './profile-message';
import { ProfilePageHeader } from './profile-page-header';
import { ProfileSummary } from './profile-summary';

import { DashboardLayout } from '@/shared/components/layout/dashboard-layout';
import { hasPermission } from '@/shared/lib/permissions';

export default function ProfilePage() {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const router = useRouter();

  const userId = Number(params.id);
  const isValidId = Number.isInteger(userId) && userId > 0;

  const locale = useLocale();

  const t = useTranslations('profile');
  const usersT = useTranslations('users');

  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

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

  const roleLabels =
    user?.roles?.map((role) => {
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
    }) ?? [];

  const roleLabel =
    roleLabels.join(locale === 'fa' ? '، ' : ', ') || '—';

  const startEditing = () => {
    setAvatarUrl(user?.avatarUrl ?? null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setAvatarUrl(null);
  };

  const handleSubmit = (values: UserFormValues) => {
    const payload = {
      ...values,
      avatarUrl,
    };

    if (isSelf) {
      updateMyProfile.mutate(payload, {
        onSuccess: () => {
          setIsEditing(false);
          setAvatarUrl(null);
        },
      });

      return;
    }

    updateUser.mutate(
      {
        id: userId,
        data: payload,
      },
      {
        onSuccess: async () => {
          setIsEditing(false);
          setAvatarUrl(null);

          await queryClient.invalidateQueries({
            queryKey: profileKeys.detail(userId),
          });
        },
      },
    );
  };

  const status = user?.status ?? 'active';

  const statusLabel = usersT(
    `statuses.${status}` as
      | 'statuses.active'
      | 'statuses.inactive'
      | 'statuses.pending',
  );

  const statusStyles =
    status === 'active'
      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
      : status === 'pending'
        ? 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400'
        : 'border-muted-foreground/20 bg-muted text-muted-foreground';

  const pageTitle = isSelf ? t('selfTitle') : t('title');

  let content: ReactNode;

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
        <ProfilePageHeader
          mode="edit"
          title={pageTitle}
          description={t('form.manageDescription')}
          editLabel={t('edit')}
          cancelLabel={t('cancel')}
          user={user}
          isSelf={isSelf}
          canEdit={canEditProfile}
          onEdit={startEditing}
          onCancel={cancelEditing}
          onDeleted={() => router.push('/users')}
        />

        <div className="grid min-w-0 grid-cols-1 items-stretch gap-4 lg:grid-cols-[minmax(15rem,0.8fr)_minmax(0,1.4fr)]">
          <Card className="flex h-full min-w-0 flex-col gap-4 p-4 sm:p-5">
            <ProfileAvatarEditor
              value={avatarUrl}
              displayName={`${user.firstName} ${user.lastName}`}
              onChange={setAvatarUrl}
              disabled={isSaving}
            />
          </Card>

          <div className="min-w-0 [&>*]:h-full">
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
        </div>
      </div>
    );
  } else {
    content = (
      <div className="w-full min-w-0 space-y-5">
        <ProfilePageHeader
          mode="view"
          title={pageTitle}
          description={t('description')}
          editLabel={t('edit')}
          cancelLabel={t('cancel')}
          user={user}
          isSelf={isSelf}
          canEdit={canEditProfile}
          onEdit={startEditing}
          onCancel={cancelEditing}
          onDeleted={() => router.push('/users')}
        />

        <Card className="w-full gap-4 overflow-hidden p-3 sm:gap-5 sm:p-5">
          <ProfileSummary
            user={user}
            roleLabels={roleLabels}
            roleTitle={t('fields.role')}
            statusTitle={t('fields.status')}
            status={status}
            statusLabel={statusLabel}
            statusStyles={statusStyles}
          />

          <ProfileDetails
            title={t('title')}
            fields={[
              {
                id: 'firstName',
                icon: UserRound,
                label: t('fields.firstName'),
                value: user.firstName,
              },
              {
                id: 'lastName',
                icon: UserRound,
                label: t('fields.lastName'),
                value: user.lastName,
              },
              {
                id: 'email',
                icon: Mail,
                label: t('fields.email'),
                value: user.email,
              },
              {
                id: 'age',
                icon: Cake,
                label: t('fields.age'),
                value: String(user.age),
              },
              {
                id: 'role',
                icon: ShieldCheck,
                label: t('fields.role'),
                value: roleLabel,
              },
              {
                id: 'status',
                icon: Activity,
                label: t('fields.status'),
                value: statusLabel,
              },
            ]}
          />
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
