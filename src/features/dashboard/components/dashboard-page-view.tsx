"use client";

import { DashboardLayout } from "@/shared/components/layout/dashboard-layout";

import { ErrorState } from "@/shared/components/common/error-state";
import { TableSkeleton } from "@/shared/components/common/table-skeleton";

import { getErrorMessage } from "@/shared/lib/api-error";

import { useDashboardStats } from "../hooks/use-dashboard-stats";

import { StatsCard } from "./stats-card";

import { ChartCard } from "./chart-card";
import { ProductsChart } from "./charts/products-chart";
import { UserStatusChart } from "./charts/user-status-chart";

import {
  Package,
  Users,
  UserCheck,
  Clock,
} from "lucide-react";

export function DashboardPageView() {
  const {
    data,
    isLoading,
    error,
  } = useDashboardStats();

  if (isLoading) {
    return (
      <DashboardLayout>
        <TableSkeleton />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorState
          title="Failed to load dashboard"
          description={getErrorMessage(error)}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>

          <p className="text-muted-foreground">
            Welcome back! Here is an overview of your
            system.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Monthly Products">
            <ProductsChart
              data={data?.monthlyProducts ?? []}
            />
          </ChartCard>

          <ChartCard title="Users Status">
            <UserStatusChart
              data={
                data?.userStatusDistribution ??
                []
              }
            />
          </ChartCard>
        </div>

        <div
          className="
            grid
            gap-4
            md:grid-cols-2
            lg:grid-cols-4
          "
        >
          <StatsCard
            title="Total Products"
            value={data?.totalProducts ?? 0}
            icon={Package}
          />

          <StatsCard
            title="Total Users"
            value={data?.totalUsers ?? 0}
            icon={Users}
          />

          <StatsCard
            title="Active Users"
            value={data?.activeUsers ?? 0}
            icon={UserCheck}
          />

          <StatsCard
            title="Pending Users"
            value={data?.pendingUsers ?? 0}
            icon={Clock}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}