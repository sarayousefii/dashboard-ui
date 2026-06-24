"use client";

import { DashboardLayout } from "@/shared/components/layout/dashboard-layout";

import { DataTable } from "@/shared/components/common/data-table";

import { TableSkeleton } from "@/shared/components/common/table-skeleton";

import { EmptyState } from "@/shared/components/common/empty-state";

import { ErrorState } from "@/shared/components/common/error-state";

import { getErrorMessage } from "@/shared/lib/api-error";

import { useUsersView } from "../hooks/use-users-view";

import { userColumns } from "./users-columns";

import { UsersFilters } from "./users-filters";

import { UsersPagination } from "./users-pagination";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function UsersPageView() {
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
          title="Something went wrong"
          description={getErrorMessage(error)}
        />
      </DashboardLayout>
    );
  }

  if (!data?.data?.users?.length) {
    return (
      <DashboardLayout>
        <EmptyState title="No users found" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            Users
          </h1>

          <Link href="/users/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create User
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
          columns={userColumns}
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