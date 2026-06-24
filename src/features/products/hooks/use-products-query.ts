import { useQuery } from "@tanstack/react-query";

import { productsListQuery } from "../api/products.query-options";

interface Props {
  page: number;

  search: string;

  sortBy?: string;

  order?: string;
}

export function useProductsQuery({
  page,
  search,
  sortBy,
  order
}: Props) {
  return useQuery(
    productsListQuery({
      page,
      search,
      sortBy,
      order
    })
  );
}