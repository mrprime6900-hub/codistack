import type { ReactNode } from "react";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden pb-24 pt-36 sm:pt-40">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(900px_500px_at_80%_0%,rgba(21,159,255,0.15),transparent_60%),#060b19]" />
      <div className="tech-grid absolute inset-0 -z-10 opacity-40" aria-hidden />
      <div className="container-x max-w-3xl">
        <p className="label-mono">Legal · Draft</p>
        <h1 className="mt-4 text-[clamp(2.2rem,6vw,3.6rem)] font-bold uppercase text-white">{title}</h1>
        <p className="mt-3 font-mono text-xs text-slate-400">Last updated: {updated}</p>
        <div
          role="note"
          className="mt-8 rounded-2xl border border-amber-300/40 bg-amber-300/10 p-5 text-sm leading-relaxed text-amber-100"
        >
          <strong>Draft notice:</strong> this document describes how the website actually works today but has not been
          reviewed by a lawyer. Operator details marked <strong>[TO BE CONFIRMED]</strong> must be completed before
          public launch.
        </div>
        <div className="prose-legal mt-4">{children}</div>
      </div>
    </section>
  );
}
