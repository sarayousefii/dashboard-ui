import { queryOptions, keepPreviousData } from "@tanstack/react-query";
import { getProducts, getProductById } from "./products.api";
import { productsKeys } from "./products.query-keys";

export function productsListQuery(params: {
  page: number;
  search: string;
  sortBy?: string;
  order?: string;
}) {
  const limit = 10;

  return queryOptions({
    queryKey: productsKeys.list(params),

    queryFn: () =>
      getProducts({
        ...params,
        limit,
      }),

    staleTime: 1000 * 60 * 2, // 2 min cache

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