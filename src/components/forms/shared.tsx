"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { ZodType } from "zod";
import { flattenErrors, type FieldErrors } from "@/lib/validation";

export type Phase = "idle" | "submitting" | "success" | "error";

type ApiResponse = {
  ok: boolean;
  status?: string;
  error?: string;
  fieldErrors?: FieldErrors;
};

/**
 * Handles token fetching, idempotency key, client validation, double-submit protection
 * and honest success/failure states. "success" is only set after the server confirms persistence.
 */
export function useSubmission(endpoint: string, clientSchema: ZodType) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const token = useRef<string | null>(null);
  const key = useRef<string>("");
  const inflight = useRef(false);

  const loadToken = useCallback(async () => {
    try {
      const res = await fetch("/api/form-token", { cache: "no-store" });
      const data = (await res.json()) as { token?: string };
      token.current = data.token ?? null;
    } catch {
      token.current = null;
    }
  }, []);

  useEffect(() => {
    key.current = crypto.randomUUID();
    void loadToken();
  }, [loadToken]);

  const submit = useCallback(
    async (values: Record<string, unknown>, form: HTMLFormElement) => {
      if (inflight.current) return;
      setMessage(null);

      const checked = clientSchema.safeParse(values);
      if (!checked.success) {
        const errs = flattenErrors(checked.error);
        setFieldErrors(errs);
        setPhase("error");
        setMessage("Please correct the highlighted fields.");
        const first = Object.keys(errs)[0];
        (form.elements.namedItem(first!) as HTMLElement | null)?.focus();
        return;
      }
      setFieldErrors({});

      inflight.current = true;
      setPhase("submitting");
      try {
        if (!token.current) await loadToken();
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, formToken: token.current ?? "", submissionKey: key.current }),
        });
        let data: ApiResponse;
        try {
          data = (await res.json()) as ApiResponse;
        } catch {
          data = { ok: false, error: "Unexpected response from the server. Nothing was confirmed. Please try again." };
        }

        if (res.ok && data.ok) {
          setResult(data.status ?? "ok");
          setPhase("success");
          return;
        }
        if (data.fieldErrors) setFieldErrors(data.fieldErrors);
        setMessage(data.error ?? "Something went wrong. Please try again.");
        setPhase("error");
        if (res.status === 400) void loadToken();
      } catch {
        setMessage("We couldn't reach the server. Check your connection and try again. Nothing was submitted.");
        setPhase("error");
      } finally {
        inflight.current = false;
      }
    },
    [clientSchema, endpoint, loadToken],
  );

  const clearField = (name: string) =>
    setFieldErrors((e) => {
      if (!e[name]) return e;
      const next = { ...e };
      delete next[name];
      return next;
    });

  return { phase, message, result, fieldErrors, submit, clearField };
}

export function Field({
  id,
  label,
  optional,
  required,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
        {required && <span aria-hidden className="ml-1 text-sky">*</span>}
        {optional && <span className="opt">(optional)</span>}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-400">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}

export const describe = (id: string, error?: string, hint?: string) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined;

/** Hidden honeypot. Real users and assistive tech never reach it. */
export function Honeypot() {
  return (
    <div aria-hidden className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Leave this field empty
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

export function FormAlert({ message }: { message: string | null }) {
  return (
    <div aria-live="assertive" role="status">
      {message && (
        <p className="rounded-xl border border-red-300/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">{message}</p>
      )}
    </div>
  );
}

export function Spinner() {
  return (
    <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
  );
}
