import { verifyAdminSession } from "../_utils.js";

function escapeCsv(val) {
  if (val === null || val === undefined) return '""';
  let str = String(val);
  // Neutralize formula injection
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

export async function onRequestGet(context) {
  const { request, env } = context;

  const admin = await verifyAdminSession(request, env.DB);
  if (!admin) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const type = url.searchParams.get("type") || "inquiry";

  try {
    if (type === "early-access") {
      const res = await env.DB.prepare(
        "SELECT id, full_name, email, phone, business_name, business_category, status, created_at, admin_notes FROM early_access_registrations ORDER BY created_at DESC"
      ).all();

      const headers = ["ID", "Full Name", "Email", "Phone", "Business Name", "Category", "Status", "Created At", "Admin Notes"];
      const rows = (res.results || []).map((r) => [
        escapeCsv(r.id),
        escapeCsv(r.full_name),
        escapeCsv(r.email),
        escapeCsv(r.phone),
        escapeCsv(r.business_name),
        escapeCsv(r.business_category),
        escapeCsv(r.status),
        escapeCsv(r.created_at),
        escapeCsv(r.admin_notes),
      ].join(","));

      const csv = [headers.join(","), ...rows].join("\r\n");
      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="codistack-early-access.csv"',
        },
      });
    } else {
      const res = await env.DB.prepare(
        "SELECT id, full_name, email, phone, company, service, description, budget, timeline, status, created_at, admin_notes FROM project_inquiries ORDER BY created_at DESC"
      ).all();

      const headers = ["ID", "Full Name", "Email", "Phone", "Company", "Service", "Description", "Budget", "Timeline", "Status", "Created At", "Admin Notes"];
      const rows = (res.results || []).map((r) => [
        escapeCsv(r.id),
        escapeCsv(r.full_name),
        escapeCsv(r.email),
        escapeCsv(r.phone),
        escapeCsv(r.company),
        escapeCsv(r.service),
        escapeCsv(r.description),
        escapeCsv(r.budget),
        escapeCsv(r.timeline),
        escapeCsv(r.status),
        escapeCsv(r.created_at),
        escapeCsv(r.admin_notes),
      ].join(","));

      const csv = [headers.join(","), ...rows].join("\r\n");
      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="codistack-inquiries.csv"',
        },
      });
    }
  } catch (err) {
    console.error("CSV Export error:", err);
    return new Response("Export failed: " + err.message, { status: 500 });
  }
}
