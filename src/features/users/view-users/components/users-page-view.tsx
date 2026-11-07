
'use client';

import { Plus, UserRoundPlus, Users, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
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
        {/* Page header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
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
              className="rounded-lg shadow-sm"
            >
              <Plus className="size-4" />
              {t('create')}
            </Button>
          )}
        </div>

        {/* Filters */}
        <UsersFilters
          search={search}
          sortBy={sortBy}
          order={order}
          onSearchChange={setSearch}
          onSortChange={setSortBy}
          onOrderChange={setOrder}
        />

        {/* Table content */}
        {tableContent}
      </div>

      {/* Create user dialog */}
      {canCreateUser && (
        <Dialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        >
          <DialogContent
            showCloseButton={false}
            className="flex max-h-[90vh] w-[calc(100%-2rem)] flex-col gap-0 overflow-y-auto rounded-2xl border-border bg-card p-0 shadow-2xl sm:max-w-[38rem]"
          >
            <DialogHeader className="shrink-0 border-b border-border bg-muted/30 px-6 py-4 text-start pe-0 sm:px-7">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <UserRoundPlus className="size-4" />
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <DialogTitle className="text-sm font-semibold leading-5 text-foreground">
                      {t('form.createTitle')}
                    </DialogTitle>

                    <DialogDescription className="text-[11px] leading-4 text-muted-foreground">
                      {t('form.manageDescription')}
                    </DialogDescription>
                  </div>
                </div>

                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Close dialog"
                    title="Close"
                    className="size-8 shrink-0 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <X className="size-4" />
                    <span className="sr-only">Close dialog</span>
                  </Button>
                </DialogClose>
              </div>
            </DialogHeader>

            <div className="mt-6 min-w-0">
              <CreateUserForm
                variant="dialog"
                onCreated={() => setIsCreateDialogOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
}
