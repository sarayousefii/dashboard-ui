import { api } from "@/shared/lib/axios";
import type { ApiResponse } from "@/shared/types/api-response";

import type { Product } from "../types/product.types";
import type { ProductFormValues } from "../schemas/product.schema";

export type UpdateProductVariables = {
  id: number;
  data: ProductFormValues;
};

export type DeletedProduct = Product & {
  isDeleted?: boolean;
  deletedOn?: string;
};

export async function deleteProduct(
  id: number,
): Promise<ApiResponse<DeletedProduct>> {
  const response = await api.delete<ApiResponse<DeletedProduct>>(
    `/products/${id}`,
  );

  return response.data;
}

export async function updateProduct({
  id,
  data,
}: UpdateProductVariables): Promise<ApiResponse<Product>> {
  const response = await api.put<ApiResponse<Product>>(
    `/products/${id}`,
    data,
  );

  return response.data;
}

export async function createProduct(
  data: ProductFormValues,
): Promise<ApiResponse<Product>> {
  const response = await api.post<ApiResponse<Product>>(
    "/products/add",
    data,
  );

  return response.data;
}
