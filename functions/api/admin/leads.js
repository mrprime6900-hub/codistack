import { jsonResponse, verifyAdminSession } from "../_utils.js";

export async function onRequestGet(context) {
  const { request, env } = context;

  const admin = await verifyAdminSession(request, env.DB);
  if (!admin) {
    return jsonResponse({ ok: false, message: "Unauthorized. Please sign in." }, 401);
  }

  try {
    const earlyAccess = await env.DB.prepare(
      "SELECT * FROM early_access_registrations ORDER BY created_at DESC LIMIT 200"
    ).all();

    const inquiries = await env.DB.prepare(
      "SELECT * FROM project_inquiries ORDER BY created_at DESC LIMIT 200"
    ).all();

    return jsonResponse({
      ok: true,
      adminEmail: admin,
      earlyAccess: earlyAccess.results || [],
      inquiries: inquiries.results || [],
    });
  } catch (err) {
    console.error("Fetch leads error:", err);
    return jsonResponse({ ok: false, message: err.message }, 500);
  }
}

export async function onRequestPatch(context) {
  const { request, env } = context;

  const admin = await verifyAdminSession(request, env.DB);
  if (!admin) {
    return jsonResponse({ ok: false, message: "Unauthorized." }, 401);
  }

  let body;
  try {
    body = await request.json();
  } catch (err) {
    return jsonResponse({ ok: false, message: "Invalid payload." }, 400);
  }

  const { type, id, status, notes } = body;
  if (!id || !type) {
    return jsonResponse({ ok: false, message: "Missing id or type." }, 400);
  }

  try {
    if (type === "inquiry") {
      if (status) {
        await env.DB.prepare(
          "UPDATE project_inquiries SET status = ?, updated_at = datetime('now') WHERE id = ?"
        )
          .bind(status, id)
          .run();
      }
      if (notes !== undefined) {
        await env.DB.prepare(
          "UPDATE project_inquiries SET admin_notes = ?, updated_at = datetime('now') WHERE id = ?"
        )
          .bind(notes, id)
          .run();
      }
    } else if (type === "early-access") {
      if (status) {
        await env.DB.prepare(
          "UPDATE early_access_registrations SET status = ? WHERE id = ?"
        )
          .bind(status, id)
          .run();
      }
      if (notes !== undefined) {
        await env.DB.prepare(
          "UPDATE early_access_registrations SET admin_notes = ? WHERE id = ?"
        )
          .bind(notes, id)
          .run();
      }
    } else {
      return jsonResponse({ ok: false, message: "Invalid lead type." }, 400);
    }

    return jsonResponse({ ok: true, message: "Updated successfully." });
  } catch (err) {
    console.error("Update error:", err);
    return jsonResponse({ ok: false, message: err.message }, 500);
  }
}
