import { NextResponse } from "next/server";

export function successResponse(
  data: unknown,
  text = "",
  status = 200,
) {
  // Preserve the existing function signature without changing the response body.
  void text;

  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status },
  );
}

export function errorResponse(message: string, status = 500) {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status },
  );
}
