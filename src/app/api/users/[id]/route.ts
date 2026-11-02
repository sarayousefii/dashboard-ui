import { NextRequest } from "next/server";

import {
  errorResponse,
  successResponse,
} from "@/lib/api-response";
import { fetchMockApi } from "@/shared/lib/mock-api";

import {
  USER_ROLES,
  USER_STATUSES,
  type User,
} from "@/features/users/types/user.types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function getValidUserId(
  context: RouteContext,
): Promise<number | null> {
  const { id } = await context.params;
  const userId = Number(id);

  if (!Number.isSafeInteger(userId) || userId <= 0) {
    return null;
  }

  return userId;
}

function parseUserPatch(
  value: unknown,
): Partial<User> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const body = value as Record<string, unknown>;
  const allowedFields = [
    "firstName",
    "lastName",
    "email",
    "age",
    "role",
    "status",
  ];

  if (
    Object.keys(body).length === 0 ||
    Object.keys(body).some((key) => !allowedFields.includes(key))
  ) {
    return null;
  }

  const patch: Partial<User> = {};

  if ("firstName" in body) {
    if (
      typeof body.firstName !== "string" ||
      body.firstName.trim().length < 2
    ) {
      return null;
    }

    patch.firstName = body.firstName.trim();
  }

  if ("lastName" in body) {
    if (
      typeof body.lastName !== "string" ||
      body.lastName.trim().length < 2
    ) {
      return null;
    }

    patch.lastName = body.lastName.trim();
  }

  if ("email" in body) {
    if (
      typeof body.email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)
    ) {
      return null;
    }

    patch.email = body.email.trim().toLowerCase();
  }

  if ("age" in body) {
    if (
      typeof body.age !== "number" ||
      !Number.isInteger(body.age) ||
      body.age < 18
    ) {
      return null;
    }

    patch.age = body.age;
  }

  if ("role" in body) {
    if (
      typeof body.role !== "string" ||
      !USER_ROLES.includes(
        body.role as (typeof USER_ROLES)[number],
      )
    ) {
      return null;
    }

    patch.role = body.role as User["role"];
  }

  if ("status" in body) {
    if (
      typeof body.status !== "string" ||
      !USER_STATUSES.includes(
        body.status as (typeof USER_STATUSES)[number],
      )
    ) {
      return null;
    }

    patch.status = body.status as NonNullable<User["status"]>;
  }

  return patch;
}

async function updateUser(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const userId = await getValidUserId(context);

    if (userId === null) {
      return errorResponse("Invalid user id", 400);
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid request body", 400);
    }

    const patch = parseUserPatch(body);

    if (!patch) {
      return errorResponse("Invalid user data", 400);
    }

    if (patch.email) {
      const duplicateResponse = await fetchMockApi(
        `/users?email=${encodeURIComponent(patch.email)}`,
      );

      if (!duplicateResponse.ok) {
        return errorResponse("Failed to validate user email", 502);
      }

      const users = (await duplicateResponse.json()) as User[];

      const emailExists = users.some(
        (user) => user.id !== userId,
      );

      if (emailExists) {
        return errorResponse("Email already exists", 409);
      }
    }

    const response = await fetchMockApi(`/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });

    if (!response.ok) {
      return errorResponse(
        response.status === 404
          ? "User not found"
          : "Failed to update user",
        response.status,
      );
    }

    const updatedUser = (await response.json()) as User;

    return successResponse(updatedUser);
  } catch {
    return errorResponse("Users service is unavailable", 503);
  }
}

export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const userId = await getValidUserId(context);

    if (userId === null) {
      return errorResponse("Invalid user id", 400);
    }

    const response = await fetchMockApi(`/users/${userId}`);

    if (!response.ok) {
      return errorResponse(
        "User not found",
        response.status === 404 ? 404 : response.status,
      );
    }

    const user = (await response.json()) as User;

    return successResponse(user);
  } catch {
    return errorResponse("Users service is unavailable", 503);
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  return updateUser(request, context);
}

// Keep compatibility with the existing frontend until its mutation is migrated to PATCH.
export async function PUT(
  request: NextRequest,
  context: RouteContext,
) {
  return updateUser(request, context);
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const userId = await getValidUserId(context);

    if (userId === null) {
      return errorResponse("Invalid user id", 400);
    }

    const response = await fetchMockApi(`/users/${userId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return errorResponse(
        response.status === 404
          ? "User not found"
          : "Failed to delete user",
        response.status,
      );
    }

    const deletedUser = (await response.json()) as User;

    return successResponse(deletedUser);
  } catch {
    return errorResponse("Users service is unavailable", 503);
  }
}