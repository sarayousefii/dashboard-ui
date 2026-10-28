import { api } from "@/shared/lib/axios";
import type { ApiResponse } from "@/shared/types/api-response";

import type { ProductListData } from "@/features/products/types/product.types";
import type { UserListData } from "@/features/users/types/user.types";
import type { DashboardStats } from "../types/dashboard.types";

type ProductCollectionPayload = ApiResponse<ProductListData> | ProductListData;
type UserCollectionPayload = ApiResponse<UserListData> | UserListData;

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await api.get<DashboardStats>("/dashboard");

  return data;
}
