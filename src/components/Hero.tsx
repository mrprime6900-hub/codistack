"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight } from "./Icons";

const EASE = [0.2, 0.7, 0.2, 1] as const;

const PLATES = [
  { z: 0, label: "01 / INFRASTRUCTURE", tone: "from-deep/70 to-midnight/80" },
  { z: 46, label: "02 / DATA", tone: "from-deep/60 to-midnight/70" },
  { z: 92, label: "03 / LOGIC", tone: "from-electric/20 to-deep/60" },
  { z: 138, label: "04 / INTERFACE", tone: "from-sky/30 to-electric/25" },
];

function GlassStack() {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 80, damping: 18 });
  const sy = useSpring(ry, { stiffness: 80, damping: 18 });

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      ry.set(nx * 14);
      rx.set(-ny * 10);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, rx, ry]);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px] [perspective:1300px]" aria-hidden>
      {/* ambient bloom */}
      <div className="absolute left-1/2 top-1/2 size-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/25 blur-[90px]" />

      <motion.div className="absolute inset-0 [transform-style:preserve-3d]" style={{ rotateX: sx, rotateY: sy }}>
        <div className="absolute inset-0 [transform-style:preserve-3d] [transform:rotateX(62deg)_rotateZ(-40deg)_translateZ(-70px)]">
          {PLATES.map((p, i) => (
            <motion.div
              key={p.label}
              className="absolute left-[12%] top-[12%] h-[76%] w-[76%] [transform-style:preserve-3d]"
              initial={reduce ? false : { z: p.z - 140, opacity: 0 }}
              animate={reduce ? { z: p.z, opacity: 1 } : { z: [p.z, p.z + 12, p.z], opacity: 1 }}
              transition={{
                opacity: { duration: 0.9, delay: 0.5 + i * 0.12 },
                z: reduce
                  ? undefined
                  : { duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: 1.2 + i * 0.3 },
              }}
            >
              <div
                className={`absolute inset-0 rounded-[1.4rem] border border-sky/35 bg-gradient-to-br ${p.tone} shadow-[0_0_40px_-8px_rgba(21,159,255,0.55),inset_0_0_30px_rgba(135,216,255,0.12)]`}
              >
                <div className="tech-grid absolute inset-0 rounded-[1.4rem] opacity-70" />
                <span className="absolute left-4 top-3 font-mono text-[0.6rem] tracking-[0.2em] text-sky/90">{p.label}</span>
                <span className="absolute bottom-3 right-4 size-2 rounded-full bg-electric shadow-[0_0_14px_var(--color-electric)]" />
                {i === PLATES.length - 1 && (
                  <>
                    <div className="absolute left-1/2 top-1/2 size-[34%] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-sky/60 bg-gradient-to-br from-sky/40 to-electric/30 shadow-[0_0_50px_rgba(21,159,255,0.8)]" />
                    <div className="absolute left-1/2 top-1/2 size-[56%] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-dashed border-sky/40" />
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* floating HUD chips (flat layer for legibility) */}
      <motion.div
        className="glass absolute -left-1 top-[14%] hidden rounded-xl px-3 py-2 sm:block"
        initial={reduce ? false : { opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.1, duration: 0.8, ease: EASE }}
      >
        <p className="label-mono !text-[0.62rem]">Client work</p>
        <p className="text-xs font-medium text-white">Open for project inquiries</p>
      </motion.div>
      <motion.div
        className="glass absolute -right-1 bottom-[20%] hidden rounded-xl px-3 py-2 sm:block"
        initial={reduce ? false : { opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.3, duration: 0.8, ease: EASE }}
      >
        <p className="label-mono !text-[0.62rem]">Flagship product</p>
        <p className="flex items-center gap-2 text-xs font-medium text-white">
          <span className="size-1.5 animate-pulse-dot rounded-full bg-electric" /> BILLINGHACKS · in development
        </p>
      </motion.div>
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const gridY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const stackY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0.2]);

  return (
    <section id="home" ref={ref} className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-16 pt-32 sm:pt-36">
      {/* atmosphere */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(1100px_600px_at_75%_30%,rgba(11,36,82,0.95),transparent_70%),radial-gradient(900px_500px_at_10%_0%,rgba(21,159,255,0.18),transparent_60%),linear-gradient(180deg,#060b19,#081b38_70%,#060b19)]" />
      <div className="tech-grid absolute inset-0 -z-10 opacity-60" />
      <motion.div className="absolute inset-0 -z-10" style={{ y: gridY }}>
        <div className="cyber-grid-floor" />
      </motion.div>
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="light-trail top-[22%] [animation-delay:0s]" />
        <div className="light-trail top-[41%] w-[26%] [animation-delay:2.6s]" />
        <div className="light-trail top-[63%] w-[32%] [animation-delay:4.8s]" />
        <div className="scan-line" />
      </div>
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-base to-transparent" />

      <motion.div className="container-x grid items-center gap-10 lg:grid-cols-12 lg:gap-6" style={{ opacity: fade }}>
        <div className="lg:col-span-7">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="glass inline-flex max-w-full items-center gap-2.5 rounded-full px-4 py-2"
          >
            <span className="size-2 shrink-0 animate-pulse-dot rounded-full bg-electric" />
            <span className="label-mono !text-[0.66rem] sm:!text-[0.72rem]">Software · SaaS · AI — built in India</span>
          </motion.p>

          <h1 className="glitch-once mt-7 text-[clamp(2.6rem,9vw,6.1rem)] font-bold uppercase leading-[0.95]" aria-label="Engineering what's next.">
            {[
              { words: ["Engineering"], cls: "text-white" },
              { words: ["what's", "next."], cls: "" },
            ].map((line, li) => (
              <span key={li} className="block" aria-hidden>
                {line.words.map((w, wi) => (
                  <span key={w} className="mr-[0.22em] inline-block overflow-hidden pb-[0.1em] align-bottom">
                    <motion.span
                      className={`inline-block ${li === 1 && wi === 1 ? "chrome drop-shadow-[0_0_28px_rgba(21,159,255,0.55)]" : line.cls}`}
                      initial={reduce ? false : { y: "110%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.9, delay: 0.25 + li * 0.15 + wi * 0.1, ease: EASE }}
                    >
                      {w}
                    </motion.span>
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: EASE }}
            className="mt-7 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg"
          >
            We build powerful software products, intelligent digital systems, and modern technology solutions for
            businesses ready to move forward.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: EASE }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link href="/early-access" className="btn btn-primary">
              Join Early Access <ArrowRight />
            </Link>
            <Link href="/#contact" className="btn btn-secondary">
              Start a Project
            </Link>
          </motion.div>

          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="mt-6 font-mono text-[0.7rem] leading-relaxed tracking-wide text-slate-400"
          >
            Early Access = BILLINGHACKS beta waiting list. Free to join, no payment, no guaranteed access.
          </motion.p>
        </div>

        <motion.div className="lg:col-span-5" style={{ y: stackY }}>
          <GlassStack />
        </motion.div>
      </motion.div>
    </section>
  );
}
