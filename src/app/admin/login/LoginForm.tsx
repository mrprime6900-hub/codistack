"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (res.ok && data.ok) {
        router.replace("/admin");
        router.refresh();
        return;
      }
      setError(data.error ?? "Sign in failed.");
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="glass glass-strong mt-8 space-y-5 rounded-3xl p-6 sm:p-8">
      <div>
        <label htmlFor="adm-email" className="field-label">Email</label>
        <input id="adm-email" name="email" type="email" required autoComplete="username" className="field-input" />
      </div>
      <div>
        <label htmlFor="adm-pass" className="field-label">Password</label>
        <input id="adm-pass" name="password" type="password" required autoComplete="current-password" className="field-input" />
      </div>
      <div role="status" aria-live="assertive">{error && <p className="field-error">{error}</p>}</div>
      <button type="submit" className="btn btn-primary w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
