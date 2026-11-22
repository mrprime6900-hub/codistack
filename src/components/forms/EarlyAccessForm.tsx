"use client";

import Link from "next/link";
import { type FormEvent } from "react";
import { BUSINESS_CATEGORIES, earlyAccessSchema } from "@/lib/validation";
import { CheckIcon } from "../Icons";
import { Field, FormAlert, Honeypot, Spinner, describe, useSubmission } from "./shared";

const clientSchema = earlyAccessSchema.omit({ website: true, formToken: true, submissionKey: true });

export function EarlyAccessForm() {
  const { phase, message, result, fieldErrors, submit, clearField } = useSubmission(
    "/api/early-access",
    clientSchema,
  );

  if (phase === "success") {
    const dup = result === "duplicate";
    return (
      <div role="status" className="glass glass-strong rounded-3xl p-8 text-center sm:p-10">
        <span className="mx-auto grid size-14 place-items-center rounded-full border border-sky/50 bg-electric/15 text-sky shadow-[0_0_30px_rgba(21,159,255,0.5)]">
          <CheckIcon className="size-7" />
        </span>
        <h3 className="mt-5 text-2xl font-bold text-white">
          {dup ? "You're already on the list." : "You're on the BILLINGHACKS waiting list."}
        </h3>
        <p className="mx-auto mt-3 max-w-md text-slate-300">
          {dup
            ? "This email address is already registered for the BILLINGHACKS beta waiting list, so there's nothing more to do."
            : "Your registration has been saved."}{" "}
          This is not a subscription and doesn&apos;t guarantee immediate access. We may contact you when beta access
          becomes available.
        </p>
        <Link href="/" className="btn btn-secondary mt-7">
          Back to Codistack
        </Link>
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
        businessName: s("businessName"),
        businessCategory: s("businessCategory"),
        consent: fd.get("consent") === "on",
        website: s("website"),
      },
      form,
    );
  };

  return (
    <form onSubmit={onSubmit} noValidate className="glass glass-strong relative rounded-3xl p-6 sm:p-9" aria-busy={busy}>
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field id="ea-name" label="Full name" required error={fieldErrors.fullName}>
            <input id="ea-name" name="fullName" type="text" autoComplete="name" maxLength={120} className="field-input" placeholder="Your full name" aria-required="true" aria-invalid={!!fieldErrors.fullName} aria-describedby={describe("ea-name", fieldErrors.fullName)} onChange={() => clearField("fullName")} disabled={busy} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field id="ea-email" label="Email address" required error={fieldErrors.email}>
            <input id="ea-email" name="email" type="email" autoComplete="email" inputMode="email" maxLength={254} className="field-input" placeholder="you@business.com" aria-required="true" aria-invalid={!!fieldErrors.email} aria-describedby={describe("ea-email", fieldErrors.email)} onChange={() => clearField("email")} disabled={busy} />
          </Field>
        </div>
        <Field id="ea-phone" label="Phone / WhatsApp" optional error={fieldErrors.phone}>
          <input id="ea-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={20} className="field-input" placeholder="+91 …" aria-invalid={!!fieldErrors.phone} aria-describedby={describe("ea-phone", fieldErrors.phone)} onChange={() => clearField("phone")} disabled={busy} />
        </Field>
        <Field id="ea-business" label="Business or shop name" optional error={fieldErrors.businessName}>
          <input id="ea-business" name="businessName" type="text" autoComplete="organization" maxLength={150} className="field-input" placeholder="Your shop or business" aria-invalid={!!fieldErrors.businessName} aria-describedby={describe("ea-business", fieldErrors.businessName)} onChange={() => clearField("businessName")} disabled={busy} />
        </Field>
        <div className="sm:col-span-2">
          <Field id="ea-category" label="Business category" optional error={fieldErrors.businessCategory}>
            <select id="ea-category" name="businessCategory" defaultValue="" className="field-input" aria-invalid={!!fieldErrors.businessCategory} aria-describedby={describe("ea-category", fieldErrors.businessCategory)} onChange={() => clearField("businessCategory")} disabled={busy}>
              <option value="">Select a category</option>
              {BUSINESS_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-sky/15 bg-base/40 p-4 text-sm leading-relaxed text-slate-300">
            <input type="checkbox" name="consent" className="mt-1 size-5 shrink-0 cursor-pointer accent-electric" aria-required="true" aria-invalid={!!fieldErrors.consent} aria-describedby={describe("ea-consent", fieldErrors.consent)} onChange={() => clearField("consent")} disabled={busy} />
            <span>
              I agree that Codistack may store the details I&apos;ve entered and contact me about the BILLINGHACKS beta,
              as described in the{" "}
              <Link href="/privacy" target="_blank" className="text-sky underline underline-offset-4">Privacy Policy</Link>.
              I understand this is not a paid subscription and does not guarantee access. <span aria-hidden className="text-sky">*</span>
            </span>
          </label>
          {fieldErrors.consent && <p id="ea-consent-error" role="alert" className="field-error">{fieldErrors.consent}</p>}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <FormAlert message={phase === "error" ? message : null} />
        <button type="submit" className="btn btn-primary w-full" disabled={busy}>
          {busy ? (<><Spinner /> Saving your registration…</>) : "Join the beta waiting list"}
        </button>
        <p className="text-center text-xs text-slate-400">
          Waiting-list registration only: no payment is taken, and you won&apos;t be added to unrelated marketing.
        </p>
      </div>
    </form>
  );
}
