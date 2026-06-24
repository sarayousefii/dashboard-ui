import { NextRequest } from "next/server";

import {
  successResponse,
  errorResponse,
} from "@/lib/api-response";

import { fetchUsers } from "@/services/users.service";

export async function GET(
  request: NextRequest
) {
  try {
    const { searchParams } = new URL(request.url);

    const limit = Number(
      searchParams.get("limit") ?? 10
    );

    const skip = Number(
      searchParams.get("skip") ?? 0
    );

    const search = searchParams.get("q") ?? "";

    const sortBy = searchParams.get("sortBy") ?? "";

    const order = searchParams.get("order") ?? "";

    const data =
      await fetchUsers({
        limit,
        skip,
        search,
        sortBy,
        order,
      });
      
    return successResponse(data);
  } catch {
    return errorResponse(
      "Failed to fetch users",
      500
    );
  }
}