import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    return NextResponse.json({
      message:
        "User registered successfully",
      user: {
        id: Date.now(),
        ...body,
      },
    });
  } catch {
    return NextResponse.json(
      {
        message:
          "Register failed",
      },
      { status: 500 }
    );
  }
}