import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { routing } from "@/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const segments = pathname.split("/");
  const firstSegment = segments[1];

  const hasLocalePrefix = routing.locales.includes(
    firstSegment as (typeof routing.locales)[number],
  );

  // Let next-intl detect the preferred locale first.
  // This handles requests such as "/" and "/products".
  if (!hasLocalePrefix) {
    return handleI18nRouting(request);
  }

  const locale = firstSegment as (typeof routing.locales)[number];

  const pathnameWithoutLocale =
    `/${segments.slice(2).join("/")}`;

  const normalizedPathname =
    pathnameWithoutLocale.replace(/\/+$/, "") || "/";

  const isLoginPage = normalizedPathname === "/login";

  const token = request.cookies.get("token")?.value;

  if (!token && !isLoginPage) {
    const url = request.nextUrl.clone();

    url.pathname = `/${locale}/login`;
    url.search = "";

    return NextResponse.redirect(url);
  }

  if (token && isLoginPage) {
    const url = request.nextUrl.clone();

    url.pathname = `/${locale}/products`;
    url.search = "";

    return NextResponse.redirect(url);
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};