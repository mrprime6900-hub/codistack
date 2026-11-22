"use client";

import Link from "next/link";
import { Reveal, SplitHeading, trackPointer } from "../Motion";
import { ArrowRight, ServiceIcon } from "../Icons";
import { SERVICES_LIST } from "@/lib/site";

function pick(value: string) {
  window.dispatchEvent(new CustomEvent("codistack:select-service", { detail: value }));
}

export function Services() {
  return (
    <section id="services" className="relative isolate overflow-hidden section-y">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(900px_500px_at_15%_0%,rgba(21,159,255,0.12),transparent_60%),linear-gradient(180deg,#060b19,#081b38_55%,#060b19)]" />
      <div className="tech-grid absolute inset-0 -z-10 opacity-40" aria-hidden />

      <div className="container-x">
        <div className="max-w-3xl">
          <Reveal><p className="label-mono">{"// 02 — Services"}</p></Reveal>
          <SplitHeading text="Software built around your problem." className="h-section mt-5 text-white" />
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-2xl text-lg text-slate-300">
              Seven service categories, each open for paid project inquiries. Tell us what you&apos;re trying to
              solve, and we&apos;ll tell you honestly whether and how we can build it.
            </p>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES_LIST.map((s, i) => {
            const wide = i === SERVICES_LIST.length - 1;
            return (
              <li key={s.id} className={wide ? "sm:col-span-2 lg:col-span-3" : ""}>
                <Reveal delay={(i % 3) * 0.08} className="h-full">
                  <article
                    onPointerMove={trackPointer}
                    className={`glass glass-card flex h-full rounded-3xl p-6 sm:p-7 ${wide ? "flex-col gap-6 lg:flex-row lg:items-center lg:gap-10" : "flex-col"}`}
                  >
                    <div className={wide ? "lg:w-1/3" : ""}>
                      <div className="flex items-start justify-between">
                        <span className="grid size-14 place-items-center rounded-2xl border border-sky/30 bg-gradient-to-br from-electric/25 to-deep/60 text-sky shadow-[0_0_28px_-6px_rgba(21,159,255,0.7)]">
                          <ServiceIcon name={s.icon} className="size-7" />
                        </span>
                        <span className="font-mono text-xs tracking-[0.2em] text-sky/70">{s.index}</span>
                      </div>
                      <h3 className="mt-6 text-2xl font-bold text-white">{s.title}</h3>
                      <p className="mt-2 text-sm font-medium text-sky">{s.solves}</p>
                    </div>

                    <div className={`flex flex-1 flex-col ${wide ? "" : "mt-4"}`}>
                      <p className="leading-relaxed text-slate-300">{s.body}</p>
                      <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${s.title} focus areas`}>
                        {s.tags.map((t) => (
                          <li key={t} className="rounded-full border border-sky/20 bg-sky/5 px-3 py-1 font-mono text-[0.68rem] tracking-wide text-sky/90">{t}</li>
                        ))}
                      </ul>
                      <Link
                        href="/#contact"
                        onClick={() => pick(s.formValue)}
                        className="group mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-white"
                        aria-label={`Inquire about ${s.title}`}
                      >
                        <span className="border-b border-sky/40 pb-0.5 transition-colors group-hover:border-sky">Inquire about this</span>
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <Reveal className="mt-14">
          <div className="glass edge-glow flex flex-col items-start justify-between gap-6 rounded-3xl p-7 sm:p-9 md:flex-row md:items-center">
            <div>
              <h3 className="text-2xl font-bold text-white sm:text-3xl">Have a Project in Mind? Let&apos;s Build It.</h3>
              <p className="mt-2 max-w-xl text-slate-300">Share the goal, the users, and any constraints. A clear brief is enough to start the conversation.</p>
            </div>
            <Link href="/#contact" className="btn btn-primary shrink-0">Start a Project <ArrowRight /></Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
