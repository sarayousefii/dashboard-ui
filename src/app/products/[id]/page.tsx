import type { Metadata } from "next";

import {
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

import { notFound } from "next/navigation";

import { productDetailQuery } from "@/features/products/api/products.query-options";

import { getProductById } from "@/features/products/api/products.api";

import { ProductDetails } from "@/features/products/components/product-details";

import { getQueryClient } from "@/shared/lib/react-query";

export const revalidate = 60;

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Product #${id}`,
    description: "Product Details Page",
  };
}

export default async function ProductPage({
  params,
}: Props) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchQuery(
      productDetailQuery(
        Number(id)
      )
    );
  } catch {
    notFound();
  }

  return (
    <HydrationBoundary
      state={dehydrate(
        queryClient
      )}
    >
      <ProductDetails
        id={Number(id)}
      />
    </HydrationBoundary>
  );
}