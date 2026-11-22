import type { Metadata } from "next";
import { Reveal, SplitHeading } from "@/components/Motion";
import { EarlyAccessForm } from "@/components/forms/EarlyAccessForm";
import { CheckIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "BILLINGHACKS Early Access — Beta Waiting List",
  description:
    "Join the BILLINGHACKS Business OS beta waiting list. Free to join, no payment, no guaranteed access. BILLINGHACKS is a retail business management product by Codistack, currently in development.",
  alternates: { canonical: "/early-access" },
};

const TERMS = [
  "This registration is for the BILLINGHACKS beta waiting list.",
  "Joining does not guarantee immediate access.",
  "Joining does not create a paid subscription, and no payment is taken.",
  "You may be contacted about beta availability.",
];

export default function EarlyAccessPage() {
  return (
    <section className="relative isolate overflow-hidden pb-24 pt-36 sm:pt-40">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(900px_500px_at_80%_10%,rgba(21,159,255,0.2),transparent_60%),radial-gradient(700px_500px_at_0%_60%,rgba(11,36,82,0.9),transparent_70%),#060b19]" />
      <div className="tech-grid absolute inset-0 -z-10 opacity-50" aria-hidden />
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-sky/25 bg-sky/5 px-3.5 py-1.5 font-mono text-[0.68rem] uppercase tracking-widest text-sky">
              <span className="size-1.5 animate-pulse-dot rounded-full bg-electric" /> BILLINGHACKS · in development
            </p>
          </Reveal>
          <SplitHeading
            as="h1"
            immediate
            text="Be among the first to experience BILLINGHACKS."
            className="mt-6 text-[clamp(2.1rem,5.6vw,3.6rem)] font-bold uppercase text-white"
          />
          <Reveal delay={0.2}>
            <p className="mt-6 text-lg leading-relaxed text-slate-300">
              BILLINGHACKS Business OS is Codistack&apos;s first product: retail billing, inventory, customer credit,
              staff management, and business insights in one place. It&apos;s still being built, and the beta waiting
              list is how we&apos;ll find the businesses to try it first.
            </p>
            <ul className="mt-8 space-y-3">
              {TERMS.map((t) => (
                <li key={t} className="flex gap-3 text-slate-200">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-sky/40 bg-electric/15 text-sky"><CheckIcon className="size-3.5" /></span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <div className="lg:col-span-7">
          <Reveal delay={0.1}><EarlyAccessForm /></Reveal>
        </div>
      </div>
    </section>
  );
}
