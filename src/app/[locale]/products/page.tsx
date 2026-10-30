import {
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

import { getQueryClient } from "@/shared/lib/react-query";

import { productsListQuery } from "@/features/products/api/products.query-options";

import ProductsPageView from "@/features/products/components/products-page-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description: "Manage products",
};

interface Props {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sortBy?: string;
    order?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: Props) {

  const params = await searchParams;
  const page = Number(params.page) || 1;

  const search = params.search || ""; 

  const sortBy = params.sortBy || "";

  const order = params.order || "";

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(
    productsListQuery({
      page,
      search,
      sortBy,
      order,
    })
  );

  return (
    <HydrationBoundary
      state={dehydrate(queryClient)}
    >
      <ProductsPageView />
    </HydrationBoundary>
  );
}