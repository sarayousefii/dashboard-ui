
import { NextRequest } from 'next/server';

import { errorResponse, successResponse } from '@/lib/api-response';

import type { Role } from '@/features/access-control/shared/types/access-control.types';

import {
    authorizeApiRequest,
    hasApiPermissions,
} from '@/shared/lib/server-auth';

import { fetchMockApi } from '@/shared/lib/mock-api';

export async function GET(request: NextRequest) {
  const authorization = await authorizeApiRequest(request);

  if (!authorization.authorized) {
    return authorization.response;
  }

  const canViewRoles =
    hasApiPermissions(authorization.user, ['users.changeRole']) ||
    hasApiPermissions(authorization.user, ['roles.view']);

  if (!canViewRoles) {
    return errorResponse('Forbidden', 403);
  }

  try {
    const response = await fetchMockApi('/roles?_sort=name&_order=asc');

    if (!response.ok) {
      return errorResponse('Failed to fetch roles', response.status);
    }

    const roles = (await response.json()) as Role[];

    return successResponse(roles);
  } catch {
    return errorResponse('Roles service is unavailable', 503);
  }
}
