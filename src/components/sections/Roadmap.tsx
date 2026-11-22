"use client";

import { motion } from "motion/react";
import { Reveal, SplitHeading } from "../Motion";
import { ROADMAP } from "@/lib/site";

export function Roadmap() {
  return (
    <section id="future" className="relative isolate overflow-hidden section-y">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(800px_400px_at_85%_100%,rgba(177,140,255,0.10),transparent_60%),radial-gradient(900px_500px_at_10%_0%,rgba(21,159,255,0.12),transparent_60%),#060b19]" />
      <div className="container-x">
        <div className="max-w-3xl">
          <Reveal><p className="label-mono">{"// 04 — The future of Codistack"}</p></Reveal>
          <SplitHeading text="One stack at a time." className="h-section mt-5 text-white" />
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-2xl text-lg text-slate-300">
              A strategic path, not a launch calendar. These are stages we are working toward, with no promised
              dates, and only the first is underway today.
            </p>
          </Reveal>
        </div>

        <div className="relative mt-16">
          {/* connecting line (desktop) */}
          <div className="absolute left-0 right-0 top-[1.1rem] hidden h-px bg-sky/15 lg:block" aria-hidden>
            <motion.div
              className="h-full origin-left bg-gradient-to-r from-electric via-sky to-transparent shadow-[0_0_12px_var(--color-electric)]"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 0.62 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.8, ease: [0.2, 0.7, 0.2, 1] }}
            />
          </div>
          {/* connecting line (mobile) */}
          <div className="absolute bottom-2 left-[1.05rem] top-2 w-px bg-gradient-to-b from-electric/70 via-sky/20 to-transparent lg:hidden" aria-hidden />

          <ol className="grid gap-10 lg:grid-cols-4 lg:gap-6">
            {ROADMAP.map((r, i) => {
              const active = i < 2;
              return (
                <li key={r.n} className="relative pl-12 lg:pl-0 lg:pt-14">
                  <span
                    aria-hidden
                    className={`absolute left-0 top-0 grid size-9 place-items-center rounded-full border font-mono text-[0.65rem] lg:top-0 ${
                      active
                        ? "border-sky bg-electric/25 text-white shadow-[0_0_22px_rgba(21,159,255,0.7)]"
                        : "border-sky/30 bg-base text-sky/70"
                    }`}
                  >
                    {r.n}
                  </span>
                  <Reveal delay={i * 0.1}>
                    <div className={`glass rounded-2xl p-6 ${active ? "" : "opacity-90"}`}>
                      <p className="label-mono !text-[0.66rem]">Stage {r.n}</p>
                      <h3 className="mt-3 text-xl font-bold text-white sm:text-[1.35rem]">{r.title}</h3>
                      <p className="mt-2 inline-flex rounded-full border border-sky/25 bg-sky/5 px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-widest text-sky">
                        {r.state}
                      </p>
                      <p className="mt-4 text-sm leading-relaxed text-slate-300">{r.body}</p>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
