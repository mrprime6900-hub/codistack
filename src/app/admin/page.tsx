"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { LogoutButton } from "./LogoutButton";

type LeadRecord = {
  id: string;
  full_name?: string;
  fullName?: string;
  email: string;
  phone?: string | null;
  business_name?: string | null;
  businessName?: string | null;
  business_category?: string | null;
  businessCategory?: string | null;
  company?: string | null;
  service?: string | null;
  description?: string | null;
  budget?: string | null;
  timeline?: string | null;
  status: string;
  created_at?: string;
  createdAt?: string;
  admin_notes?: string | null;
};

const EA_STATUSES = ["new", "waiting", "contacted", "invited", "declined"] as const;
const PI_STATUSES = ["new", "in_review", "contacted", "won", "closed", "spam"] as const;

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<"early-access" | "inquiries">("early-access");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [earlyAccess, setEarlyAccess] = useState<LeadRecord[]>([]);
  const [inquiries, setInquiries] = useState<LeadRecord[]>([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/leads");
        if (res.status === 401) {
          window.location.href = "/admin/login";
          return;
        }
        const data = await res.json();
        if (data.ok) {
          setAdminEmail(data.adminEmail || "admin@codistack.com");
          setEarlyAccess(data.earlyAccess || []);
          setInquiries(data.inquiries || []);
        } else {
          setError(data.message || "Failed to load records.");
        }
      } catch (err: any) {
        setError("Network error while connecting to Cloudflare API.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const updateStatus = async (type: "early-access" | "inquiry", id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id, status: newStatus }),
      });
      if (res.ok) {
        if (type === "early-access") {
          setEarlyAccess((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
          );
        } else {
          setInquiries((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
          );
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const filteredEa = useMemo(() => {
    return earlyAccess.filter((r) => {
      const name = (r.full_name || r.fullName || "").toLowerCase();
      const em = (r.email || "").toLowerCase();
      const bName = (r.business_name || r.businessName || "").toLowerCase();
      const matchesSearch =
        !search ||
        name.includes(search.toLowerCase()) ||
        em.includes(search.toLowerCase()) ||
        bName.includes(search.toLowerCase());
      const matchesStatus = !statusFilter || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [earlyAccess, search, statusFilter]);

  const filteredPi = useMemo(() => {
    return inquiries.filter((r) => {
      const name = (r.full_name || r.fullName || "").toLowerCase();
      const em = (r.email || "").toLowerCase();
      const comp = (r.company || "").toLowerCase();
      const serv = (r.service || "").toLowerCase();
      const matchesSearch =
        !search ||
        name.includes(search.toLowerCase()) ||
        em.includes(search.toLowerCase()) ||
        comp.includes(search.toLowerCase()) ||
        serv.includes(search.toLowerCase());
      const matchesStatus = !statusFilter || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [inquiries, search, statusFilter]);

  const currentList = tab === "early-access" ? filteredEa : filteredPi;
  const currentStatuses = tab === "early-access" ? EA_STATUSES : PI_STATUSES;

  return (
    <div className="container-x pb-24 pt-8">
      {/* Header bar */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-sky/15 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-sky/30 bg-sky/10 px-3 py-1 font-mono text-[0.65rem] text-sky uppercase">
            <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
            LIVE EDGE DATABASE · CLOUDFLARE D1
          </div>
          <h1 className="mt-2 font-display text-3xl font-extrabold uppercase text-white sm:text-4xl">
            Lead Management Console
          </h1>
          {adminEmail && (
            <p className="mt-1 font-mono text-xs text-slate-400">
              Authenticated as: <span className="text-sky">{adminEmail}</span>
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            className="btn btn-secondary !min-h-10 !px-4 !py-2 !text-sm border-sky/30"
            href={`/api/admin/export?type=${tab === "early-access" ? "early-access" : "inquiry"}`}
            download
          >
            Export {tab === "early-access" ? "Waitlist" : "Inquiries"} CSV
          </a>
          <LogoutButton />
        </div>
      </div>

      {/* Metric Cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="glass rounded-2xl p-4 border border-sky/20">
          <p className="font-mono text-[0.68rem] text-slate-400 uppercase">Waitlist Total</p>
          <p className="mt-2 font-display text-3xl font-bold text-white">{earlyAccess.length}</p>
        </div>
        <div className="glass rounded-2xl p-4 border border-electric/20">
          <p className="font-mono text-[0.68rem] text-slate-400 uppercase">Inquiries Total</p>
          <p className="mt-2 font-display text-3xl font-bold text-electric">{inquiries.length}</p>
        </div>
        <div className="glass rounded-2xl p-4 border border-amber-400/20">
          <p className="font-mono text-[0.68rem] text-slate-400 uppercase">Pending Review</p>
          <p className="mt-2 font-display text-3xl font-bold text-amber-400">
            {inquiries.filter((i) => i.status === "new" || i.status === "in_review").length}
          </p>
        </div>
        <div className="glass rounded-2xl p-4 border border-emerald-400/20">
          <p className="font-mono text-[0.68rem] text-slate-400 uppercase">Converted / Won</p>
          <p className="mt-2 font-display text-3xl font-bold text-emerald-400">
            {inquiries.filter((i) => i.status === "won" || i.status === "contacted").length}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex flex-wrap gap-2 rounded-xl bg-base/60 p-1.5 border border-sky/15 sm:w-fit">
        <button
          onClick={() => {
            setTab("early-access");
            setStatusFilter("");
          }}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
            tab === "early-access"
              ? "bg-electric/25 text-white shadow-[inset_0_0_0_1px_rgba(135,216,255,0.4)]"
              : "text-slate-400 hover:text-white"
          }`}
        >
          BILLINGHACKS Waitlist ({earlyAccess.length})
        </button>
        <button
          onClick={() => {
            setTab("inquiries");
            setStatusFilter("");
          }}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
            tab === "inquiries"
              ? "bg-electric/25 text-white shadow-[inset_0_0_0_1px_rgba(135,216,255,0.4)]"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Project Inquiries ({inquiries.length})
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, company, service…"
          className="field-input sm:max-w-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="field-input sm:max-w-[12rem]"
        >
          <option value="">All statuses</option>
          {currentStatuses.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ").toUpperCase()}
            </option>
          ))}
        </select>
        {(search || statusFilter) && (
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("");
            }}
            className="btn btn-secondary !min-h-12 !px-4 text-xs"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Data Table */}
      <div className="glass mt-6 overflow-x-auto rounded-2xl border border-sky/20">
        {loading ? (
          <div className="p-12 text-center">
            <span className="inline-block size-6 animate-spin rounded-full border-2 border-sky border-t-transparent" />
            <p className="mt-3 font-mono text-xs text-slate-400">Loading records from Cloudflare D1...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-300 font-mono text-sm">{error}</div>
        ) : currentList.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <p className="font-display text-lg text-white">No records found</p>
            <p className="mt-1 font-mono text-xs">
              {search || statusFilter ? "Try adjusting your search criteria." : "New submissions will appear here live."}
            </p>
          </div>
        ) : tab === "early-access" ? (
          <table className="w-full min-w-[56rem] text-left text-sm">
            <thead className="border-b border-sky/15 font-mono text-[0.68rem] uppercase tracking-widest text-sky">
              <tr>
                <th className="p-4">Registered Date</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Business</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentList.map((r) => (
                <tr key={r.id} className="border-b border-sky/10 align-top hover:bg-white/[0.02]">
                  <td className="p-4 font-mono text-xs text-slate-400">
                    {r.created_at || r.createdAt || "Recent"}
                  </td>
                  <td className="p-4 font-semibold text-white">{r.full_name || r.fullName}</td>
                  <td className="p-4 text-sky">
                    <a href={`mailto:${r.email}`} className="hover:underline">
                      {r.email}
                    </a>
                  </td>
                  <td className="p-4 font-mono text-xs text-slate-300">{r.phone || "—"}</td>
                  <td className="p-4 text-slate-200">{r.business_name || r.businessName || "—"}</td>
                  <td className="p-4 font-mono text-xs text-slate-400">{r.business_category || r.businessCategory || "—"}</td>
                  <td className="p-4">
                    <select
                      value={r.status}
                      onChange={(e) => updateStatus("early-access", r.id, e.target.value)}
                      className="rounded-lg border border-sky/30 bg-base px-2.5 py-1 font-mono text-xs text-white"
                    >
                      {EA_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full min-w-[62rem] text-left text-sm">
            <thead className="border-b border-sky/15 font-mono text-[0.68rem] uppercase tracking-widest text-sky">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Client</th>
                <th className="p-4">Service</th>
                <th className="p-4">Description</th>
                <th className="p-4">Budget / Timeline</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentList.map((r) => (
                <tr key={r.id} className="border-b border-sky/10 align-top hover:bg-white/[0.02]">
                  <td className="p-4 font-mono text-xs text-slate-400">
                    {r.created_at || r.createdAt || "Recent"}
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-white">{r.full_name || r.fullName}</p>
                    <a href={`mailto:${r.email}`} className="font-mono text-xs text-sky hover:underline">
                      {r.email}
                    </a>
                    {r.company && <p className="text-xs text-slate-400">{r.company}</p>}
                    {r.phone && <p className="font-mono text-xs text-slate-400">{r.phone}</p>}
                  </td>
                  <td className="p-4 font-mono text-xs text-sky/90">{r.service}</td>
                  <td className="p-4 max-w-sm text-xs leading-relaxed text-slate-300">
                    {r.description}
                  </td>
                  <td className="p-4 font-mono text-xs text-slate-400">
                    <p>{r.budget || "Budget: Flexible"}</p>
                    <p>{r.timeline || "Timeline: Standard"}</p>
                  </td>
                  <td className="p-4">
                    <select
                      value={r.status}
                      onChange={(e) => updateStatus("inquiry", r.id, e.target.value)}
                      className="rounded-lg border border-sky/30 bg-base px-2.5 py-1 font-mono text-xs text-white"
                    >
                      {PI_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace("_", " ").toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
