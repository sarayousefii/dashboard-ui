import {
  NextRequest,
  NextResponse,
} from "next/server";

export async function GET(
  request: NextRequest
) {
  const token =
    request.cookies.get("token");

  if (!token) {
    return NextResponse.json(
      {
        user: null,
      },
      {
        status: 401,
      }
    );
  }

  return NextResponse.json({
    user: {
      id: 1,
      name: "sara yousefi",
      role: "admin",
    },
  });
}