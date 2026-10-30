"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { DataTable } from "@/shared/components/common/data-table";
import { EmptyState } from "@/shared/components/common/empty-state";
import { ErrorState } from "@/shared/components/common/error-state";
import { TableSkeleton } from "@/shared/components/common/table-skeleton";
import { DashboardLayout } from "@/shared/components/layout/dashboard-layout";

import { getErrorMessage } from "@/shared/lib/api-error";
import { useUsersView } from "../hooks/use-users-view";

import { createUserColumns } from "./users-columns";
import { UsersFilters } from "./users-filters";
import { UsersPagination } from "./users-pagination";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Plus } from "lucide-react";

export default function UsersPageView() {
  const t = useTranslations("users");

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

  const columns = useMemo(
    () => createUserColumns((key) => t(key)),
    [t],
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <TableSkeleton />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorState
          title={t("states.errorTitle")}
          description={getErrorMessage(error)}
        />
      </DashboardLayout>
    );
  }

  if (!data?.data?.users?.length) {
    return (
      <DashboardLayout>
        <EmptyState title={t("states.empty")} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            {t("title")}
          </h1>

          <Link href="/users/create">
            <Button>
              <Plus className="me-2 h-4 w-4" />
              {t("create")}
            </Button>
          </Link>
        </div>

        <UsersFilters
          search={search}
          sortBy={sortBy}
          order={order}
          onSearchChange={setSearch}
          onSortChange={setSortBy}
          onOrderChange={setOrder}
        />

        <DataTable
          columns={columns}
          data={data.data.users}
        />

        <UsersPagination
          page={page}
          setPage={setPage}
        />
      </div>
    </DashboardLayout>
  );
}