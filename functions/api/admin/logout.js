import { jsonResponse } from "../_utils.js";

export async function onRequestPost(context) {
  const { request, env } = context;
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/cs_admin=([^;]+)/);

  if (match && env.DB) {
    try {
      await env.DB.prepare("DELETE FROM admin_sessions WHERE token = ?")
        .bind(match[1])
        .run();
    } catch (err) {
      console.error("Logout DB error:", err);
    }
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": "cs_admin=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0",
    },
  });
}
