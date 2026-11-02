import { NextRequest } from "next/server";

import {
  errorResponse,
  successResponse,
} from "@/lib/api-response";
import { fetchMockApi } from "@/shared/lib/mock-api";
import type { User } from "@/features/users/types/user.types";

interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
}

function isCreateUserPayload(
  value: unknown,
): value is CreateUserPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const user = value as Record<string, unknown>;

  return (
    typeof user.firstName === "string" &&
    user.firstName.trim().length >= 2 &&
    typeof user.lastName === "string" &&
    user.lastName.trim().length >= 2 &&
    typeof user.email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email) &&
    typeof user.age === "number" &&
    Number.isInteger(user.age) &&
    user.age >= 18
  );
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const requestedLimit = Number(searchParams.get("limit") ?? 10);
    const requestedSkip = Number(searchParams.get("skip") ?? 0);

    const limit =
      Number.isFinite(requestedLimit) && requestedLimit > 0
        ? Math.min(Math.floor(requestedLimit), 100)
        : 10;

    const skip =
      Number.isFinite(requestedSkip) && requestedSkip >= 0
        ? Math.floor(requestedSkip)
        : 0;

    const page = Math.floor(skip / limit) + 1;

    const mockParams = new URLSearchParams({
      _page: String(page),
      _limit: String(limit),
    });

    const search = searchParams.get("q");
    const sortBy = searchParams.get("sortBy");
    const order = searchParams.get("order");

    if (search) mockParams.set("q", search);
    if (sortBy) mockParams.set("_sort", sortBy);

    if (order === "asc" || order === "desc") {
      mockParams.set("_order", order);
    }

    const response = await fetchMockApi(
      `/users?${mockParams.toString()}`,
    );

    if (!response.ok) {
      return errorResponse(
        "Failed to fetch users",
        response.status,
      );
    }

    const users = (await response.json()) as User[];

    const total = Number(
      response.headers.get("X-Total-Count") ?? users.length,
    );

    return successResponse({
      users,
      total,
      skip,
      limit,
    });
  } catch {
    return errorResponse(
      "Users service is unavailable",
      503,
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid request body", 400);
    }

    if (!isCreateUserPayload(body)) {
      return errorResponse("Invalid user data", 400);
    }

    const email = body.email.trim().toLowerCase();

    const duplicateResponse = await fetchMockApi(
      `/users?email=${encodeURIComponent(email)}`,
    );

    if (!duplicateResponse.ok) {
      return errorResponse("Failed to validate user email", 502);
    }

    const duplicates = (await duplicateResponse.json()) as User[];

    if (duplicates.length > 0) {
      return errorResponse("Email already exists", 409);
    }

    const newUser = {
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email,
      age: body.age,
      role: "viewer",
      status: "active",
    };

    const response = await fetchMockApi("/users", {
      method: "POST",
      body: JSON.stringify(newUser),
    });

    if (!response.ok) {
      return errorResponse("Failed to create user", response.status);
    }

    const createdUser = (await response.json()) as User;

    return successResponse(createdUser, "", 201);
  } catch {
    return errorResponse(
      "Users service is unavailable",
      503,
    );
  }
}