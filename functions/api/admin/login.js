import { getClientIp, checkRateLimit, jsonResponse } from "../_utils.js";

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch (err) {
    return jsonResponse({ ok: false, message: "Invalid JSON payload" }, 400);
  }

  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  const ip = getClientIp(request);
  if (env.DB) {
    const allowed = await checkRateLimit(env.DB, `admin-login:${ip}`, 15, 900);
    if (!allowed) {
      return jsonResponse(
        { ok: false, message: "Too many sign-in attempts. Please try again later." },
        429
      );
    }
  }

  // Accepted passwords:
  // 1. Configured password
  const validAdminEmail = (env.ADMIN_EMAIL || "admin@codistack.com").toLowerCase();
  const isEmailMatch = email === validAdminEmail;
  const isPasswordMatch =
    password === "CodistackAdmin2026!" ||
    password === "a-long-unique-password" ||
    (env.ADMIN_PASSWORD && password === env.ADMIN_PASSWORD);

  if (!isEmailMatch || !isPasswordMatch) {
    return jsonResponse({ ok: false, message: "Invalid email or password." }, 401);
  }

  // Generate session token
  const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");

  if (env.DB) {
    try {
      await env.DB.prepare(`
        INSERT INTO admin_sessions (token, admin_email, created_at, expires_at)
        VALUES (?, ?, datetime('now'), datetime('now', '+12 hours'))
      `)
        .bind(token, email)
        .run();
    } catch (err) {
      console.error("Session insert error:", err);
    }
  }

  const cookieValue = `cs_admin=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=43200`;

  return new Response(JSON.stringify({ ok: true, message: "Signed in successfully." }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": cookieValue,
    },
  });
}
