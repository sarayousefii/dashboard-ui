import { keepPreviousData, queryOptions } from '@tanstack/react-query';

import {
  DEFAULT_PAGE_SIZE,
  normalizePageSize,
} from '@/shared/constants/pagination';

import type { GetProductsParams } from '../types/product.types';

import { getProductById, getProducts } from './products.api';
import { productsKeys } from './products.query-keys';

export function productsListQuery(params: GetProductsParams) {
  const normalizedParams: GetProductsParams = {
    ...params,
    page: Math.max(1, Number(params.page ?? 1)),
    limit: normalizePageSize(
      params.limit ?? DEFAULT_PAGE_SIZE,
    ),
  };

  return queryOptions({
    queryKey: productsKeys.list(normalizedParams),

    queryFn: () => getProducts(normalizedParams),

    staleTime: 1000 * 60 * 2,

    placeholderData: keepPreviousData,
  });
}

export function productDetailQuery(id: number) {
  return queryOptions({
    queryKey: productsKeys.detail(id),

    queryFn: () => getProductById(id),

    staleTime: 1000 * 60 * 5,
  });
}