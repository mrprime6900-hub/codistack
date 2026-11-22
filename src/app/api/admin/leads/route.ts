import { eq } from "drizzle-orm";
import { db } from "@/db";
import { earlyAccessRegistrations, projectInquiries } from "@/db/schema";
import { isAdminRequest } from "@/lib/admin-auth";
import { json, sameOrigin } from "@/lib/security";

export const dynamic = "force-dynamic";

const EA_STATUSES = ["waiting", "contacted", "invited", "declined"] as const;
const PI_STATUSES = ["new", "in_review", "contacted", "closed", "spam"] as const;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Update a lead's status. Authorised on the server; hidden UI is not relied upon. */
export async function PATCH(req: Request) {
  if (!sameOrigin(req)) return json({ ok: false, error: "Request origin not allowed." }, 403);
  if (!isAdminRequest(req)) return json({ ok: false, error: "Unauthorized." }, 401);

  let body: { type?: unknown; id?: unknown; status?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }
  const { type, id, status } = body;
  if (typeof id !== "string" || !UUID.test(id) || typeof status !== "string") {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  try {
    if (type === "early-access" && (EA_STATUSES as readonly string[]).includes(status)) {
      const r = await db
        .update(earlyAccessRegistrations)
        .set({ status, updatedAt: new Date() })
        .where(eq(earlyAccessRegistrations.id, id))
        .returning({ id: earlyAccessRegistrations.id });
      return r.length ? json({ ok: true }) : json({ ok: false, error: "Not found." }, 404);
    }
    if (type === "inquiry" && (PI_STATUSES as readonly string[]).includes(status)) {
      const r = await db
        .update(projectInquiries)
        .set({ status, updatedAt: new Date() })
        .where(eq(projectInquiries.id, id))
        .returning({ id: projectInquiries.id });
      return r.length ? json({ ok: true }) : json({ ok: false, error: "Not found." }, 404);
    }
    return json({ ok: false, error: "Invalid request." }, 400);
  } catch (err) {
    console.error("[admin/leads] update failed", err instanceof Error ? err.message : err);
    return json({ ok: false, error: "Update failed." }, 500);
  }
}
