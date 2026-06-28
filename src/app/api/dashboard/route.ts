import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
  const [productsRes, usersRes] =
    await Promise.all([
      fetch(`${BASE_URL}/products`),
      fetch(`${BASE_URL}/users`),
    ]);

  const productsData =
    await productsRes.json();

  const usersData =
    await usersRes.json();

  const products =
    productsData.products ?? [];

  const users =
    usersData.users ?? [];

  const activeUsers = users.filter(
    (user: { status: string; }) => user.status === "active"
  );

  const pendingUsers = users.filter(
    (user: { status: string; }) => user.status === "pending"
  );

  return NextResponse.json({
    totalProducts: products.length,

    totalUsers: users.length,

    activeUsers: activeUsers.length,

    pendingUsers: pendingUsers.length,

    monthlyProducts: [
      {
        month: "Jan",
        total: 18,
      },
      {
        month: "Feb",
        total: 24,
      },
      {
        month: "Mar",
        total: 32,
      },
      {
        month: "Apr",
        total: 28,
      },
      {
        month: "May",
        total: 40,
      },
      {
        month: "Jun",
        total: 52,
      },
    ],

    userStatusDistribution: [
      {
        status: "Active",
        value: activeUsers.length,
      },
      {
        status: "Pending",
        value: pendingUsers.length,
      },
    ],
  });
}