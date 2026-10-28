import { api } from "@/shared/lib/axios";
import type { ApiResponse } from "@/shared/types/api-response";

import type { ProductListData } from "@/features/products/types/product.types";
import type { UserListData } from "@/features/users/types/user.types";
import type { DashboardStats } from "../types/dashboard.types";

type ProductCollectionPayload = ApiResponse<ProductListData> | ProductListData;
type UserCollectionPayload = ApiResponse<UserListData> | UserListData;

export async function getDashboardStats(): Promise<DashboardStats> {
  const [productsResponse, usersResponse] = await Promise.all([
    api.get<ProductCollectionPayload>("/products"),
    api.get<UserCollectionPayload>("/users"),
  ]);

  const productsPayload = productsResponse.data;
  const usersPayload = usersResponse.data;

  const products = "data" in productsPayload
    ? productsPayload.data.products
    : productsPayload.products;

  const users = "data" in usersPayload
    ? usersPayload.data.users
    : usersPayload.users;

  return {
    totalProducts: products.length,
    totalUsers: users.length,
    activeUsers: users.filter((user) => user.status === "active").length,
    pendingUsers: users.filter((user) => user.status === "pending").length,
  };
}
