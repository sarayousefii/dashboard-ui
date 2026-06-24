import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const isLoginPage = request.nextUrl.pathname === "/login";
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith("/products") ||
    request.nextUrl.pathname.startsWith("/users") ||
    request.nextUrl.pathname.startsWith("/");

  // اگر لاگین نکرده و وارد protected شده
  if (isProtectedRoute && !isLoginPage && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // اگر لاگین کرده و میره login
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/products", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};