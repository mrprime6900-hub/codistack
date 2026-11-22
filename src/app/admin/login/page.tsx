"use client";

import { useEffect, useState } from "react";
import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if already authenticated
    fetch("/api/admin/leads")
      .then((res) => {
        if (res.ok) {
          window.location.href = "/admin";
        } else {
          setChecking(false);
        }
      })
      .catch(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div className="container-x max-w-md pb-24 pt-16 text-center">
        <span className="inline-block size-6 animate-spin rounded-full border-2 border-sky border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container-x max-w-md pb-24 pt-16">
      <div className="inline-flex items-center gap-2 rounded-full border border-sky/30 bg-sky/10 px-3 py-1 font-mono text-[0.65rem] text-sky uppercase">
        <span className="size-1.5 rounded-full bg-electric animate-pulse" />
        SECURE ADMINISTRATIVE ACCESS
      </div>
      <h1 className="mt-3 font-display text-4xl font-extrabold uppercase text-white">
        Admin Sign In
      </h1>
      <p className="mt-2 text-sm text-slate-300">
        Enter your administrative credentials to manage BILLINGHACKS waiting list registrations and client project inquiries.
      </p>

      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
