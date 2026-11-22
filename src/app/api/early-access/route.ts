import { eq } from "drizzle-orm";
import { db } from "@/db";
import { earlyAccessRegistrations } from "@/db/schema";
import {
  CONSENT_VERSION,
  earlyAccessSchema,
  flattenErrors,
  normalizeEmail,
} from "@/lib/validation";
import {
  clientIp,
  ipHash,
  json,
  rateLimit,
  sameOrigin,
  userAgent,
  verifyFormToken,
} from "@/lib/security";

export const dynamic = "force-dynamic";

const MAX_BODY = 20_000;

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ ok: false, error: "Request origin not allowed." }, 403);

  let rl;
  try {
    rl = await rateLimit("early-access", clientIp(req), 6, 600);
  } catch {
    return json({ ok: false, error: "The service is temporarily unavailable. Please try again shortly." }, 503);
  }
  if (!rl.allowed) {
    return json(
      { ok: false, error: "Too many attempts. Please wait a few minutes and try again." },
      429,
      { "Retry-After": String(rl.retryAfter) },
    );
  }

  let raw: unknown;
  try {
    const body = await req.text();
    if (body.length > MAX_BODY) return json({ ok: false, error: "Request too large." }, 413);
    raw = JSON.parse(body);
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  const parsed = earlyAccessSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors = flattenErrors(parsed.error);
    if ("website" in fieldErrors || "formToken" in fieldErrors || "submissionKey" in fieldErrors) {
      return json({ ok: false, error: "Submission could not be verified. Please reload the page and try again." }, 400);
    }
    return json({ ok: false, error: "Please correct the highlighted fields.", fieldErrors }, 422);
  }
  const data = parsed.data;

  const tokenState = verifyFormToken(data.formToken);
  if (tokenState !== "ok") {
    return json(
      {
        ok: false,
        error:
          tokenState === "too_fast"
            ? "That was very quick. Please wait a moment and submit again."
            : "Your form session expired. Please reload the page and try again.",
        retry: tokenState === "too_fast",
      },
      400,
    );
  }

  try {
    const inserted = await db
      .insert(earlyAccessRegistrations)
      .values({
        fullName: data.fullName,
        email: data.email.trim(),
        emailNormalized: normalizeEmail(data.email),
        phone: data.phone ?? null,
        businessName: data.businessName ?? null,
        businessCategory: data.businessCategory ?? null,
        consentAt: new Date(),
        consentVersion: CONSENT_VERSION,
        submissionKey: data.submissionKey,
        ipHash: ipHash(req),
        userAgent: userAgent(req),
      })
      .onConflictDoNothing()
      .returning({ id: earlyAccessRegistrations.id });

    if (inserted.length > 0) {
      return json({ ok: true, status: "registered" }, 201);
    }

    // Conflict: either a safe retry of the same submission, or an email already on the list.
    const [byKey] = await db
      .select({ id: earlyAccessRegistrations.id })
      .from(earlyAccessRegistrations)
      .where(eq(earlyAccessRegistrations.submissionKey, data.submissionKey))
      .limit(1);
    if (byKey) return json({ ok: true, status: "registered" });

    const [byEmail] = await db
      .select({ id: earlyAccessRegistrations.id })
      .from(earlyAccessRegistrations)
      .where(eq(earlyAccessRegistrations.emailNormalized, normalizeEmail(data.email)))
      .limit(1);
    if (byEmail) return json({ ok: true, status: "duplicate" });

    return json({ ok: false, error: "We could not confirm your registration. Please try again." }, 500);
  } catch (err) {
    console.error("[early-access] database error", err instanceof Error ? err.message : err);
    return json(
      { ok: false, error: "We could not save your registration right now. Nothing was recorded. Please try again in a moment." },
      503,
    );
  }
}
