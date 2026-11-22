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
  const company = body.company ? String(body.company).trim() : null;
  const service = String(body.service || "").trim();
  const description = String(body.description || "").trim();
  const budget = body.budget ? String(body.budget).trim() : null;
  const timeline = body.timeline ? String(body.timeline).trim() : null;

  const fieldErrors = {};
  if (fullName.length < 2 || fullName.length > 120) {
    fieldErrors.fullName = "Please enter your name (2-120 characters).";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    fieldErrors.email = "Please enter a valid work email address.";
  }
  if (!service) {
    fieldErrors.service = "Please select a service category.";
  }
  if (description.length < 10 || description.length > 4000) {
    fieldErrors.description = "Please describe your project or requirements (10-4000 characters).";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return jsonResponse(
      { ok: false, message: "Please correct the highlighted fields.", fieldErrors },
      422
    );
  }

  const ip = getClientIp(request);

  if (env.DB) {
    const allowed = await checkRateLimit(env.DB, `inquiry:${ip}`, 8, 3600);
    if (!allowed) {
      return jsonResponse(
        { ok: false, message: "Too many submissions. Please wait a while before trying again." },
        429
      );
    }

    try {
      const fingerprint = await sha256(
        [email, service, description.toLowerCase().replace(/\s+/g, " ")].join("|")
      );

      const existing = await env.DB.prepare(
        "SELECT id FROM project_inquiries WHERE fingerprint = ?"
      )
        .bind(fingerprint)
        .first();

      if (existing) {
        return jsonResponse(
          {
            ok: true,
            duplicate: true,
            message: "We've already recorded this inquiry! Our engineering team will contact you shortly.",
          },
          200
        );
      }

      const id = crypto.randomUUID();
      const ipHash = await sha256(`ip:${ip}`);
      const userAgent = request.headers.get("user-agent")?.slice(0, 300) || null;

      await env.DB.prepare(`
        INSERT INTO project_inquiries (
          id, full_name, email, phone, company, service, description,
          budget, timeline, status, fingerprint, created_at, updated_at,
          ip_hash, user_agent
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, datetime('now'), datetime('now'), ?, ?)
      `)
        .bind(
          id,
          fullName,
          email,
          phone,
          company,
          service,
          description,
          budget,
          timeline,
          fingerprint,
          ipHash,
          userAgent
        )
        .run();

      return jsonResponse(
        {
          ok: true,
          duplicate: false,
          id,
          message: "Thank you for reaching out! We will review your project and get back to you within 24 hours.",
        },
        201
      );
    } catch (dbErr) {
      console.error("D1 project inquiry error:", dbErr);
      return jsonResponse(
        { ok: false, message: "Database temporarily unavailable. Please try again." },
        500
      );
    }
  }

  return jsonResponse({ ok: true, duplicate: false, message: "Inquiry received." }, 200);
}
