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

  if (pathname.startsWith("/admin") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin", "/login"],
};
