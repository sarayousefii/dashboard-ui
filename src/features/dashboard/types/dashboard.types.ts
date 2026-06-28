export interface MonthlyProductsChartItem {
  month: string;
  total: number;
}

export interface UserStatusChartItem {
  status: string;
  value: number;
}

export interface DashboardStats {
  totalProducts: number;

  totalUsers: number;

  activeUsers: number;

  pendingUsers: number;

  monthlyProducts: MonthlyProductsChartItem[];

  userStatusDistribution: UserStatusChartItem[];
}