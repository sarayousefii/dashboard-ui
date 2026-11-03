import type { UserRole } from '@/features/users/shared/types/user.types';

import { fetchMockApi } from '@/shared/lib/mock-api';

interface MockRole {
  id: string | number;
  slug: string;
}

interface MockUserRole {
  id: string | number;
  userId: number;
  roleId: string | number;
}

async function getUserRoleAssignments(userId: number): Promise<MockUserRole[]> {
  const response = await fetchMockApi(`/userRoles?userId=${userId}`);

  if (!response.ok) {
    throw new Error('Failed to load user role assignments');
  }

  return (await response.json()) as MockUserRole[];
}

async function restoreAssignments(
  userId: number,
  assignments: MockUserRole[],
): Promise<void> {
  const currentAssignments = await getUserRoleAssignments(userId);

  for (const assignment of assignments) {
    const alreadyExists = currentAssignments.some(
      (current) => String(current.id) === String(assignment.id),
    );

    if (alreadyExists) {
      continue;
    }

    const response = await fetchMockApi('/userRoles', {
      method: 'POST',
      body: JSON.stringify(assignment),
    });

    if (!response.ok) {
      throw new Error('Failed to restore previous user role assignment');
    }
  }
}

/**
 * Keeps the legacy single-role user model synchronized with userRoles.
 *
 * This function is only for compatibility with the existing role selector.
 * The future multi-role assignment feature should use dedicated operations
 * that add or remove one assignment without replacing all assignments.
 */
export async function syncLegacyUserRole(
  userId: number,
  roleSlug: UserRole,
): Promise<void> {
  const roleResponse = await fetchMockApi(
    `/roles?slug=${encodeURIComponent(roleSlug)}`,
  );

  if (!roleResponse.ok) {
    throw new Error('Failed to find the requested role');
  }

  const roles = (await roleResponse.json()) as MockRole[];
  const targetRole = roles.find((role) => role.slug === roleSlug);

  if (!targetRole) {
    throw new Error(`Role "${roleSlug}" does not exist`);
  }

  const targetRoleId = String(targetRole.id);
  const currentAssignments = await getUserRoleAssignments(userId);

  const targetAssignmentExists = currentAssignments.some(
    (assignment) => String(assignment.roleId) === targetRoleId,
  );

  const obsoleteAssignments = currentAssignments.filter(
    (assignment) => String(assignment.roleId) !== targetRoleId,
  );

  const deletedAssignments: MockUserRole[] = [];

  // Remove old assignments first. This avoids temporarily granting
  // permissions from both the old and new roles.
  for (const assignment of obsoleteAssignments) {
    const response = await fetchMockApi(
      `/userRoles/${encodeURIComponent(String(assignment.id))}`,
      { method: 'DELETE' },
    );

    if (!response.ok && response.status !== 404) {
      try {
        await restoreAssignments(userId, deletedAssignments);
      } catch {
        // The caller will return an error and access remains fail-closed
        // if restoration is incomplete.
      }

      throw new Error('Failed to remove previous user role assignment');
    }

    if (response.ok) {
      deletedAssignments.push(assignment);
    }
  }

  if (targetAssignmentExists) {
    return;
  }

  const newAssignment: MockUserRole = {
    id: `user-${userId}-${targetRoleId}`,
    userId,
    roleId: targetRoleId,
  };

  const createResponse = await fetchMockApi('/userRoles', {
    method: 'POST',
    body: JSON.stringify(newAssignment),
  });

  if (!createResponse.ok) {
    try {
      await restoreAssignments(userId, deletedAssignments);
    } catch {
      // Preserve the original failure. The API caller will fail closed.
    }

    throw new Error('Failed to assign the requested role to the user');
  }
}
