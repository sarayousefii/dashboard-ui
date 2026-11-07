import { NextRequest } from 'next/server';

import { errorResponse, successResponse } from '@/lib/api-response';

import type {
  Role,
  UserRoleAssignment,
} from '@/features/access-control/shared/types/access-control.types';

import type { User } from '@/features/users/shared/types/user.types';

import { fetchMockApi } from '@/shared/lib/mock-api';
import { authorizeApiRequest } from '@/shared/lib/server-auth';

import { syncLegacyUserRole } from '@/features/access-control/shared/services/user-role-sync.service';

interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
}

function isCreateUserPayload(value: unknown): value is CreateUserPayload {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const user = value as Record<string, unknown>;

  const firstName =
    typeof user.firstName === 'string' ? user.firstName.trim() : '';

  const lastName =
    typeof user.lastName === 'string' ? user.lastName.trim() : '';

  const email = typeof user.email === 'string' ? user.email.trim() : '';

  return (
    firstName.length >= 2 &&
    lastName.length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    typeof user.age === 'number' &&
    Number.isInteger(user.age) &&
    user.age >= 18
  );
}

async function getCollection<T>(path: string): Promise<T[] | null> {
  const response = await fetchMockApi(path);

  if (!response.ok) {
    return null;
  }

  const data: unknown = await response.json();

  return Array.isArray(data) ? (data as T[]) : null;
}

export async function GET(request: NextRequest) {
  const authorization = await authorizeApiRequest(request, ['users.view']);

  if (!authorization.authorized) {
    return authorization.response;
  }

  try {
    const searchParams = request.nextUrl.searchParams;

    const requestedLimit = Number(searchParams.get('limit') ?? 10);
    const requestedSkip = Number(searchParams.get('skip') ?? 0);

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

    const search = searchParams.get('q');
    const sortBy = searchParams.get('sortBy');
    const order = searchParams.get('order');

    if (search) {
      mockParams.set('q', search);
    }

    if (sortBy) {
      mockParams.set('_sort', sortBy);
    }

    if (order === 'asc' || order === 'desc') {
      mockParams.set('_order', order);
    }

    const response = await fetchMockApi(`/users?${mockParams.toString()}`);

    if (!response.ok) {
      return errorResponse('Failed to fetch users', response.status);
    }

    const users = (await response.json()) as User[];

    const total = Number(response.headers.get('X-Total-Count') ?? users.length);

    const [roles, assignments] = await Promise.all([
      getCollection<Role>('/roles'),
      getCollection<UserRoleAssignment>('/userRoles'),
    ]);

    if (!roles || !assignments) {
      return errorResponse('Failed to retrieve user role information', 503);
    }

    const rolesById = new Map(
      roles.map((role) => [String(role.id), role]),
    );

    const roleIdsByUserId = new Map<number, Set<string>>();

    for (const assignment of assignments) {
      const userId = Number(assignment.userId);
      const roleId = String(assignment.roleId);

      const userRoleIds = roleIdsByUserId.get(userId) ?? new Set<string>();

      userRoleIds.add(roleId);
      roleIdsByUserId.set(userId, userRoleIds);
    }

    const usersWithRoles: User[] = users.map((user) => {
      const assignedRoleIds =
        roleIdsByUserId.get(Number(user.id)) ?? new Set<string>();

      const assignedRoles = Array.from(assignedRoleIds)
        .map((roleId) => rolesById.get(roleId))
        .filter((role): role is Role => role !== undefined);

      return {
        ...user,
        roles: assignedRoles,
      };
    });

    return successResponse({
      users: usersWithRoles,
      total,
      skip,
      limit,
    });
  } catch {
    return errorResponse('Users service is unavailable', 503);
  }
}

export async function POST(request: NextRequest) {
  const authorization = await authorizeApiRequest(request, ['users.create']);

  if (!authorization.authorized) {
    return authorization.response;
  }

  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return errorResponse('Invalid request body', 400);
    }

    if (!isCreateUserPayload(body)) {
      return errorResponse('Invalid user data', 400);
    }

    const email = body.email.trim().toLowerCase();

    const duplicateResponse = await fetchMockApi(
      `/users?email=${encodeURIComponent(email)}`,
    );

    if (!duplicateResponse.ok) {
      return errorResponse('Failed to validate user email', 502);
    }

    const duplicates = (await duplicateResponse.json()) as User[];

    if (duplicates.length > 0) {
      return errorResponse('Email already exists', 409);
    }

    const newUser = {
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email,
      age: body.age,
      role: 'viewer' as const,
      status: 'active' as const,
    };

    const response = await fetchMockApi('/users', {
      method: 'POST',
      body: JSON.stringify(newUser),
    });

    if (!response.ok) {
      return errorResponse('Failed to create user', response.status);
    }

    const createdUser = (await response.json()) as User;

    try {
      await syncLegacyUserRole(createdUser.id, 'viewer');
    } catch {
      await fetchMockApi(`/users/${createdUser.id}`, {
        method: 'DELETE',
      }).catch(() => undefined);

      return errorResponse(
        'Failed to assign the default role to the new user',
        503,
      );
    }

    return successResponse(createdUser, '', 201);
  } catch {
    return errorResponse('Users service is unavailable', 503);
  }
}
