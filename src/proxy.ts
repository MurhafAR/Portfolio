import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  ADMIN_EMAIL,
  verifyToken,
  timingSafeEqualStr,
} from "@/lib/session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value;
  let isAuthenticated = false;

  if (sessionCookie) {
    const verified = verifyToken(sessionCookie);
    if (
      verified &&
      timingSafeEqualStr(
        verified.email.toLowerCase(),
        ADMIN_EMAIL.toLowerCase()
      )
    ) {
      isAuthenticated = true;
    }
  }

  // 1. If accessing /admin or subpaths and not authenticated -> redirect to /login
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. If accessing /login and already authenticated -> redirect to /admin
  if (pathname === "/login") {
    if (isAuthenticated) {
      const adminUrl = new URL("/admin", request.url);
      return NextResponse.redirect(adminUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin", "/login"],
};
