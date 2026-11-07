'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';

import { Link } from '@/i18n/navigation';

import { DataTable } from '@/shared/components/common/data-table';
import { EmptyState } from '@/shared/components/common/empty-state';
import { ErrorState } from '@/shared/components/common/error-state';
import { Pagination } from '@/shared/components/common/pagination';
import { TableSkeleton } from '@/shared/components/common/table-skeleton';
import { DashboardLayout } from '@/shared/components/layout/dashboard-layout';

import { getErrorMessage } from '@/shared/lib/api-error';

import { createProductColumns } from '@/features/products/components/products-columns';
import { ProductsFilters } from './products-filters';

import { useProductsView } from '../hooks/use-products-view';

export default function ProductsPageView() {
  const t = useTranslations('products');
  const tableT = useTranslations('products.table');

  const {
    data,
    isLoading,
    error,
    page,
    pageSize,
    search,
    sortBy,
    order,
    setSearch,
    setPage,
    setPageSize,
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
          title={t('states.errorTitle')}
          description={getErrorMessage(error)}
        />
      </DashboardLayout>
    );
  }

  const products = data?.data?.products ?? [];
  const total = data?.data?.total ?? 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            {t('title')}
          </h1>

          <Link href="/products/create">
            <Button>
              <Plus className="me-2 h-4 w-4" />
              {t('create')}
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <ProductsFilters
          search={search}
          sortBy={sortBy}
          order={order}
          onSearchChange={setSearch}
          onSortChange={setSortBy}
          onOrderChange={setOrder}
        />

        {/* Table */}
        {products.length > 0 ? (
          <DataTable
            columns={columns}
            data={products}
          />
        ) : (
          <EmptyState title={t('states.empty')} />
        )}

        {/* Pagination */}
        {data && (
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        )}
      </div>
    </DashboardLayout>
  );
}