import { GetProductsParams } from "../types/product.types";

export const productsKeys = {
  all: ["products"] as const,

  lists: () => [...productsKeys.all, "list"] as const,

  list: (params: GetProductsParams) =>
    [...productsKeys.lists(), params] as const,

  details: () => [...productsKeys.all, "detail"] as const,

  detail: (id: number) =>
    [...productsKeys.details(), id] as const,
};