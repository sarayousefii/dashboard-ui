import { NextRequest } from 'next/server';

import { errorResponse, successResponse } from '@/lib/api-response';

import {
  USER_ROLES,
  USER_STATUSES,
  type User,
} from '@/features/users/shared/types/user.types';

import { fetchMockApi } from '@/shared/lib/mock-api';

import {
  authorizeApiRequest,
  hasApiPermissions,
} from '@/shared/lib/server-auth';

import { syncLegacyUserRole } from '@/features/access-control/shared/services/user-role-sync.service';

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function getValidUserId(context: RouteContext): Promise<number | null> {
  const { id } = await context.params;
  const userId = Number(id);

  if (!Number.isSafeInteger(userId) || userId <= 0) {
    return null;
  }

  return userId;
}

function parseUserPatch(value: unknown): Partial<User> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const body = value as Record<string, unknown>;

  const allowedFields = [
    'firstName',
    'lastName',
    'email',
    'age',
    'role',
    'status',
  ];

  const keys = Object.keys(body);

  if (keys.length === 0 || keys.some((key) => !allowedFields.includes(key))) {
    return null;
  }

  const patch: Partial<User> = {};

  if ('firstName' in body) {
    if (
      typeof body.firstName !== 'string' ||
      body.firstName.trim().length < 2
    ) {
      return null;
    }

    patch.firstName = body.firstName.trim();
  }

  if ('lastName' in body) {
    if (typeof body.lastName !== 'string' || body.lastName.trim().length < 2) {
      return null;
    }

    patch.lastName = body.lastName.trim();
  }

  if ('email' in body) {
    if (
      typeof body.email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())
    ) {
      return null;
    }

    patch.email = body.email.trim().toLowerCase();
  }

  if ('age' in body) {
    if (
      typeof body.age !== 'number' ||
      !Number.isInteger(body.age) ||
      body.age < 18
    ) {
      return null;
    }

    patch.age = body.age;
  }

  if ('role' in body) {
    if (
      typeof body.role !== 'string' ||
      !USER_ROLES.includes(body.role as (typeof USER_ROLES)[number])
    ) {
      return null;
    }

    patch.role = body.role as User['role'];
  }

  if ('status' in body) {
    if (
      typeof body.status !== 'string' ||
      !USER_STATUSES.includes(body.status as (typeof USER_STATUSES)[number])
    ) {
      return null;
    }

    patch.status = body.status as NonNullable<User['status']>;
  }

  return patch;
}

async function updateUser(request: NextRequest, context: RouteContext) {
  let roleAssignmentUpdated = false;
  let previousRole: User['role'] | undefined;

  try {
    const authentication = await authorizeApiRequest(request);

    if (!authentication.authorized) {
      return authentication.response;
    }

    const userId = await getValidUserId(context);

    if (userId === null) {
      return errorResponse('Invalid user id', 400);
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return errorResponse('Invalid request body', 400);
    }

    const patch = parseUserPatch(body);

    if (!patch) {
      return errorResponse('Invalid user data', 400);
    }

    const requiredPermissions: string[] = [];

    const hasProfileFields = ['firstName', 'lastName', 'email', 'age'].some(
      (field) => field in patch,
    );

    if (hasProfileFields || 'status' in patch) {
      requiredPermissions.push('users.edit');
    }

    if ('role' in patch) {
      requiredPermissions.push('users.changeRole');
    }

    const canUpdate = hasApiPermissions(
      authentication.user,
      requiredPermissions,
    );

    if (!canUpdate) {
      return errorResponse('Forbidden', 403);
    }

    if (patch.email) {
      const duplicateResponse = await fetchMockApi(
        `/users?email=${encodeURIComponent(patch.email)}`,
      );

      if (!duplicateResponse.ok) {
        return errorResponse('Failed to validate user email', 502);
      }

      const users = (await duplicateResponse.json()) as User[];

      const emailExists = users.some((user) => user.id !== userId);

      if (emailExists) {
        return errorResponse('Email already exists', 409);
      }
    }

    // Synchronize the new role assignment before updating the legacy field.
    if (patch.role) {
      const currentUserResponse = await fetchMockApi(`/users/${userId}`);

      if (!currentUserResponse.ok) {
        return errorResponse(
          'User not found',
          currentUserResponse.status === 404 ? 404 : currentUserResponse.status,
        );
      }

      const currentUser = (await currentUserResponse.json()) as User;

      previousRole = currentUser.role;

      await syncLegacyUserRole(userId, patch.role);

      roleAssignmentUpdated = true;
    }

    const response = await fetchMockApi(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });

    if (!response.ok) {
      if (roleAssignmentUpdated && previousRole) {
        await syncLegacyUserRole(userId, previousRole);
        roleAssignmentUpdated = false;
      }

      return errorResponse(
        response.status === 404 ? 'User not found' : 'Failed to update user',
        response.status,
      );
    }

    // Both representations have now been updated successfully.
    roleAssignmentUpdated = false;

    const updatedUser = (await response.json()) as User;

    return successResponse(updatedUser);
  } catch {
    if (roleAssignmentUpdated && previousRole) {
      try {
        const userId = await getValidUserId(context);

        if (userId !== null) {
          await syncLegacyUserRole(userId, previousRole);
        }
      } catch {
        // Keep the failure closed; do not grant permissions from the legacy role.
      }
    }

    return errorResponse('Users service is unavailable', 503);
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  const authorization = await authorizeApiRequest(request, ['users.view']);

  if (!authorization.authorized) {
    return authorization.response;
  }

  try {
    const userId = await getValidUserId(context);

    if (userId === null) {
      return errorResponse('Invalid user id', 400);
    }

    const response = await fetchMockApi(`/users/${userId}`);

    if (!response.ok) {
      return errorResponse(
        'User not found',
        response.status === 404 ? 404 : response.status,
      );
    }

    const user = (await response.json()) as User;

    return successResponse(user);
  } catch {
    return errorResponse('Users service is unavailable', 503);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return updateUser(request, context);
}

// Keep compatibility with the existing frontend until all mutations use PATCH.
export async function PUT(request: NextRequest, context: RouteContext) {
  return updateUser(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const authorization = await authorizeApiRequest(request, ['users.delete']);

  if (!authorization.authorized) {
    return authorization.response;
  }

  try {
    const userId = await getValidUserId(context);

    if (userId === null) {
      return errorResponse('Invalid user id', 400);
    }

    const response = await fetchMockApi(`/users/${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      return errorResponse(
        response.status === 404 ? 'User not found' : 'Failed to delete user',
        response.status,
      );
    }

    const deletedUser = (await response.json()) as User;

    return successResponse(deletedUser);
  } catch {
    return errorResponse('Users service is unavailable', 503);
  }
}
