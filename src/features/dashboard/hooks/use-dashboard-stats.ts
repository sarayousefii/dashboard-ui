import { useQuery } from "@tanstack/react-query";

import { dashboardStatsQuery } from "../api/dashboard.query-options";

export function useDashboardStats() {
  return useQuery(
    dashboardStatsQuery
  );
}