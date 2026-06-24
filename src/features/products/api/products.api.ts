import { api } from "@/shared/lib/axios";
import { GetProductsParams } from "../types/product.types";
import { ApiResponse } from "@/shared/types/api-response";

export async function getProducts(params: GetProductsParams) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  const skip = (page - 1) * limit;

  const searchParams = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  });

  if (params.search) searchParams.set("q", params.search);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.order) searchParams.set("order", params.order);

  const res = await api.get(`/products?${searchParams.toString()}`);

  return res.data;
}


export async function getProductById(id: number) {
  const res  = await api.get(`/products/${id}`);
  return res.data;
}