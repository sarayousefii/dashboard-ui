import { QueryClient } from "@tanstack/react-query";
import { productsListQuery } from "./products.query-options";

export function prefetchProducts(
  queryClient: QueryClient,
  params: {
    page: number;
    search: string;
    sortBy?: string;
    order?: string;
  }
) {
  return queryClient.prefetchQuery(
    productsListQuery(params)
  );
}