import { queryOptions } from "@tanstack/react-query";

import { getDashboardStats } from "./dashboard.api";

export const dashboardStatsQuery =
  queryOptions({
    queryKey: ["dashboard", "stats"],

    queryFn: getDashboardStats,

    staleTime: 1000 * 60,
  });