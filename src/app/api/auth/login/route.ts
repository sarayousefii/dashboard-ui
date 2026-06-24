import {
  NextRequest,
  NextResponse,
} from "next/server";

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const { username, password } =
      body;

    if (
      username === "admin" &&
      password === "123456"
    ) {
      const token =
        "fake-jwt-token";

      const response =
        NextResponse.json({
          success: true,

          user: {
            id: 1,
            name:
              "Admin User",
            role: "admin",
          },
        });

      response.cookies.set(
        "token",
        token,
        {
          httpOnly: true,

          secure:
            process.env.NODE_ENV ===
            "production",

          sameSite: "strict",

          path: "/",
        }
      );

      return response;
    }

    return NextResponse.json(
      {
        message:
          "Invalid credentials",
      },
      {
        status: 401,
      }
    );
  } catch {
    return NextResponse.json(
      {
        message:
          "Login failed",
      },
      {
        status: 500,
      }
    );
  }
}