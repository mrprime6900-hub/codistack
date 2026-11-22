"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";
import { BUDGETS, SERVICES, TIMELINES, projectInquirySchema } from "@/lib/validation";
import { SITE } from "@/lib/site";
import { CheckIcon, MailIcon, WhatsAppIcon } from "../Icons";
import { Field, FormAlert, Honeypot, Spinner, describe, useSubmission } from "./shared";

const clientSchema = projectInquirySchema.omit({ website: true, formToken: true, submissionKey: true });

export function InquiryForm() {
  const { phase, message, result, fieldErrors, submit, clearField } = useSubmission(
    "/api/project-inquiry",
    clientSchema,
  );
  const [service, setService] = useState("");

  // Service cards link here with #contact?service=... via a custom event.
  useEffect(() => {
    const onPick = (e: Event) => {
      const v = (e as CustomEvent<string>).detail;
      if ((SERVICES as readonly string[]).includes(v)) setService(v);
    };
    window.addEventListener("codistack:select-service", onPick);
    return () => window.removeEventListener("codistack:select-service", onPick);
  }, []);

  if (phase === "success") {
    return (
      <div role="status" className="glass glass-strong rounded-3xl p-8 sm:p-10">
        <span className="grid size-14 place-items-center rounded-full border border-sky/50 bg-electric/15 text-sky shadow-[0_0_30px_rgba(21,159,255,0.5)]">
          <CheckIcon className="size-7" />
        </span>
        <h3 className="mt-5 text-2xl font-bold text-white">
          {result === "duplicate" ? "We already have this inquiry." : "Your inquiry has been received."}
        </h3>
        <p className="mt-3 max-w-md text-slate-300">
          {result === "duplicate"
            ? "An identical inquiry from this email address is already stored, so there's no need to send it again."
            : "It has been saved securely. We'll review the details and get in touch using the contact information you provided."}{" "}
          If it&apos;s time-sensitive, you can also reach us directly.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href={`mailto:${SITE.email}`} className="btn btn-secondary"><MailIcon className="size-4" /> Email us</a>
          <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-secondary"><WhatsAppIcon className="size-4" /> WhatsApp</a>
        </div>
      </div>
    );
  }

  const busy = phase === "submitting";

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const s = (k: string) => String(fd.get(k) ?? "");
    void submit(
      {
        fullName: s("fullName"),
        email: s("email"),
        phone: s("phone"),
        company: s("company"),
        service: s("service"),
        description: s("description"),
        budget: s("budget"),
        timeline: s("timeline"),
        website: s("website"),
      },
      form,
    );
  };

  return (
    <form id="inquiry-form" onSubmit={onSubmit} noValidate className="glass glass-strong relative rounded-3xl p-6 sm:p-8" aria-busy={busy}>
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="pi-name" label="Full name" required error={fieldErrors.fullName}>
          <input id="pi-name" name="fullName" type="text" autoComplete="name" maxLength={120} className="field-input" aria-required="true" aria-invalid={!!fieldErrors.fullName} aria-describedby={describe("pi-name", fieldErrors.fullName)} onChange={() => clearField("fullName")} disabled={busy} />
        </Field>
        <Field id="pi-email" label="Email address" required error={fieldErrors.email}>
          <input id="pi-email" name="email" type="email" autoComplete="email" inputMode="email" maxLength={254} className="field-input" aria-required="true" aria-invalid={!!fieldErrors.email} aria-describedby={describe("pi-email", fieldErrors.email)} onChange={() => clearField("email")} disabled={busy} />
        </Field>
        <Field id="pi-phone" label="Phone / WhatsApp" optional error={fieldErrors.phone}>
          <input id="pi-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={20} className="field-input" placeholder="+91 …" aria-invalid={!!fieldErrors.phone} aria-describedby={describe("pi-phone", fieldErrors.phone)} onChange={() => clearField("phone")} disabled={busy} />
        </Field>
        <Field id="pi-company" label="Company / business name" optional error={fieldErrors.company}>
          <input id="pi-company" name="company" type="text" autoComplete="organization" maxLength={150} className="field-input" aria-invalid={!!fieldErrors.company} aria-describedby={describe("pi-company", fieldErrors.company)} onChange={() => clearField("company")} disabled={busy} />
        </Field>
        <div className="sm:col-span-2">
          <Field id="pi-service" label="Service required" required error={fieldErrors.service}>
            <select id="pi-service" name="service" value={service} onChange={(e) => { setService(e.target.value); clearField("service"); }} className="field-input" aria-required="true" aria-invalid={!!fieldErrors.service} aria-describedby={describe("pi-service", fieldErrors.service)} disabled={busy}>
              <option value="">Select a service</option>
              {SERVICES.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field id="pi-desc" label="Project description" required error={fieldErrors.description} hint="What problem are you solving? Who will use it? Please don't include passwords or financial account details.">
            <textarea id="pi-desc" name="description" maxLength={4000} className="field-input" aria-required="true" aria-invalid={!!fieldErrors.description} aria-describedby={describe("pi-desc", fieldErrors.description, "hint")} onChange={() => clearField("description")} disabled={busy} />
          </Field>
        </div>
        <Field id="pi-budget" label="Estimated budget" optional error={fieldErrors.budget}>
          <select id="pi-budget" name="budget" defaultValue="" className="field-input" aria-invalid={!!fieldErrors.budget} onChange={() => clearField("budget")} disabled={busy}>
            <option value="">Select a range</option>
            {BUDGETS.map((b) => (<option key={b} value={b}>{b}</option>))}
          </select>
        </Field>
        <Field id="pi-timeline" label="Preferred timeline" optional error={fieldErrors.timeline}>
          <select id="pi-timeline" name="timeline" defaultValue="" className="field-input" aria-invalid={!!fieldErrors.timeline} onChange={() => clearField("timeline")} disabled={busy}>
            <option value="">Select a timeline</option>
            {TIMELINES.map((t) => (<option key={t} value={t}>{t}</option>))}
          </select>
        </Field>
      </div>

      <div className="mt-6 space-y-4">
        <FormAlert message={phase === "error" ? message : null} />
        <button type="submit" className="btn btn-primary w-full" disabled={busy}>
          {busy ? (<><Spinner /> Sending securely…</>) : "Send project inquiry"}
        </button>
        <p className="text-center text-xs text-slate-400">
          Separate from the BILLINGHACKS waiting list. Details are used only to respond to your inquiry; see the{" "}
          <Link href="/privacy" className="text-sky underline underline-offset-4">Privacy Policy</Link>.
        </p>
      </div>
    </form>
  );
}
