
"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { DataTable } from "@/shared/components/common/data-table";
import { EmptyState } from "@/shared/components/common/empty-state";
import { ErrorState } from "@/shared/components/common/error-state";
import { TableSkeleton } from "@/shared/components/common/table-skeleton";
import { DashboardLayout } from "@/shared/components/layout/dashboard-layout";

import { createProductColumns } from "@/features/products/components/products-columns";
import { ProductsFilters } from "./products-filters";
import { ProductsPagination } from "./products-pagination";

import { getErrorMessage } from "@/shared/lib/api-error";
import { useProductsView } from "../hooks/use-products-view";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Plus } from "lucide-react";

export default function ProductsPageView() {
  const t = useTranslations("products");
  const tableT = useTranslations("products.table");

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

  const columns = useMemo(
    () => createProductColumns((key) => tableT(key)),
    [tableT],
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

  const products = data?.data?.products ?? [];

  if (!products.length) {
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

          <Link href="/products/create">
            <Button>
              <Plus className="me-2 h-4 w-4" />
              {t("create")}
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

        <DataTable columns={columns} data={products} />

        <ProductsPagination
          page={page}
          setPage={setPage}
        />
      </div>
    </DashboardLayout>
  );
}
