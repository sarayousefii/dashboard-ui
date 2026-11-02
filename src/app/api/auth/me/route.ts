
import { NextRequest, NextResponse } from "next/server";

import type { User } from "@/features/users/types/user.types";
import { fetchMockApi } from "@/shared/lib/mock-api";

const MOCK_SESSION_TOKEN = "fake-jwt-token";
const CURRENT_USER_ID = 1;

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (token !== MOCK_SESSION_TOKEN) {
    return NextResponse.json(
      { user: null },
      { status: 401 },
    );
  }

  try {
    const response = await fetchMockApi(
      `/users/${CURRENT_USER_ID}`,
    );

    if (response.status === 404) {
      return NextResponse.json(
        { user: null },
        { status: 401 },
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to retrieve current user" },
        { status: 503 },
      );
    }

    const user = (await response.json()) as User;

    return NextResponse.json(
      {
        user: {
          ...user,
          name: `${user.firstName} ${user.lastName}`,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { message: "Unable to retrieve current user" },
      { status: 503 },
    );
  }
}
