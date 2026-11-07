
import { NextRequest } from 'next/server';

import { errorResponse, successResponse } from '@/lib/api-response';

import type {
    Role,
    UserRoleAssignment,
} from '@/features/access-control/shared/types/access-control.types';

import { fetchMockApi } from '@/shared/lib/mock-api';
import { authorizeApiRequest } from '@/shared/lib/server-auth';

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

async function getCollection<T>(
  path: string,
): Promise<T[] | null> {
  const response = await fetchMockApi(path);

  if (!response.ok) {
    return null;
  }

  const data: unknown = await response.json();

  return Array.isArray(data) ? (data as T[]) : null;
}

export async function GET(
  request: NextRequest,
  context: RouteContext,
) {
  const authorization = await authorizeApiRequest(
    request,
    ['users.view'],
  );

  if (!authorization.authorized) {
    return authorization.response;
  }

  try {
    const userId = await getValidUserId(context);

    if (userId === null) {
      return errorResponse('Invalid user id', 400);
    }

    const userResponse = await fetchMockApi(`/users/${userId}`);

    if (!userResponse.ok) {
      return errorResponse('User not found', 404);
    }

    const [assignments, roles] = await Promise.all([
      getCollection<UserRoleAssignment>('/userRoles'),
      getCollection<Role>('/roles'),
    ]);

    if (!assignments || !roles) {
      return errorResponse(
        'Failed to retrieve user roles',
        503,
      );
    }

    const userAssignments = assignments.filter(
      (assignment) =>
        Number(assignment.userId) === userId,
    );

    const assignedRoleIds = new Set(
      userAssignments.map((assignment) =>
        String(assignment.roleId),
      ),
    );

    const assignedRoles = roles.filter((role) =>
      assignedRoleIds.has(String(role.id)),
    );

    return successResponse({
      roles: assignedRoles,
      assignments: userAssignments,
    });
  } catch {
    return errorResponse(
      'User roles service is unavailable',
      503,
    );
  }
}

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  const authorization = await authorizeApiRequest(
    request,
    ['users.changeRole'],
  );

  if (!authorization.authorized) {
    return authorization.response;
  }

  try {
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

    if (
      !body ||
      typeof body !== 'object' ||
      Array.isArray(body) ||
      typeof (body as Record<string, unknown>).roleId !== 'string'
    ) {
      return errorResponse(
        'A valid roleId is required',
        400,
      );
    }

    const roleId = (
      body as { roleId: string }
    ).roleId.trim();

    if (!roleId) {
      return errorResponse(
        'A valid roleId is required',
        400,
      );
    }

    const userResponse = await fetchMockApi(
      `/users/${userId}`,
    );

    if (!userResponse.ok) {
      return errorResponse('User not found', 404);
    }

    const roles = await getCollection<Role>('/roles');

    if (!roles) {
      return errorResponse(
        'Failed to retrieve roles',
        503,
      );
    }

    const role = roles.find(
      (item) => String(item.id) === roleId,
    );

    if (!role) {
      return errorResponse('Role not found', 404);
    }

    const assignments =
      await getCollection<UserRoleAssignment>('/userRoles');

    if (!assignments) {
      return errorResponse(
        'Failed to retrieve user roles',
        503,
      );
    }

    const alreadyAssigned = assignments.some(
      (assignment) =>
        Number(assignment.userId) === userId &&
        String(assignment.roleId) === roleId,
    );

    if (alreadyAssigned) {
      return errorResponse(
        'Role is already assigned to this user',
        409,
      );
    }

    const assignment: UserRoleAssignment = {
      id: `user-${userId}::${roleId}`,
      userId,
      roleId,
      assignedAt: new Date().toISOString(),
    };

    const createResponse = await fetchMockApi(
      '/userRoles',
      {
        method: 'POST',
        body: JSON.stringify(assignment),
      },
    );

    if (!createResponse.ok) {
      return errorResponse(
        'Failed to assign role',
        createResponse.status,
      );
    }

    const createdAssignment =
      (await createResponse.json()) as UserRoleAssignment;

    return successResponse(
      createdAssignment,
      '',
      201,
    );
  } catch {
    return errorResponse(
      'User role assignment failed',
      503,
    );
  }
}
