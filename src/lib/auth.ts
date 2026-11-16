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

export async function getAdminSession(): Promise<{ email: string } | null> {
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

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Unauthorized: Admin session required");
  }
  return session;
}

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

  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const token = signToken({ email: ADMIN_EMAIL, exp });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { success: true };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
