import { jsonResponse } from "./_utils.js";

export async function onRequestGet(context) {
  const { env } = context;
  try {
    let dbStatus = "not_configured";
    if (env.DB) {
      await env.DB.prepare("SELECT 1 as ok").first();
      dbStatus = "connected";
    }
    return jsonResponse({
      status: "ok",
      database: dbStatus,
      timestamp: new Date().toISOString(),
      platform: "cloudflare-pages-d1",
      brand: "Codistack",
    });
  } catch (err) {
    return jsonResponse(
      {
        status: "error",
        message: err.message,
      },
      500
    );
  }
}
