
import { NextRequest, NextResponse } from "next/server";

import type { User } from "@/features/users/types/user.types";
import { fetchMockApi } from "@/shared/lib/mock-api";

const MOCK_SESSION_TOKEN = "fake-jwt-token";
const CURRENT_USER_ID = 1;

interface ProfileUpdatePayload {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
}

export async function PATCH(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (token !== MOCK_SESSION_TOKEN) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const body = (await request.json()) as Partial<ProfileUpdatePayload>;

    const firstName = body.firstName?.trim();
    const lastName = body.lastName?.trim();
    const email = body.email?.trim().toLowerCase();
    const age = Number(body.age);

    if (
      !firstName ||
      firstName.length < 2 ||
      !lastName ||
      lastName.length < 2 ||
      !email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !Number.isInteger(age) ||
      age < 18
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid profile data" },
        { status: 400 },
      );
    }

    const currentResponse = await fetchMockApi(
      `/users/${CURRENT_USER_ID}`,
    );

    if (!currentResponse.ok) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const currentUser = (await currentResponse.json()) as User;

    const duplicateResponse = await fetchMockApi(
      `/users?email=${encodeURIComponent(email)}`,
    );

    if (!duplicateResponse.ok) {
      return NextResponse.json(
        { success: false, message: "Email validation failed" },
        { status: 503 },
      );
    }

    const matchingUsers = (await duplicateResponse.json()) as User[];

    if (matchingUsers.some((user) => user.id !== CURRENT_USER_ID)) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 409 },
      );
    }

    const updateResponse = await fetchMockApi(
      `/users/${CURRENT_USER_ID}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          age,
        }),
      },
    );

    if (!updateResponse.ok) {
      return NextResponse.json(
        { success: false, message: "Profile update failed" },
        { status: 503 },
      );
    }

    const updatedUser = (await updateResponse.json()) as User;

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Profile update failed" },
      { status: 500 },
    );
  }
}
