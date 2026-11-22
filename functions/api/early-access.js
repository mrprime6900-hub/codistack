import { getClientIp, checkRateLimit, jsonResponse, sha256 } from "./_utils.js";

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch (err) {
    return jsonResponse({ ok: false, message: "Invalid JSON payload" }, 400);
  }

  // Honeypot check
  if (body.website && String(body.website).trim() !== "") {
    return jsonResponse({ ok: false, message: "Submission rejected." }, 400);
  }

  // Validation
  const fullName = String(body.fullName || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const phone = body.phone ? String(body.phone).trim() : null;
  const businessName = body.businessName ? String(body.businessName).trim() : null;
  const businessCategory = body.businessCategory ? String(body.businessCategory).trim() : null;
  const consentVersion = String(body.consentVersion || "2026-v1").trim();

  const fieldErrors = {};
  if (fullName.length < 2 || fullName.length > 120) {
    fieldErrors.fullName = "Please enter your full name (2-120 characters).";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    fieldErrors.email = "Please enter a valid email address.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return jsonResponse(
      { ok: false, message: "Please correct the highlighted fields.", fieldErrors },
      422
    );
  }

  const ip = getClientIp(request);

  if (env.DB) {
    // Rate limit
    const allowed = await checkRateLimit(env.DB, `early-access:${ip}`, 8, 3600);
    if (!allowed) {
      return jsonResponse(
        { ok: false, message: "Too many submissions. Please wait a while before trying again." },
        429
      );
    }

    try {
      // Check duplicate
      const existing = await env.DB.prepare(
        "SELECT id FROM early_access_registrations WHERE lower(email) = lower(?)"
      )
        .bind(email)
        .first();

      if (existing) {
        return jsonResponse(
          {
            ok: true,
            duplicate: true,
            message: "You're already on the BILLINGHACKS priority waitlist! We'll reach out soon.",
          },
          200
        );
      }

      const id = crypto.randomUUID();
      const ipHash = await sha256(`ip:${ip}`);
      const userAgent = request.headers.get("user-agent")?.slice(0, 300) || null;

      await env.DB.prepare(`
        INSERT INTO early_access_registrations (
          id, full_name, email, phone, business_name, business_category,
          status, consent_version, consent_at, created_at, ip_hash, user_agent
        ) VALUES (?, ?, ?, ?, ?, ?, 'new', ?, datetime('now'), datetime('now'), ?, ?)
      `)
        .bind(
          id,
          fullName,
          email,
          phone,
          businessName,
          businessCategory,
          consentVersion,
          ipHash,
          userAgent
        )
        .run();

      return jsonResponse(
        {
          ok: true,
          duplicate: false,
          id,
          message: "Welcome to BILLINGHACKS Early Access! We've saved your spot.",
        },
        201
      );
    } catch (dbErr) {
      console.error("D1 early access error:", dbErr);
      return jsonResponse(
        { ok: false, message: "Database temporarily unavailable. Please try again." },
        500
      );
    }
  }

  // Fallback if no DB
  return jsonResponse({ ok: true, duplicate: false, message: "Registered successfully." }, 200);
}
