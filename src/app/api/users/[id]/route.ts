import { NextRequest } from "next/server";

import {
  successResponse,
  errorResponse,
} from "@/lib/api-response";

import { fetchUserById, updateUserService } from "@/services/users.service";
import { deleteUserService } from "@/services/users.service";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const userId = Number(id);

  if (isNaN(userId)) {
    return errorResponse("Invalid user id", 400);
  }

  const data = await fetchUserById(userId);

  return successResponse(data);
}

export async function PUT(
  request: NextRequest,
  { params }: Props
) {
  try {
    const { id } = await params;

    const body =
      await request.json();

    const data =
      await updateUserService(
        Number(id),
        body
      );

    return successResponse(data);
  } catch {
    return errorResponse(
      "Failed to update user",
      500
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: Props
) {
  try {
    const { id } = await params;


    const data =
      await deleteUserService(
        Number(id)
      );

    return successResponse(data);
  } catch {
    return errorResponse(
      "Failed to delete user",
      500
    );
  }
}