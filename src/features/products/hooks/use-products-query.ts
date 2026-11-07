import { useQuery } from '@tanstack/react-query';

import { DEFAULT_PAGE_SIZE } from '@/shared/constants/pagination';

import { productsListQuery } from '../api/products.query-options';

interface Props {
  page: number;
  pageSize?: number;
  search: string;
  sortBy?: string;
  order?: string;
}

export function useProductsQuery({
  page,
  pageSize = DEFAULT_PAGE_SIZE,
  search,
  sortBy,
  order,
}: Props) {
  return useQuery(
    productsListQuery({
      page,
      limit: pageSize,
      search,
      sortBy,
      order,
    }),
  );
}