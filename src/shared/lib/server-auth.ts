import type { NextRequest, NextResponse } from 'next/server';

import { errorResponse } from '@/lib/api-response';

import type { User } from '@/features/users/shared/types/user.types';

import { fetchMockApi } from '@/shared/lib/mock-api';
import { hasPermission } from '@/shared/lib/permissions';

import { resolveUserAccess } from '@/features/access-control/shared/services/permission-resolver.service';

const MOCK_SESSION_TOKEN = 'fake-jwt-token';
const CURRENT_USER_ID = 1;

type AuthorizationResult =
  | {
      authorized: true;
      user: User;
    }
  | {
      authorized: false;
      response: NextResponse;
    };

export async function authorizeApiRequest(
  request: NextRequest,
  requiredPermissions: string[] = [],
): Promise<AuthorizationResult> {
  const token = request.cookies.get('token')?.value;

  if (token !== MOCK_SESSION_TOKEN) {
    return {
      authorized: false,
      response: errorResponse('Unauthorized', 401),
    };
  }

  try {
    const response = await fetchMockApi(`/users/${CURRENT_USER_ID}`);

    if (response.status === 404) {
      return {
        authorized: false,
        response: errorResponse('Unauthorized', 401),
      };
    }

    if (!response.ok) {
      return {
        authorized: false,
        response: errorResponse('Authentication service unavailable', 503),
      };
    }

    const baseUser = (await response.json()) as User;
    const access = await resolveUserAccess(baseUser);

    const user: User = {
      ...baseUser,
      ...access,
    };

    const allowed = requiredPermissions.every((permission) =>
      hasPermission(user, permission),
    );

    if (!allowed) {
      return {
        authorized: false,
        response: errorResponse('Forbidden', 403),
      };
    }

    return {
      authorized: true,
      user,
    };
  } catch {
    return {
      authorized: false,
      response: errorResponse('Authentication service unavailable', 503),
    };
  }
}

export function hasApiPermissions(
  user: User,
  requiredPermissions: string[],
): boolean {
  return requiredPermissions.every((permission) =>
    hasPermission(user, permission),
  );
}
