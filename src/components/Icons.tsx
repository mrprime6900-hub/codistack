import type { IconName } from "@/lib/site";

const common = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ServiceIcon({ name, className = "size-7" }: { name: IconName; className?: string }) {
  const p = { viewBox: "0 0 32 32", className, "aria-hidden": true, ...common };
  switch (name) {
    case "globe":
      return (
        <svg {...p}>
          <circle cx="16" cy="16" r="11" />
          <path d="M5 16h22M16 5c3.5 3.2 5 6.8 5 11s-1.5 7.8-5 11c-3.5-3.2-5-6.8-5-11s1.5-7.8 5-11Z" />
        </svg>
      );
    case "browser":
      return (
        <svg {...p}>
          <rect x="4" y="6" width="24" height="20" rx="3" />
          <path d="M4 12h24M9 9h.01M13 9h.01M10 18l3 3-3 3M16 24h6" />
        </svg>
      );
    case "mobile":
      return (
        <svg {...p}>
          <rect x="9" y="3.5" width="14" height="25" rx="3.5" />
          <path d="M14 7h4M14 24.5h4M12.5 12h7M12.5 16h7M12.5 20h4" />
        </svg>
      );
    case "cube":
      return (
        <svg {...p}>
          <path d="M16 3.5 27 9.5v13l-11 6-11-6v-13l11-6Z" />
          <path d="M5 9.5l11 6 11-6M16 15.5v13" />
        </svg>
      );
    case "layers":
      return (
        <svg {...p}>
          <path d="m16 4 12 6-12 6-12-6 12-6Z" />
          <path d="m4 16 12 6 12-6M4 22l12 6 12-6" />
        </svg>
      );
    case "spark":
      return (
        <svg {...p}>
          <path d="M16 4c.8 6.5 3.5 9.2 10 10-6.5.8-9.2 3.5-10 10-.8-6.5-3.5-9.2-10-10 6.5-.8 9.2-3.5 10-10Z" />
          <path d="M25 4v4M23 6h4M7 24v4M5 26h4" />
        </svg>
      );
    case "flow":
      return (
        <svg {...p}>
          <circle cx="7" cy="9" r="3" />
          <circle cx="25" cy="9" r="3" />
          <circle cx="16" cy="25" r="3" />
          <path d="M10 9h12M8.5 11.7 14.5 22M23.5 11.7 17.5 22" />
        </svg>
      );
  }
}

export function ArrowRight({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

export function MailIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...common}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...common}>
      <path d="M4 20l1.2-4.2A8 8 0 1 1 8.3 18.9L4 20Z" />
      <path d="M9.2 8.8c.2 2.6 2.4 5 5.2 5.9l1.2-1.2-1.9-1-.8.6c-.9-.4-1.7-1.2-2.1-2.1l.6-.8-1-1.9-1.2 1Z" />
    </svg>
  );
}

export function CheckIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m4 10.5 4 4 8-9" />
    </svg>
  );
}

export function PlusIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M10 4v12M4 10h12" />
    </svg>
  );
}
