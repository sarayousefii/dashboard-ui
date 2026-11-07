
import { NextRequest, NextResponse } from 'next/server';

import type { User } from '@/features/users/shared/types/user.types';

import { isValidAvatarValue } from '@/shared/lib/avatar';
import { fetchMockApi } from '@/shared/lib/mock-api';

const MOCK_SESSION_TOKEN = 'fake-jwt-token';
const CURRENT_USER_ID = 1;

interface ProfileUpdatePayload {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  avatarUrl?: string | null;
}

function isObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}

export async function PATCH(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (token !== MOCK_SESSION_TOKEN) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 },
    );
  }

  try {
    const rawBody: unknown = await request.json();

    if (!isObject(rawBody)) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body' },
        { status: 400 },
      );
    }

    const body = rawBody as Partial<ProfileUpdatePayload>;

    const firstName =
      typeof body.firstName === 'string'
        ? body.firstName.trim()
        : '';

    const lastName =
      typeof body.lastName === 'string'
        ? body.lastName.trim()
        : '';

    const email =
      typeof body.email === 'string'
        ? body.email.trim().toLowerCase()
        : '';

    const age = body.age;

    if (
      firstName.length < 2 ||
      lastName.length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof age !== 'number' ||
      !Number.isInteger(age) ||
      age < 18
    ) {
      return NextResponse.json(
        { success: false, message: 'Invalid profile data' },
        { status: 400 },
      );
    }

    if (
      'avatarUrl' in body &&
      !isValidAvatarValue(body.avatarUrl)
    ) {
      return NextResponse.json(
        { success: false, message: 'Invalid profile image' },
        { status: 400 },
      );
    }

    const currentResponse = await fetchMockApi(
      `/users/${CURRENT_USER_ID}`,
    );

    if (!currentResponse.ok) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 },
      );
    }

    const duplicateResponse = await fetchMockApi(
      `/users?email=${encodeURIComponent(email)}`,
    );

    if (!duplicateResponse.ok) {
      return NextResponse.json(
        { success: false, message: 'Email validation failed' },
        { status: 503 },
      );
    }

    const matchingUsers = (await duplicateResponse.json()) as User[];

    if (
      matchingUsers.some(
        (user) => user.id !== CURRENT_USER_ID,
      )
    ) {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 409 },
      );
    }

    const updatePayload: ProfileUpdatePayload = {
      firstName,
      lastName,
      email,
      age,
    };

    if ('avatarUrl' in body) {
      updatePayload.avatarUrl = body.avatarUrl;
    }

    const updateResponse = await fetchMockApi(
      `/users/${CURRENT_USER_ID}`,
      {
        method: 'PATCH',
        body: JSON.stringify(updatePayload),
      },
    );

    if (!updateResponse.ok) {
      return NextResponse.json(
        { success: false, message: 'Profile update failed' },
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
      { success: false, message: 'Profile update failed' },
      { status: 500 },
    );
  }
}
