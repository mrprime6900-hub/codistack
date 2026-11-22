import { desc } from "drizzle-orm";
import { db } from "@/db";
import { earlyAccessRegistrations, projectInquiries } from "@/db/schema";
import { isAdminRequest } from "@/lib/admin-auth";
import { json } from "@/lib/security";

export const dynamic = "force-dynamic";

/** Neutralises spreadsheet formula injection and quotes CSV fields. */
function cell(v: unknown): string {
  let s = v instanceof Date ? v.toISOString() : v == null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: Request) {
  if (!isAdminRequest(req)) return json({ ok: false, error: "Unauthorized." }, 401);

  const type = new URL(req.url).searchParams.get("type");
  let header: string[];
  let rows: unknown[][];

  try {
    if (type === "early-access") {
      const data = await db.select().from(earlyAccessRegistrations).orderBy(desc(earlyAccessRegistrations.createdAt));
      header = ["id", "full_name", "email", "phone", "business_name", "business_category", "status", "registered_at", "consent_at", "consent_version"];
      rows = data.map((r) => [r.id, r.fullName, r.email, r.phone, r.businessName, r.businessCategory, r.status, r.createdAt, r.consentAt, r.consentVersion]);
    } else if (type === "inquiry") {
      const data = await db.select().from(projectInquiries).orderBy(desc(projectInquiries.createdAt));
      header = ["id", "full_name", "email", "phone", "company", "service", "description", "budget", "timeline", "status", "submitted_at"];
      rows = data.map((r) => [r.id, r.fullName, r.email, r.phone, r.company, r.service, r.description, r.budget, r.timeline, r.status, r.createdAt]);
    } else {
      return json({ ok: false, error: "Invalid type." }, 400);
    }
  } catch {
    return json({ ok: false, error: "Export failed." }, 500);
  }

  const csv = [header.map(cell).join(","), ...rows.map((r) => r.map(cell).join(","))].join("\r\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="codistack-${type}-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
