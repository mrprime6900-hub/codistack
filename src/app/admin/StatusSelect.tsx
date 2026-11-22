"use client";

import { useState } from "react";

export function StatusSelect({
  type,
  id,
  value,
  options,
}: {
  type: "early-access" | "inquiry";
  id: string;
  value: string;
  options: readonly string[];
}) {
  const [current, setCurrent] = useState(value);
  const [state, setState] = useState<"idle" | "saving" | "error">("idle");

  async function change(next: string) {
    const prev = current;
    setCurrent(next);
    setState("saving");
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id, status: next }),
      });
      if (!res.ok) throw new Error();
      setState("idle");
    } catch {
      setCurrent(prev);
      setState("error");
    }
  }

  return (
    <span className="inline-flex flex-col">
      <select
        aria-label="Status"
        value={current}
        disabled={state === "saving"}
        onChange={(e) => void change(e.target.value)}
        className="field-input !min-h-9 !rounded-lg !py-1 !pl-2.5 !pr-8 !text-sm"
      >
        {options.map((o) => (<option key={o} value={o}>{o.replace("_", " ")}</option>))}
      </select>
      {state === "error" && <span role="alert" className="text-xs text-red-300">Update failed</span>}
    </span>
  );
}
