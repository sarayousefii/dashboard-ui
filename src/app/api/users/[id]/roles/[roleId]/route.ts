import { NextRequest } from 'next/server';

import { errorResponse, successResponse } from '@/lib/api-response';

import type { UserRoleAssignment } from '@/features/access-control/shared/types/access-control.types';

import { fetchMockApi } from '@/shared/lib/mock-api';
import { authorizeApiRequest } from '@/shared/lib/server-auth';

type RouteContext = {
  params: Promise<{
    id: string;
    roleId: string;
  }>;
};

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

export async function DELETE(
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
    const { id, roleId: rawRoleId } = await context.params;

    const userId = Number(id);
    const roleId = rawRoleId.trim();

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return errorResponse('Invalid user id', 400);
    }

    if (!roleId) {
      return errorResponse('Invalid role id', 400);
    }

    const userResponse = await fetchMockApi(`/users/${userId}`);

    if (userResponse.status === 404) {
      return errorResponse('User not found', 404);
    }

    if (!userResponse.ok) {
      return errorResponse('Failed to retrieve user', 503);
    }

    const assignments =
      await getCollection<UserRoleAssignment>('/userRoles');

    if (!assignments) {
      return errorResponse('Failed to retrieve user roles', 503);
    }

    const userAssignments = assignments.filter(
      (assignment) => Number(assignment.userId) === userId,
    );

    const assignmentToRevoke = userAssignments.find(
      (assignment) => String(assignment.roleId) === roleId,
    );

    if (!assignmentToRevoke) {
      return errorResponse(
        'Role is not assigned to this user',
        404,
      );
    }

    const isRevokingOwnLastRole =
      Number(authorization.user.id) === userId &&
      userAssignments.length === 1;

    if (isRevokingOwnLastRole) {
      return errorResponse(
        'You cannot revoke your own last role',
        409,
      );
    }

    const deleteResponse = await fetchMockApi(
      `/userRoles/${encodeURIComponent(assignmentToRevoke.id)}`,
      {
        method: 'DELETE',
      },
    );

    if (!deleteResponse.ok) {
      return errorResponse(
        'Failed to revoke role',
        deleteResponse.status,
      );
    }

    return successResponse({
      userId,
      roleId,
      revoked: true,
    });
  } catch {
    return errorResponse('User role revocation failed', 503);
  }
}
