"use client";

import { DashboardLayout } from "@/shared/components/layout/dashboard-layout";
import { DataTable } from "@/shared/components/common/data-table";
import { TableSkeleton } from "@/shared/components/common/table-skeleton";
import { EmptyState } from "@/shared/components/common/empty-state";
import { ErrorState } from "@/shared/components/common/error-state";

import { productColumns } from "@/features/products/components/products-columns";
import { ProductsFilters } from "./products-filters";
import { ProductsPagination } from "./products-pagination";

import { useProductsView } from "../hooks/use-products-view";
import { getErrorMessage } from "@/shared/lib/api-error";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ProductsPageView() {
  const {
    data,
    isLoading,
    error,

    page,
    search,
    sortBy,
    order,

    setSearch,
    setPage,
    setSortBy,
    setOrder,
  } = useProductsView();

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

  const products = data?.data?.products ?? [];

  if (!products.length) {
    return (
      <DashboardLayout>
        <EmptyState title="No products found" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            Products
          </h1>

          <Link href="/products/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Product
            </Button>
          </Link>
        </div>

        <ProductsFilters
          search={search}
          sortBy={sortBy}
          order={order}
          onSearchChange={setSearch}
          onSortChange={setSortBy}
          onOrderChange={setOrder}
        />

        <DataTable columns={productColumns} data={products} />

        <ProductsPagination page={page} setPage={setPage} />
      </div>
    </DashboardLayout>
  );
}