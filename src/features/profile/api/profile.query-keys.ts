import { usersKeys } from '@/features/users/shared/api/users.query-keys';

export const profileKeys = {
  all: [...usersKeys.all, 'profile'] as const,

  detail: (userId: number) => [...usersKeys.detail(userId), 'profile'] as const,
};
