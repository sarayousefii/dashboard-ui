'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useRouter } from '@/i18n/navigation';

import { usePermission } from '@/features/auth/hooks/use-permission';
import CreateUserForm from '@/features/users/create-user/components/create-user-form';

import { DataTable } from '@/shared/components/common/data-table';
import { EmptyState } from '@/shared/components/common/empty-state';
import { ErrorState } from '@/shared/components/common/error-state';
import { TableSkeleton } from '@/shared/components/common/table-skeleton';
import { DashboardLayout } from '@/shared/components/layout/dashboard-layout';
import { getErrorMessage } from '@/shared/lib/api-error';

import { useUsersView } from '../hooks/use-users-view';
import { createUserColumns } from './users-columns';
import { UsersFilters } from './users-filters';
import { UsersPagination } from './users-pagination';

export default function UsersPageView() {
  const t = useTranslations('users');
  const router = useRouter();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { canCreateUser } = usePermission();

  const {
    data,
    isLoading,
    error,
    page,
    search,
    sortBy,
    order,
    setPage,
    setSearch,
    setSortBy,
    setOrder,
  } = useUsersView();

  const users = data?.data?.users ?? [];

  const columns = useMemo(() => createUserColumns((key) => t(key)), [t]);

  let tableContent;

  if (isLoading) {
    tableContent = <TableSkeleton />;
  } else if (error) {
    tableContent = (
      <ErrorState
        title={t('states.errorTitle')}
        description={getErrorMessage(error)}
      />
    );
  } else if (users.length === 0) {
    tableContent = <EmptyState title={t('states.empty')} />;
  } else {
    tableContent = (
      <div className="space-y-3">
        <DataTable
          columns={columns}
          data={users}
          onRowClick={(user) => {
            router.push(`/users/${user.id}`);
          }}
        />

        <UsersPagination page={page} setPage={setPage} />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-6xl space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="size-5" />
            </div>

            <div className="space-y-0.5">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                {t('title')}
              </h1>
            </div>
          </div>

          {canCreateUser && (
            <Button
              type="button"
              size="sm"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="size-4" />
              {t('create')}
            </Button>
          )}
        </div>

        <UsersFilters
          search={search}
          sortBy={sortBy}
          order={order}
          onSearchChange={setSearch}
          onSortChange={setSortBy}
          onOrderChange={setOrder}
        />

        {tableContent}
      </div>

      {canCreateUser && (
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="sr-only">
                {t('form.createTitle')}
              </DialogTitle>

              <DialogDescription className="sr-only">
                {t('form.manageDescription')}
              </DialogDescription>
            </DialogHeader>

            <CreateUserForm onCreated={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
}
