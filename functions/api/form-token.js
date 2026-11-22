import { jsonResponse, sha256 } from "./_utils.js";

export async function onRequestGet(context) {
  const ts = Date.now();
  const secret = context.env.APP_SECRET || "codistack-secret-token";
  const token = await sha256(`${secret}:${ts}`);
  return jsonResponse({
    token,
    ts,
  });
}
