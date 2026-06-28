import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    totalProducts: 120,

    totalUsers: 58,

    activeUsers: 42,

    pendingUsers: 16,

    monthlyProducts: [
      { month: "Jan", total: 18 },
      { month: "Feb", total: 24 },
      { month: "Mar", total: 32 },
      { month: "Apr", total: 28 },
      { month: "May", total: 40 },
      { month: "Jun", total: 52 },
    ],

    userStatusDistribution: [
      {
        status: "Active",
        value: 42,
      },
      {
        status: "Pending",
        value: 16,
      },
    ],
  });
}