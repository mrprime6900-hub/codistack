import Link from "next/link";
import { redirect } from "next/navigation";
import { and, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { earlyAccessRegistrations as ea, projectInquiries as pi } from "@/db/schema";
import { isAdminSession } from "@/lib/admin-auth";
import { StatusSelect } from "./StatusSelect";
import { LogoutButton } from "./LogoutButton";

export const dynamic = "force-dynamic";

const EA_STATUSES = ["waiting", "contacted", "invited", "declined"] as const;
const PI_STATUSES = ["new", "in_review", "contacted", "closed", "spam"] as const;
const LIMIT = 200;

type Params = { tab?: string; q?: string; status?: string };

const fmt = (d: Date) =>
  new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(d);

const esc = (s: string) => s.replace(/[\\%_]/g, "\\$&");

export default async function AdminPage({ searchParams }: { searchParams: Promise<Params> }) {
  if (!(await isAdminSession())) redirect("/admin/login");

  const sp = await searchParams;
  const tab = sp.tab === "inquiries" ? "inquiries" : "early-access";
  const q = (sp.q ?? "").trim().slice(0, 100);
  const statuses = tab === "inquiries" ? PI_STATUSES : EA_STATUSES;
  const status = (statuses as readonly string[]).includes(sp.status ?? "") ? sp.status! : "";

  const [[eaTotal], [piTotal]] = await Promise.all([
    db.select({ n: count() }).from(ea),
    db.select({ n: count() }).from(pi),
  ]);

  let eaRows: (typeof ea.$inferSelect)[] = [];
  let piRows: (typeof pi.$inferSelect)[] = [];

  if (tab === "early-access") {
    const conds: SQL[] = [];
    if (q) {
      const p = `%${esc(q)}%`;
      conds.push(or(ilike(ea.fullName, p), ilike(ea.email, p), ilike(ea.businessName, p), ilike(ea.phone, p))!);
    }
    if (status) conds.push(eq(ea.status, status));
    eaRows = await db.select().from(ea).where(conds.length ? and(...conds) : undefined).orderBy(desc(ea.createdAt)).limit(LIMIT);
  } else {
    const conds: SQL[] = [];
    if (q) {
      const p = `%${esc(q)}%`;
      conds.push(or(ilike(pi.fullName, p), ilike(pi.email, p), ilike(pi.company, p), ilike(pi.description, p), ilike(pi.service, p))!);
    }
    if (status) conds.push(eq(pi.status, status));
    piRows = await db.select().from(pi).where(conds.length ? and(...conds) : undefined).orderBy(desc(pi.createdAt)).limit(LIMIT);
  }

  const tabCls = (active: boolean) =>
    `rounded-lg px-4 py-2 text-sm font-semibold ${active ? "bg-electric/25 text-white shadow-[inset_0_0_0_1px_rgba(135,216,255,0.4)]" : "text-slate-400 hover:text-white"}`;

  return (
    <div className="container-x pb-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-mono">Lead management</p>
          <h1 className="mt-2 text-3xl font-bold uppercase text-white sm:text-4xl">Admin</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <a className="btn btn-secondary !min-h-10 !px-4 !py-2 !text-sm" href="/api/admin/export?type=early-access">Export waiting list CSV</a>
          <a className="btn btn-secondary !min-h-10 !px-4 !py-2 !text-sm" href="/api/admin/export?type=inquiry">Export inquiries CSV</a>
          <LogoutButton />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2 rounded-xl bg-base/60 p-1.5 sm:w-fit" role="navigation" aria-label="Lead type">
        <Link href="/admin?tab=early-access" className={tabCls(tab === "early-access")}>Beta waiting list ({eaTotal?.n ?? 0})</Link>
        <Link href="/admin?tab=inquiries" className={tabCls(tab === "inquiries")}>Project inquiries ({piTotal?.n ?? 0})</Link>
      </div>

      <form method="get" className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input type="hidden" name="tab" value={tab} />
        <label className="sr-only" htmlFor="q">Search</label>
        <input id="q" name="q" defaultValue={q} placeholder="Search name, email, business…" className="field-input sm:max-w-sm" />
        <label className="sr-only" htmlFor="status">Status</label>
        <select id="status" name="status" defaultValue={status} className="field-input sm:max-w-[12rem]">
          <option value="">All statuses</option>
          {statuses.map((s) => (<option key={s} value={s}>{s.replace("_", " ")}</option>))}
        </select>
        <button className="btn btn-primary !min-h-12" type="submit">Filter</button>
      </form>

      <div className="glass mt-6 overflow-x-auto rounded-2xl">
        {tab === "early-access" ? (
          <table className="w-full min-w-[56rem] text-left text-sm">
            <thead className="border-b border-sky/15 font-mono text-[0.68rem] uppercase tracking-widest text-sky">
              <tr><th className="p-4">Registered (IST)</th><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Phone</th><th className="p-4">Business</th><th className="p-4">Category</th><th className="p-4">Status</th></tr>
            </thead>
            <tbody>
              {eaRows.map((r) => (
                <tr key={r.id} className="border-b border-sky/10 align-top">
                  <td className="whitespace-nowrap p-4 text-slate-400">{fmt(r.createdAt)}</td>
                  <td className="p-4 font-medium text-white">{r.fullName}</td>
                  <td className="p-4"><a className="text-sky underline underline-offset-4" href={`mailto:${r.email}`}>{r.email}</a></td>
                  <td className="p-4">{r.phone ?? "—"}</td>
                  <td className="p-4">{r.businessName ?? "—"}</td>
                  <td className="p-4">{r.businessCategory ?? "—"}</td>
                  <td className="p-4"><StatusSelect type="early-access" id={r.id} value={r.status} options={EA_STATUSES} /></td>
                </tr>
              ))}
              {eaRows.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-slate-400">No registrations match.</td></tr>}
            </tbody>
          </table>
        ) : (
          <table className="w-full min-w-[64rem] text-left text-sm">
            <thead className="border-b border-sky/15 font-mono text-[0.68rem] uppercase tracking-widest text-sky">
              <tr><th className="p-4">Submitted (IST)</th><th className="p-4">Contact</th><th className="p-4">Service</th><th className="p-4">Description</th><th className="p-4">Budget / Timeline</th><th className="p-4">Status</th></tr>
            </thead>
            <tbody>
              {piRows.map((r) => (
                <tr key={r.id} className="border-b border-sky/10 align-top">
                  <td className="whitespace-nowrap p-4 text-slate-400">{fmt(r.createdAt)}</td>
                  <td className="p-4">
                    <p className="font-medium text-white">{r.fullName}</p>
                    <a className="text-sky underline underline-offset-4" href={`mailto:${r.email}`}>{r.email}</a>
                    {r.phone && <p>{r.phone}</p>}
                    {r.company && <p className="text-slate-400">{r.company}</p>}
                  </td>
                  <td className="p-4">{r.service}</td>
                  <td className="max-w-md whitespace-pre-wrap break-words p-4 text-slate-300">{r.description}</td>
                  <td className="p-4 text-slate-300">{r.budget ?? "—"}<br />{r.timeline ?? "—"}</td>
                  <td className="p-4"><StatusSelect type="inquiry" id={r.id} value={r.status} options={PI_STATUSES} /></td>
                </tr>
              ))}
              {piRows.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-slate-400">No inquiries match.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
      <p className="mt-3 text-xs text-slate-500">Showing up to {LIMIT} most recent matching records. CSV export includes everything.</p>
    </div>
  );
}
