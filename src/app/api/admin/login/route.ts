import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  createSessionValue,
  isAdminConfigured,
  sessionCookieOptions,
  verifyCredentials,
} from "@/lib/admin-auth";
import { clientIp, json, rateLimit, sameOrigin } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ ok: false, error: "Request origin not allowed." }, 403);
  if (!isAdminConfigured()) {
    return json({ ok: false, error: "Administrator access is not configured on this deployment." }, 503);
  }

  try {
    const rl = await rateLimit("admin-login", clientIp(req), 5, 900);
    if (!rl.allowed) {
      return json({ ok: false, error: "Too many sign-in attempts. Try again later." }, 429, {
        "Retry-After": String(rl.retryAfter),
      });
    }
  } catch {
    return json({ ok: false, error: "Service temporarily unavailable." }, 503);
  }

  let body: { email?: unknown; password?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }
  const email = typeof body.email === "string" ? body.email.slice(0, 254) : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!verifyCredentials(email, password)) {
    return json({ ok: false, error: "Invalid email or password." }, 401);
  }

  const res = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  res.cookies.set(SESSION_COOKIE, createSessionValue(), sessionCookieOptions(req));
  return res;
}
