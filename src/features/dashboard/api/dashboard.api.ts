import { api } from "@/shared/lib/axios";

import { DashboardStats } from "../types/dashboard.types";

export async function getDashboardStats(): Promise<DashboardStats> {
  const [productsRes, usersRes] = await Promise.all([
    api.get("/products"),
    api.get("/users"),
  ]);

  const products =
    productsRes.data?.products ??
    productsRes.data?.data?.products ??
    [];

  const users =
    usersRes.data?.users ??
    usersRes.data?.data?.users ??
    [];

  return {
    totalProducts: products.length,

    totalUsers: users.length,

    activeUsers: users.filter(
      (user: any) => user.status === "active"
    ).length,

    pendingUsers: users.filter(
      (user: any) => user.status === "pending"
    ).length,
  };
}