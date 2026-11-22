"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal, SplitHeading } from "../Motion";
import { PlusIcon } from "../Icons";
import { FAQS } from "@/lib/site";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();

  return (
    <section id="faq" className="surface-light relative isolate overflow-hidden section-y">
      <div className="tech-grid-light absolute inset-0 -z-10" aria-hidden />
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Reveal><p className="label-mono">{"// 06 — FAQ"}</p></Reveal>
          <SplitHeading text="Straight answers." className="h-section mt-5 text-deep" />
          <Reveal delay={0.15}>
            <p className="mt-6 text-deep/75">Clear answers that match where Codistack and BILLINGHACKS actually stand today.</p>
          </Reveal>
        </div>

        <div className="lg:col-span-8">
          <ul className="space-y-3">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              const btnId = `${uid}-b${i}`;
              const panelId = `${uid}-p${i}`;
              return (
                <li key={f.q}>
                  <Reveal delay={i * 0.04} y={16}>
                    <div className={`glass-light rounded-2xl transition-shadow ${isOpen ? "shadow-[0_24px_60px_-28px_rgba(21,159,255,0.55)]" : ""}`}>
                      <h3 className="!text-base !leading-snug">
                        <button
                          id={btnId}
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() => setOpen(isOpen ? null : i)}
                          className="flex min-h-14 w-full items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left font-display text-base font-semibold text-deep sm:px-6 sm:text-lg"
                        >
                          <span>{f.q}</span>
                          <span className={`grid size-8 shrink-0 place-items-center rounded-full border border-deep/20 text-deep transition-transform duration-300 ${isOpen ? "rotate-45 bg-electric/15" : ""}`}>
                            <PlusIcon className="size-4" />
                          </span>
                        </button>
                      </h3>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={panelId}
                            role="region"
                            aria-labelledby={btnId}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="px-5 pb-6 leading-relaxed text-deep/80 sm:px-6">{f.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
