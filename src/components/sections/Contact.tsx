import { Reveal, SplitHeading } from "../Motion";
import { InquiryForm } from "../forms/InquiryForm";
import { MailIcon, WhatsAppIcon } from "../Icons";
import { SITE } from "@/lib/site";

export function Contact() {
  return (
    <section id="contact" className="relative isolate overflow-hidden section-y">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(900px_500px_at_0%_30%,rgba(21,159,255,0.14),transparent_60%),linear-gradient(180deg,#060b19,#081b38_60%,#060b19)]" />
      <div className="tech-grid absolute inset-0 -z-10 opacity-40" aria-hidden />
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Reveal><p className="label-mono">{"// 05 — Contact"}</p></Reveal>
          <SplitHeading text="Tell us what you need built." className="h-section mt-5 text-white" />
          <Reveal delay={0.15}>
            <p className="mt-6 text-lg text-slate-300">
              Use the project inquiry form, or reach out directly. This is for paid custom development; it is
              separate from the BILLINGHACKS waiting list.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <ul className="mt-9 space-y-4">
              <li>
                <a href={`mailto:${SITE.email}`} className="glass glass-card group flex items-center gap-4 rounded-2xl p-4 sm:p-5">
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-sky/30 bg-electric/15 text-sky"><MailIcon /></span>
                  <span className="min-w-0">
                    <span className="label-mono block !text-[0.62rem]">Email</span>
                    <span className="block break-all font-semibold text-white">{SITE.email}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="glass glass-card group flex items-center gap-4 rounded-2xl p-4 sm:p-5">
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-sky/30 bg-electric/15 text-sky"><WhatsAppIcon /></span>
                  <span className="min-w-0">
                    <span className="label-mono block !text-[0.62rem]">WhatsApp / Phone</span>
                    <span className="block font-semibold text-white">{SITE.phoneDisplay}</span>
                  </span>
                </a>
              </li>
            </ul>
            <p className="mt-6 text-sm text-slate-400">
              Please don&apos;t send passwords, banking details, or other sensitive credentials through any channel.
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal delay={0.1}><InquiryForm /></Reveal>
        </div>
      </div>
    </section>
  );
}
