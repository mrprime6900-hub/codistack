import "server-only";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { sql } from "drizzle-orm";
import { db } from "@/db";

/**
 * Secret used for signing form tokens and salting IP hashes.
 * Set APP_SECRET in production (see .env.example). If absent, a per-process
 * random secret is used, which is safe but resets on restart.
 */
const globalForSecret = globalThis as typeof globalThis & { __codistackEphemeral?: string };
function appSecret(): string {
  const configured = process.env.APP_SECRET;
  if (configured && configured.length >= 32) return configured;
  globalForSecret.__codistackEphemeral ??= randomBytes(32).toString("hex");
  return globalForSecret.__codistackEphemeral;
}

export const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

export function hmac(value: string): string {
  return createHmac("sha256", appSecret()).update(value).digest("base64url");
}

export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim().slice(0, 64);
  return req.headers.get("x-real-ip")?.slice(0, 64) ?? "unknown";
}

/** Salted one-way hash so abuse can be correlated without storing raw IPs. */
export function ipHash(req: Request): string {
  return hmac(`ip:${clientIp(req)}`).slice(0, 32);
}

export function userAgent(req: Request): string | null {
  return req.headers.get("user-agent")?.slice(0, 300) ?? null;
}

/* ---------- Form tokens (spam resistance) ---------- */

const MIN_FORM_AGE_MS = 3_000;
const MAX_FORM_AGE_MS = 2 * 60 * 60 * 1000;

export function issueFormToken(): string {
  const ts = Date.now().toString(36);
  const nonce = randomBytes(6).toString("hex");
  const payload = `${ts}.${nonce}`;
  return `${payload}.${hmac(`form:${payload}`)}`;
}

export type TokenCheck = "ok" | "invalid" | "too_fast" | "expired";

export function verifyFormToken(token: string): TokenCheck {
  const parts = token.split(".");
  if (parts.length !== 3) return "invalid";
  const [ts, nonce, sig] = parts as [string, string, string];
  if (!safeEqual(sig, hmac(`form:${ts}.${nonce}`))) return "invalid";
  const age = Date.now() - parseInt(ts, 36);
  if (!Number.isFinite(age) || age < 0) return "invalid";
  if (age < MIN_FORM_AGE_MS) return "too_fast";
  if (age > MAX_FORM_AGE_MS) return "expired";
  return "ok";
}

/* ---------- Rate limiting (fixed window, PostgreSQL-backed) ---------- */

export async function rateLimit(
  bucket: string,
  identity: string,
  limit: number,
  windowSeconds: number,
): Promise<{ allowed: boolean; retryAfter: number }> {
  const key = `${bucket}:${sha256(identity).slice(0, 32)}`;
  const result = await db.execute<{ count: number; elapsed: number }>(sql`
    insert into rate_limits (key, count, window_start)
    values (${key}, 1, now())
    on conflict (key) do update set
      count = case
        when rate_limits.window_start < now() - make_interval(secs => ${windowSeconds})
          then 1 else rate_limits.count + 1 end,
      window_start = case
        when rate_limits.window_start < now() - make_interval(secs => ${windowSeconds})
          then now() else rate_limits.window_start end
    returning count, extract(epoch from (now() - window_start))::float as elapsed
  `);
  const row = result.rows[0];
  const count = Number(row?.count ?? 1);
  const elapsed = Number(row?.elapsed ?? 0);
  return {
    allowed: count <= limit,
    retryAfter: Math.max(1, Math.ceil(windowSeconds - elapsed)),
  };
}

/* ---------- Response helpers ---------- */

export function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

/** Reject cross-site POSTs (CSRF defence in depth on top of SameSite cookies). */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // non-browser clients / same-origin GET-like navigations
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
