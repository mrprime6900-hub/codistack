import { jsonResponse } from "./_utils.js";

export async function onRequestGet(context) {
  const { env } = context;
  try {
    let dbStatus = "not_configured";
    let dbRows = null;
    if (env && env.DB) {
      const res = await env.DB.prepare("SELECT 1 as ok").first();
      dbStatus = res && res.ok === 1 ? "connected" : "error";
      const countRes = await env.DB.prepare("SELECT COUNT(*) as c FROM admins").first();
      dbRows = { admins: countRes ? countRes.c : 0 };
    }
    return jsonResponse({
      status: "ok",
      database: dbStatus,
      tables_verified: dbRows,
      env_keys: env ? Object.keys(env) : [],
      timestamp: new Date().toISOString(),
      platform: "cloudflare-pages-d1",
      brand: "Codistack",
    });
  } catch (err) {
    return jsonResponse(
      {
        status: "error",
        message: err.message,
        stack: err.stack,
      },
      500
    );
  }
}
