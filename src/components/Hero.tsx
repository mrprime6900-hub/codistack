"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "./Icons";

const EASE = [0.2, 0.7, 0.2, 1] as const;

const TELEMETRY_NODES = [
  {
    id: "01",
    name: "CLOUDFLARE EDGE",
    metric: "< 25ms TTFB",
    status: "ACTIVE",
    pos: "top-4 left-4 sm:top-8 sm:left-6",
    accent: "border-sky/40 text-sky bg-sky/10",
  },
  {
    id: "02",
    name: "D1 DISTRIBUTED SQL",
    metric: "0ms Cold Starts",
    status: "SYNCED",
    pos: "top-4 right-4 sm:top-8 sm:right-6",
    accent: "border-electric/40 text-electric bg-electric/10",
  },
  {
    id: "03",
    name: "BILLINGHACKS OS",
    metric: "Enterprise Core",
    status: "BETA READY",
    pos: "bottom-4 left-4 sm:bottom-8 sm:left-6",
    accent: "border-violet/40 text-violet bg-violet/10",
  },
  {
    id: "04",
    name: "ZERO-TRUST GATEWAY",
    metric: "HMAC & RLS",
    status: "ENFORCED",
    pos: "bottom-4 right-4 sm:bottom-8 sm:right-6",
    accent: "border-emerald-400/40 text-emerald-400 bg-emerald-400/10",
  },
];

function CyberArchitectureCanvas() {
  const reduce = useReducedMotion();
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const interval = setInterval(() => {
      setPulse((p) => (p + 1) % 4);
    }, 2500);
    return () => clearInterval(interval);
  }, [reduce]);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[500px]" aria-hidden="true">
      {/* Dynamic ambient radial bloom */}
      <div className="absolute left-1/2 top-1/2 size-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(21,159,255,0.28)_0%,rgba(177,140,255,0.18)_40%,transparent_70%)] blur-[70px]" />

      {/* Cyber Circuit Container */}
      <div className="absolute inset-0 rounded-[2.5rem] border border-sky/30 bg-gradient-to-br from-[#060b19]/90 via-[#081b38]/85 to-[#0b2452]/70 p-6 shadow-[0_0_60px_-15px_rgba(21,159,255,0.45),inset_0_0_35px_rgba(135,216,255,0.1)] backdrop-blur-xl">
        {/* Futuristic Grid Overlay */}
        <div className="tech-grid absolute inset-0 rounded-[2.5rem] opacity-40" />

        {/* Orbit Rings */}
        <div className="absolute left-1/2 top-1/2 size-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky/20 border-dashed animate-[spin_45s_linear_infinite]" />
        <div className="absolute left-1/2 top-1/2 size-[54%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-electric/30 animate-[spin_25s_linear_infinite_reverse]" />

        {/* Central Core Sphere */}
        <motion.div
          className="absolute left-1/2 top-1/2 flex size-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-sky/60 bg-gradient-to-b from-sky/20 to-electric/40 text-center shadow-[0_0_35px_rgba(21,159,255,0.8),inset_0_0_20px_rgba(255,255,255,0.3)] backdrop-blur-md"
          animate={reduce ? undefined : { scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="font-mono text-[0.62rem] font-bold uppercase tracking-widest text-sky">CORE ENGINE</span>
          <span className="font-display text-sm font-extrabold uppercase tracking-tight text-white">CODISTACK</span>
          <span className="mt-1 inline-flex items-center gap-1 font-mono text-[0.55rem] text-emerald-300">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
            OPERATIONAL
          </span>
        </motion.div>

        {/* 4 Telemetry Nodes */}
        {TELEMETRY_NODES.map((node, i) => (
          <motion.div
            key={node.id}
            className={`absolute ${node.pos} max-w-[130px] rounded-xl border p-2.5 backdrop-blur-md transition-all sm:max-w-[155px] ${
              pulse === i ? "border-sky bg-sky/20 shadow-[0_0_20px_rgba(21,159,255,0.5)]" : "border-sky/20 bg-base/80"
            }`}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[0.55rem] text-slate-400">{node.id} // SYS</span>
              <span className={`rounded-full px-1.5 py-0.5 font-mono text-[0.52rem] font-bold ${node.accent}`}>
                {node.status}
              </span>
            </div>
            <p className="mt-1.5 font-display text-xs font-bold leading-tight text-white">{node.name}</p>
            <p className="mt-0.5 font-mono text-[0.6rem] text-sky">{node.metric}</p>
          </motion.div>
        ))}

        {/* Live scanning bar across the canvas */}
        <motion.div
          className="absolute inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-sky to-transparent"
          animate={reduce ? undefined : { top: ["15%", "85%", "15%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pb-16 pt-32 sm:pb-24 sm:pt-40 lg:pb-32"
    >
      {/* Ambient background atmosphere */}
      <div
        className="absolute inset-0 -z-20 bg-[radial-gradient(1100px_600px_at_50%_-10%,#0b2452_0%,#081b38_45%,#060b19_85%)]"
        aria-hidden="true"
      />
      <div
        className="tech-grid absolute inset-0 -z-10 opacity-30"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-36 bg-gradient-to-t from-base to-transparent"
        aria-hidden="true"
      />

      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Headline & Value Proposition */}
          <div className="lg:col-span-7">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <div className="inline-flex items-center gap-2.5 rounded-full border border-sky/30 bg-sky/10 px-3.5 py-1.5 backdrop-blur-md">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-electric opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-sky" />
                </span>
                <span className="font-mono text-xs font-semibold tracking-wider text-sky uppercase">
                  ENTERPRISE ARCHITECTURE // INDIA & GLOBAL
                </span>
              </div>
            </motion.div>

            <motion.h1
              id="hero-title"
              className="mt-6 font-display text-[clamp(2.5rem,7vw,5.2rem)] font-extrabold uppercase leading-[0.98] tracking-[-0.03em] text-white"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            >
              Engineering <br />
              <span className="bg-gradient-to-r from-sky via-electric to-violet bg-clip-text text-transparent">
                What&apos;s Next.
              </span>
            </motion.h1>

            <motion.p
              className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg sm:leading-relaxed"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            >
              Codistack builds enterprise-grade SaaS platforms, ultra-fast web and mobile apps, and distributed custom software systems designed for zero-downtime scale — alongside{" "}
              <span className="font-semibold text-white">BILLINGHACKS Business OS</span>, our flagship proprietary platform.
            </motion.p>

            {/* High-conversion CTA Action Group */}
            <motion.div
              className="mt-9 flex flex-wrap items-center gap-4"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
            >
              <Link
                href="/#contact"
                className="btn btn-primary group relative inline-flex items-center gap-2 !px-7 !py-3.5 text-base shadow-[0_0_30px_-5px_rgba(21,159,255,0.7)]"
              >
                <span>Request Consultation</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/early-access"
                className="btn btn-secondary inline-flex items-center gap-2 !px-6 !py-3.5 text-base border-sky/30 hover:border-sky/60"
              >
                <span>Join BILLINGHACKS Waitlist</span>
                <span className="rounded-full bg-violet/20 px-2 py-0.5 font-mono text-[0.65rem] font-bold text-violet">
                  BETA
                </span>
              </Link>
            </motion.div>

            {/* Technical Capability Badges */}
            <motion.div
              className="mt-12 grid grid-cols-2 gap-4 border-t border-sky/15 pt-7 sm:grid-cols-4 sm:gap-6"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.6 }}
            >
              <div>
                <p className="font-display text-2xl font-black text-white sm:text-3xl">99.99%</p>
                <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-wider text-slate-400">Target Uptime</p>
              </div>
              <div>
                <p className="font-display text-2xl font-black text-white sm:text-3xl">&lt; 30ms</p>
                <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-wider text-slate-400">Global Edge TTFB</p>
              </div>
              <div>
                <p className="font-display text-2xl font-black text-white sm:text-3xl">Zero-Trust</p>
                <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-wider text-slate-400">Security Architecture</p>
              </div>
              <div>
                <p className="font-display text-2xl font-black text-white sm:text-3xl">Multi-Tenant</p>
                <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-wider text-slate-400">SaaS Ready</p>
              </div>
            </motion.div>
          </div>

          {/* Redesigned Cyber Architecture Canvas */}
          <div className="lg:col-span-5">
            <CyberArchitectureCanvas />
          </div>
        </div>
      </div>
    </section>
  );
}
