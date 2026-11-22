/**
 * Shared utility functions for Cloudflare Pages Functions
 */

export async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      ...extraHeaders,
    },
  });
}

export function getClientIp(request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "127.0.0.1"
  );
}

export async function checkRateLimit(db, key, limit = 10, windowSec = 3600) {
  if (!db) return true;
  try {
    const now = Math.floor(Date.now() / 1000);
    const existing = await db
      .prepare("SELECT count, reset_at FROM rate_limits WHERE key = ?")
      .bind(key)
      .first();

    if (!existing || now > existing.reset_at) {
      await db
        .prepare(
          "INSERT OR REPLACE INTO rate_limits (key, count, reset_at) VALUES (?, 1, ?)"
        )
        .bind(key, now + windowSec)
        .run();
      return true;
    }

    if (existing.count >= limit) {
      return false;
    }

    await db
      .prepare("UPDATE rate_limits SET count = count + 1 WHERE key = ?")
      .bind(key)
      .run();
    return true;
  } catch (err) {
    console.error("Rate limit check error:", err);
    return true; // Fail open so users aren't locked out on DB blip
  }
}

export async function verifyAdminSession(request, db) {
  if (!db) return null;
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/cs_admin=([^;]+)/);
  if (!match) return null;
  const token = match[1];

  try {
    const session = await db
      .prepare(
        "SELECT admin_email FROM admin_sessions WHERE token = ? AND expires_at > datetime('now')"
      )
      .bind(token)
      .first();
    return session ? session.admin_email : null;
  } catch (err) {
    console.error("Session verification error:", err);
    return null;
  }
}
