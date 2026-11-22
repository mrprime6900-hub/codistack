import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { projectInquiries } from "@/db/schema";
import { flattenErrors, normalizeEmail, projectInquirySchema } from "@/lib/validation";
import {
  clientIp,
  ipHash,
  json,
  rateLimit,
  sameOrigin,
  sha256,
  userAgent,
  verifyFormToken,
} from "@/lib/security";

export const dynamic = "force-dynamic";

const MAX_BODY = 30_000;

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ ok: false, error: "Request origin not allowed." }, 403);

  let rl;
  try {
    rl = await rateLimit("project-inquiry", clientIp(req), 5, 900);
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

  const parsed = projectInquirySchema.safeParse(raw);
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

  const emailNormalized = normalizeEmail(data.email);
  const contentHash = sha256(data.description.toLowerCase().replace(/\s+/g, " "));

  try {
    const inserted = await db
      .insert(projectInquiries)
      .values({
        fullName: data.fullName,
        email: data.email.trim(),
        emailNormalized,
        phone: data.phone ?? null,
        company: data.company ?? null,
        service: data.service,
        description: data.description,
        budget: data.budget ?? null,
        timeline: data.timeline ?? null,
        contentHash,
        submissionKey: data.submissionKey,
        ipHash: ipHash(req),
        userAgent: userAgent(req),
      })
      .onConflictDoNothing()
      .returning({ id: projectInquiries.id });

    if (inserted.length > 0) return json({ ok: true, status: "received" }, 201);

    const [byKey] = await db
      .select({ id: projectInquiries.id })
      .from(projectInquiries)
      .where(eq(projectInquiries.submissionKey, data.submissionKey))
      .limit(1);
    if (byKey) return json({ ok: true, status: "received" });

    const [dup] = await db
      .select({ id: projectInquiries.id })
      .from(projectInquiries)
      .where(and(eq(projectInquiries.emailNormalized, emailNormalized), eq(projectInquiries.contentHash, contentHash)))
      .limit(1);
    if (dup) return json({ ok: true, status: "duplicate" });

    return json({ ok: false, error: "We could not confirm your inquiry. Please try again." }, 500);
  } catch (err) {
    console.error("[project-inquiry] database error", err instanceof Error ? err.message : err);
    return json(
      { ok: false, error: "We could not save your inquiry right now. Nothing was recorded. Please try again, or contact us directly by email or WhatsApp." },
      503,
    );
  }
}
