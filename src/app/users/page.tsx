import {
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

import { getQueryClient } from "@/shared/lib/react-query";

import { usersListQuery } from "@/features/users/api/users.query-options";

import UsersPageView from "@/features/users/components/users-page-view";
import { PermissionGuard } from "@/features/auth/components/permission-guard";
import type { Metadata } from "next";

export const metadata = {
  title: "Users",
  description: "Manage users",
};

interface Props {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sortBy?: string;
    order?: string;
  }>;
}

export default async function UsersPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(
    usersListQuery({
      page: Number(params.page) || 1,
      search: params.search || "",
      sortBy: params.sortBy || "",
      order: params.order || "",
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>

      <PermissionGuard permission="users.view" >

        <UsersPageView />

      </PermissionGuard>
      
    </HydrationBoundary>
  );
}