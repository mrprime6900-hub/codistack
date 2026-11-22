"use client";

import { MotionConfig, motion, useReducedMotion } from "motion/react";
import type { ReactNode, PointerEvent } from "react";
import type { ElementType } from "react";

/** Wraps the app so every motion component honours prefers-reduced-motion. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

const EASE = [0.2, 0.7, 0.2, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Word-by-word masked headline reveal. Screen readers get the full text once. */
export function SplitHeading({
  text,
  as = "h2",
  className = "",
  delay = 0,
  immediate = false,
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  delay?: number;
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();
  const Tag = as as ElementType;
  const words = text.split(" ");
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: "110%", opacity: 0 }}
            {...(immediate
              ? { animate: { y: 0, opacity: 1 } }
              : { whileInView: { y: 0, opacity: 1 }, viewport: { once: true, margin: "-40px" } })}
            transition={{ duration: 0.75, delay: delay + i * 0.07, ease: EASE }}
          >
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Updates --mx/--my so .glass-card shows a pointer-tracked highlight. Mouse/pen only. */
export function trackPointer(e: PointerEvent<HTMLElement>) {
  if (e.pointerType === "touch") return;
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}
