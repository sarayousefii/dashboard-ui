"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { UserStatusChartItem } from "../../types/dashboard.types";

interface UserStatusChartProps {
  data: UserStatusChartItem[];
}

const COLORS = [
  "#22c55e",
  "#f59e0b",
];

export function UserStatusChart({
  data,
}: UserStatusChartProps) {
  return (
    <ResponsiveContainer
      width="100%"
      height={300}
    >
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="status"
          outerRadius={100}
          label
        >
          {data.map((_, index) => (
            <Cell
              key={index}
              fill={
                COLORS[index % COLORS.length]
              }
            />
          ))}
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}