import crypto from "node:crypto";

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@example.com";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "change-this-password";
export const AUTH_SECRET =
  process.env.AUTH_SECRET ??
  "portfolio-default-fallback-auth-secret-key-at-least-32-chars";
export const SESSION_COOKIE = "admin-session";

export interface SessionData {
  email: string;
  exp: number;
}

// Constant-time string equality check to avoid timing leaks
export function timingSafeEqualStr(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, "utf-8");
  const bBuf = Buffer.from(b, "utf-8");

  // crypto.timingSafeEqual throws if buffer byteLengths differ
  if (aBuf.length !== bBuf.length) {
    crypto.timingSafeEqual(aBuf, aBuf);
    return false;
  }
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export function signToken(data: SessionData): string {
  const payload = Buffer.from(JSON.stringify(data), "utf-8").toString(
    "base64url"
  );
  const signature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyToken(token: string): SessionData | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;

  const expectedSignature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(payload)
    .digest("base64url");

  const sigBuf = Buffer.from(signature, "utf-8");
  const expBuf = Buffer.from(expectedSignature, "utf-8");

  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const data: SessionData = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf-8")
    );
    if (typeof data.exp !== "number" || data.exp < Date.now()) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}
