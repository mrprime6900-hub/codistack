import Link from "next/link";
import { Reveal } from "../Motion";
import { ArrowRight } from "../Icons";

export function EarlyAccessBand() {
  return (
    <section aria-labelledby="ea-band-title" className="relative isolate overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-deep via-midnight to-deep" />
      <div className="tech-grid absolute inset-0 -z-10 opacity-60" aria-hidden />
      <div className="divider-glow absolute inset-x-0 top-0" aria-hidden />
      <div className="divider-glow absolute inset-x-0 bottom-0" aria-hidden />
      <div className="container-x">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="label-mono">BILLINGHACKS beta waiting list</p>
              <h2 id="ea-band-title" className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                Run a shop or retail business? Get in line for the beta.
              </h2>
              <p className="mt-3 text-slate-300">
                Free to join. No payment, no subscription, and no guarantee of immediate access. We&apos;ll reach out when beta spots open.
              </p>
            </div>
            <Link href="/early-access" className="btn btn-primary shrink-0">Join Early Access <ArrowRight /></Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
