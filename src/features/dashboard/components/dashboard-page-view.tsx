"use client";

import { useTranslations } from "next-intl";

import { ErrorState } from "@/shared/components/common/error-state";
import { TableSkeleton } from "@/shared/components/common/table-skeleton";
import { DashboardLayout } from "@/shared/components/layout/dashboard-layout";

import { getErrorMessage } from "@/shared/lib/api-error";
import { useDashboardStats } from "../hooks/use-dashboard-stats";

import { ChartCard } from "./chart-card";
import { ProductsChart } from "./charts/products-chart";
import { UserStatusChart } from "./charts/user-status-chart";
import { StatsCard } from "./stats-card";

import {
  Clock,
  Package,
  UserCheck,
  Users,
} from "lucide-react";

export function DashboardPageView() {
  const t = useTranslations("dashboard");
  const statusT = useTranslations("users.statuses");

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
          title={t("loadError")}
          description={getErrorMessage(error)}
        />
      </DashboardLayout>
    );
  }

  const statusLabels: Record<string, string> = {
    active: statusT("active"),
    inactive: statusT("inactive"),
    pending: statusT("pending"),
  };

  const localizedUserStatus = (
    data?.userStatusDistribution ?? []
  ).map((item) => ({
    ...item,
    status: statusLabels[item.status] ?? item.status,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            {t("title")}
          </h1>

          <p className="text-muted-foreground">
            {t("description")}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title={t("charts.monthlyProducts")}>
            <ProductsChart
              data={data?.monthlyProducts ?? []}
            />
          </ChartCard>

          <ChartCard title={t("charts.userStatus")}>
            <UserStatusChart
              data={localizedUserStatus}
            />
          </ChartCard>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title={t("stats.totalProducts")}
            value={data?.totalProducts ?? 0}
            icon={Package}
          />

          <StatsCard
            title={t("stats.totalUsers")}
            value={data?.totalUsers ?? 0}
            icon={Users}
          />

          <StatsCard
            title={t("stats.activeUsers")}
            value={data?.activeUsers ?? 0}
            icon={UserCheck}
          />

          <StatsCard
            title={t("stats.pendingUsers")}
            value={data?.pendingUsers ?? 0}
            icon={Clock}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}