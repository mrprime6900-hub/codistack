import "server-only";
import { scryptSync } from "node:crypto";
import { cookies } from "next/headers";
import { hmac, safeEqual } from "@/lib/security";

/**
 * Administrator authentication.
 *
 * There is NO default account. The admin area is disabled until these are set:
 *   ADMIN_EMAIL          - administrator login email
 *   ADMIN_PASSWORD_HASH  - output of `node scripts/hash-password.mjs "<password>"`
 *   APP_SECRET           - random string, 32+ characters (signs sessions)
 */

export const SESSION_COOKIE = "cs_admin";
const SESSION_TTL_SECONDS = 8 * 60 * 60;

export function isAdminConfigured(): boolean {
  return Boolean(
    process.env.ADMIN_EMAIL &&
      process.env.ADMIN_PASSWORD_HASH?.startsWith("scrypt$") &&
      process.env.APP_SECRET &&
      process.env.APP_SECRET.length >= 32,
  );
}

export function verifyCredentials(email: string, password: string): boolean {
  if (!isAdminConfigured()) return false;
  const expectedEmail = process.env.ADMIN_EMAIL!.trim().toLowerCase();
  const [, salt, hash] = process.env.ADMIN_PASSWORD_HASH!.split("$");
  if (!salt || !hash) return false;
  // Always run the KDF so timing does not reveal whether the email matched.
  const derived = scryptSync(password.slice(0, 256), Buffer.from(salt, "hex"), 64).toString("hex");
  const passwordOk = safeEqual(derived, hash);
  const emailOk = safeEqual(email.trim().toLowerCase(), expectedEmail);
  return passwordOk && emailOk;
}

export function createSessionValue(): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = Buffer.from(JSON.stringify({ r: "admin", exp })).toString("base64url");
  return `${payload}.${hmac(`session:${payload}`)}`;
}

export function isValidSessionValue(value: string | undefined | null): boolean {
  if (!value || !isAdminConfigured()) return false;
  const [payload, sig] = value.split(".");
  if (!payload || !sig) return false;
  if (!safeEqual(sig, hmac(`session:${payload}`))) return false;
  try {
    const { exp, r } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      exp: number;
      r: string;
    };
    return r === "admin" && typeof exp === "number" && exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

export async function isAdminSession(): Promise<boolean> {
  const store = await cookies();
  return isValidSessionValue(store.get(SESSION_COOKIE)?.value);
}

/** For route handlers: authorise from the raw Cookie header. */
export function isAdminRequest(req: Request): boolean {
  const header = req.headers.get("cookie") ?? "";
  const match = header.split(/;\s*/).find((c) => c.startsWith(`${SESSION_COOKIE}=`));
  return isValidSessionValue(match?.slice(SESSION_COOKIE.length + 1));
}

export function sessionCookieOptions(req: Request) {
  const proto = req.headers.get("x-forwarded-proto") ?? new URL(req.url).protocol.replace(":", "");
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: proto === "https",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}
