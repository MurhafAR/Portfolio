// src/lib/auth.ts
"use server";

import { cookies } from "next/headers";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  SESSION_COOKIE,
  timingSafeEqualStr,
  signToken,
  verifyToken,
} from "./session";

/**
 * Validates admin session cookie.
 */
export async function getAdminSession(): Promise<{
  email: string;
} | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (!session?.value) return null;

  const verified = verifyToken(session.value);
  if (
    verified &&
    timingSafeEqualStr(
      verified.email.toLowerCase(),
      ADMIN_EMAIL.toLowerCase()
    )
  ) {
    return { email: verified.email };
  }

  return null;
}

/**
 * Guard used in Server Actions — throws if not authenticated.
 */
export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Unauthorized: Admin session required");
  }
  return session;
}

/**
 * Admin login action with constant-time password check and HMAC signed cookie.
 */
export async function loginAdmin(
  email: string,
  password: string
): Promise<{ error: string } | { success: true }> {
  const emailValid = timingSafeEqualStr(
    email.trim().toLowerCase(),
    ADMIN_EMAIL.trim().toLowerCase()
  );
  const passValid = timingSafeEqualStr(password, ADMIN_PASSWORD);

  if (!emailValid || !passValid) {
    return { error: "Invalid credentials" };
  }

  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const token = signToken({ email: ADMIN_EMAIL, exp });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return { success: true };
}

/**
 * Logout action.
 */
export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
