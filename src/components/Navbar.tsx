"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import type { Brand } from "@/lib/brand";
import { NAV_ITEMS } from "@/lib/site";
import { Logo } from "./Logo";

const SPY_IDS = ["home", "about", "services", "products", "contact"];

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-electric via-sky to-violet"
      style={{ scaleX }}
    />
  );
}

export function Navbar({ brand }: { brand: Brand }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const [spy, setSpy] = useState("home");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const onHome = pathname === "/";
  const activeId = pathname.startsWith("/early-access") ? "early-access" : onHome ? spy : "";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!onHome) return;
    const els = SPY_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setSpy(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.1, 0.5] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [onHome]);

  const close = useCallback((returnFocus = false) => {
    setOpenPath(null);
    if (returnFocus) buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
      if (e.key === "Tab" && panelRef.current) {
        const focusables = [buttonRef.current, ...Array.from(panelRef.current.querySelectorAll<HTMLElement>("a,button"))].filter(Boolean) as HTMLElement[];
        const first = focusables[0]!;
        const last = focusables[focusables.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !buttonRef.current?.contains(t)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open, close]);

  return (
    <>
      <ScrollProgress />
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-5 sm:pt-4">
        <motion.nav
          aria-label="Primary"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
          className={`glass relative flex w-full max-w-6xl items-center justify-between gap-3 rounded-2xl px-3 transition-[padding,background,box-shadow] duration-300 sm:px-4 ${
            scrolled ? "py-2 !bg-base/70 shadow-[0_18px_50px_-18px_rgba(0,0,0,0.8)]" : "py-3"
          }`}
        >
          <Link href="/#home" aria-label="Codistack home" className="shrink-0 rounded-lg" onClick={() => close()}>
            <Logo brand={brand} height={scrolled ? 28 : 32} priority />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => {
              const active = activeId === item.id;
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative block rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                      active ? "text-white" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {item.label}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-electric to-sky shadow-[0_0_10px_var(--color-electric)]"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <Link href="/early-access" className="btn btn-primary !min-h-10 !px-4 !py-2 !text-sm max-sm:hidden">
              Join Early Access
            </Link>
            <button
              ref={buttonRef}
              type="button"
              className="grid size-11 place-items-center rounded-xl border border-sky/25 bg-white/5 text-white lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpenPath(open ? null : pathname)}
            >
              <span className="relative block h-3.5 w-5" aria-hidden>
                <span className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 top-1.5 h-0.5 w-5 rounded bg-current transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`} />
                <span className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                id="mobile-menu"
                ref={panelRef}
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.22 }}
                className="glass glass-strong absolute inset-x-0 top-[calc(100%+0.5rem)] rounded-2xl p-3 lg:hidden"
              >
                <ul className="flex flex-col">
                  {NAV_ITEMS.map((item) => {
                    const active = activeId === item.id;
                    return (
                      <li key={item.id}>
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          onClick={() => close()}
                          className={`flex min-h-12 items-center justify-between rounded-xl px-4 text-base font-medium ${
                            active ? "bg-electric/15 text-white" : "text-slate-200 hover:bg-white/5"
                          }`}
                        >
                          {item.label}
                          {active && <span className="size-2 rounded-full bg-electric shadow-[0_0_10px_var(--color-electric)]" />}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <Link href="/early-access" onClick={() => close()} className="btn btn-primary mt-3 w-full">
                  Join Early Access
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </header>
    </>
  );
}
