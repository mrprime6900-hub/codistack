"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal, SplitHeading } from "../Motion";
import { ArrowRight } from "../Icons";
import { PLANNED_PRICING, PRODUCT_CAPABILITIES } from "@/lib/site";

const TABS = ["POS", "Inventory", "Khata", "Reports"] as const;
type Tab = (typeof TABS)[number];

/** Abstract skeleton rows: deliberately contain no invented data or screenshots. */
function Skel({ w, className = "" }: { w: string; className?: string }) {
  return <span className={`block h-2 rounded-full bg-sky/20 ${className}`} style={{ width: w }} />;
}

function Panel({ tab }: { tab: Tab }) {
  if (tab === "POS") {
    return (
      <div className="grid gap-3 sm:grid-cols-5">
        <div className="space-y-2.5 sm:col-span-3">
          {[72, 58, 84, 46].map((w, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-sky/10 bg-white/[0.03] p-3">
              <div className="flex items-center gap-3">
                <span className="size-8 rounded-lg bg-electric/20" />
                <div className="space-y-1.5"><Skel w={`${w}px`} /><Skel w="34px" className="bg-sky/10" /></div>
              </div>
              <span className="font-mono text-xs text-sky/60">₹ ——</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-between rounded-xl border border-sky/20 bg-gradient-to-b from-electric/15 to-transparent p-4 sm:col-span-2">
          <div className="space-y-2"><p className="label-mono !text-[0.6rem]">Bill total</p><p className="font-display text-2xl text-white">₹ ——</p></div>
          <span className="mt-4 grid h-10 place-items-center rounded-lg bg-gradient-to-r from-sky to-electric font-display text-sm font-semibold text-base">Generate invoice</span>
        </div>
      </div>
    );
  }
  if (tab === "Inventory") {
    return (
      <div className="space-y-3">
        {[85, 52, 68, 24, 40].map((v, i) => (
          <div key={i} className="grid grid-cols-[5rem_1fr] items-center gap-4 sm:grid-cols-[8rem_1fr]">
            <Skel w="100%" />
            <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div className={`h-full rounded-full ${v < 30 ? "bg-violet" : "bg-gradient-to-r from-electric to-sky"}`} initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 0.9, delay: i * 0.08 }} />
            </div>
          </div>
        ))}
        <p className="pt-1 font-mono text-[0.65rem] tracking-wide text-slate-400">Stock-level concept: low stock is highlighted.</p>
      </div>
    );
  }
  if (tab === "Khata") {
    return (
      <div className="space-y-2.5">
        {[64, 80, 52, 70].map((w, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl border border-sky/10 bg-white/[0.03] p-3">
            <div className="flex items-center gap-3">
              <span className="size-9 rounded-full bg-gradient-to-br from-sky/40 to-electric/30" />
              <div className="space-y-1.5"><Skel w={`${w}px`} /><Skel w="48px" className="bg-sky/10" /></div>
            </div>
            <span className="rounded-full border border-sky/25 px-2.5 py-0.5 font-mono text-[0.62rem] text-sky/80">credit due</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div>
      <div className="flex h-36 items-end gap-2 sm:gap-3">
        {[38, 55, 42, 70, 60, 88, 74].map((h, i) => (
          <motion.div key={i} className="flex-1 rounded-t-lg bg-gradient-to-t from-electric/30 to-sky/80" initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 0.8, delay: i * 0.07, ease: [0.2, 0.7, 0.2, 1] }} />
        ))}
      </div>
      <div className="mt-3 flex justify-between">{Array.from({ length: 7 }).map((_, i) => (<Skel key={i} w="14%" className="!h-1.5 bg-sky/10" />))}</div>
    </div>
  );
}

function Console() {
  const [tab, setTab] = useState<Tab>("POS");
  const onKey = (e: React.KeyboardEvent) => {
    const i = TABS.indexOf(tab);
    if (e.key === "ArrowRight") setTab(TABS[(i + 1) % TABS.length]!);
    if (e.key === "ArrowLeft") setTab(TABS[(i - 1 + TABS.length) % TABS.length]!);
  };
  return (
    <div className="glass edge-glow overflow-hidden rounded-3xl">
      <div className="flex items-center justify-between border-b border-sky/15 bg-base/50 px-4 py-3">
        <div className="flex items-center gap-1.5" aria-hidden><span className="size-2.5 rounded-full bg-sky/40" /><span className="size-2.5 rounded-full bg-sky/25" /><span className="size-2.5 rounded-full bg-sky/15" /></div>
        <p className="font-mono text-[0.62rem] tracking-[0.18em] text-sky/80">BILLINGHACKS · CONCEPT</p>
      </div>
      <div className="p-4 sm:p-6">
        <div role="tablist" aria-label="Conceptual BILLINGHACKS modules" className="no-scrollbar flex gap-1 overflow-x-auto rounded-xl bg-base/50 p-1" onKeyDown={onKey}>
          {TABS.map((t) => (
            <button
              key={t}
              role="tab"
              id={`tab-${t}`}
              aria-selected={tab === t}
              aria-controls="console-panel"
              tabIndex={tab === t ? 0 : -1}
              onClick={() => setTab(t)}
              className={`min-h-10 flex-1 whitespace-nowrap rounded-lg px-3 font-display text-sm font-semibold transition-colors ${tab === t ? "bg-electric/25 text-white shadow-[inset_0_0_0_1px_rgba(135,216,255,0.4)]" : "text-slate-400 hover:text-white"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div id="console-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="mt-5 min-h-[15rem]">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <Panel tab={tab} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <p className="border-t border-sky/15 bg-base/50 px-5 py-3 text-xs text-slate-400">
        Conceptual interface visualization. Not a screenshot of a released product.
      </p>
    </div>
  );
}

export function Products() {
  return (
    <section id="products" className="relative isolate overflow-hidden section-y">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(1000px_600px_at_80%_20%,rgba(11,36,82,0.95),transparent_70%),radial-gradient(700px_400px_at_0%_100%,rgba(21,159,255,0.14),transparent_60%),#060b19]" />
      <div className="tech-grid absolute inset-0 -z-10 opacity-40" aria-hidden />
      <div className="divider-glow absolute inset-x-0 top-0" aria-hidden />

      <div className="container-x">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="label-mono">{"// 03 — Products"}</p>
              <p className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-full border border-sky/25 bg-sky/5 px-3.5 py-1.5 font-mono text-[0.68rem] uppercase tracking-widest text-sky">
                <span className="size-1.5 animate-pulse-dot rounded-full bg-electric" /> In development · Beta waiting list open
              </p>
            </Reveal>
            <SplitHeading text="Meet BILLINGHACKS." className="h-section mt-5 text-white" />
            <Reveal delay={0.15}>
              <p className="mt-4 font-display text-lg font-semibold text-sky">BILLINGHACKS Business OS: a product by Codistack.</p>
              <p className="mt-4 text-lg leading-relaxed text-slate-300">
                Codistack&apos;s first business operating system, designed to bring retail billing, inventory, customer
                credit, staff management, and business insights into one connected experience.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <h3 className="mt-9 font-mono text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Capabilities being built</h3>
              <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {PRODUCT_CAPABILITIES.map((c, i) => (
                  <li key={c.title} className="flex items-baseline gap-3 border-b border-sky/10 pb-3">
                    <span className="font-mono text-[0.65rem] text-sky/60">{String(i + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="block text-sm font-semibold text-white">{c.title}</span>
                      <span className="block text-xs text-slate-400">{c.note}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-slate-400">
                Some capabilities are still being completed or verified. Nothing here should be read as production-ready today.
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="glass mt-8 rounded-2xl p-5">
                <p className="label-mono !text-[0.66rem]">Planned BILLINGHACKS subscription pricing</p>
                <ul className="mt-3 grid grid-cols-3 gap-3">
                  {PLANNED_PRICING.map((p) => (
                    <li key={p.name} className="rounded-xl border border-sky/15 bg-base/40 p-3 text-center">
                      <p className="text-xs text-slate-400">{p.name}</p>
                      <p className="font-display text-xl font-bold text-white">{p.price}<span className="text-xs font-normal text-slate-400">/mo</span></p>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs leading-relaxed text-slate-400">
                  Intended prices for the BILLINGHACKS product, not Codistack service prices. Plans and tier features
                  are not finalised, and there is no checkout or subscription available yet.
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/early-access" className="btn btn-primary">Join the Waiting List <ArrowRight /></Link>
                <Link href="/#contact" className="btn btn-secondary">Ask a Question</Link>
              </div>
            </Reveal>
          </div>

          <div className="lg:sticky lg:top-28 lg:col-span-6">
            <Reveal delay={0.1}><Console /></Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
