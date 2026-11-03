'use client';

import { useTranslations } from 'next-intl';

import { UserForm } from '@/features/users/shared/components/user-form';
import { appToast } from '@/shared/lib/toast';

import { useCreateUser } from '../hooks/use-create-user';

interface Props {
  onCreated: () => void;
}

export default function CreateUserForm({ onCreated }: Props) {
  const createUser = useCreateUser();
  const t = useTranslations('users.notifications');

  return (
    <UserForm
      mode="create"
      isLoading={createUser.isPending}
      onSubmit={(values) =>
        createUser.mutate(values, {
          onSuccess: () => {
            appToast.success(t('created'));
            onCreated();
          },
        })
      }
    />
  );
}
