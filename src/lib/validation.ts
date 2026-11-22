import { z } from "zod";

/** Shared by the browser (UX) and the API routes (authority). */

export const CONSENT_VERSION = "2026-01-draft";

export const BUSINESS_CATEGORIES = [
  "Grocery / Kirana",
  "Clothing & Apparel",
  "Electronics & Mobile",
  "Pharmacy / Medical",
  "Restaurant / Café",
  "Hardware & Building",
  "Stationery / Gifts",
  "Wholesale / Distribution",
  "Other retail",
  "Other",
] as const;

export const SERVICES = [
  "Website Development",
  "Web Application Development",
  "Mobile Application",
  "Custom Business Software",
  "SaaS Platform Development",
  "AI Software Solution",
  "Automation & Integrations",
  "Not sure yet",
] as const;

export const BUDGETS = [
  "Under ₹25,000",
  "₹25,000 – ₹75,000",
  "₹75,000 – ₹2,00,000",
  "₹2,00,000+",
  "Not sure yet",
] as const;

export const TIMELINES = [
  "As soon as possible",
  "Within 1 month",
  "1 – 3 months",
  "3+ months",
  "Flexible",
] as const;

const clean = (v: unknown) =>
  typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim() : v;

const text = (min: number, max: number, label: string) =>
  z.preprocess(
    clean,
    z
      .string({ error: `${label} is required.` })
      .min(min, min <= 1 ? `${label} is required.` : `${label} must be at least ${min} characters.`)
      .max(max, `${label} must be at most ${max} characters.`),
  );

const optionalText = (max: number, label: string) =>
  z.preprocess(
    (v) => {
      const c = clean(v);
      return c === "" || c == null ? undefined : c;
    },
    z.string().max(max, `${label} must be at most ${max} characters.`).optional(),
  );

const email = z.preprocess(
  (v) => (typeof v === "string" ? v.trim() : v),
  z
    .string({ error: "Email address is required." })
    .min(1, "Email address is required.")
    .max(254, "Email address is too long.")
    .email("Enter a valid email address."),
);

const phone = z.preprocess(
  (v) => {
    const c = clean(v);
    return c === "" || c == null ? undefined : c;
  },
  z
    .string()
    .max(20, "Phone number is too long.")
    .regex(/^\+?[0-9][0-9\s\-()]{6,18}[0-9]$/, "Enter a valid phone or WhatsApp number.")
    .optional(),
);

const uuid = z.string().uuid("Invalid submission key.");

const guard = {
  /** Honeypot: real users never see or fill this. */
  website: z.string().max(0).optional().or(z.literal("")),
  formToken: z.string().min(10).max(300),
  submissionKey: uuid,
};

export const earlyAccessSchema = z.object({
  fullName: text(2, 120, "Full name"),
  email,
  phone,
  businessName: optionalText(150, "Business name"),
  businessCategory: z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.enum(BUSINESS_CATEGORIES, { error: "Choose a valid category." }).optional(),
  ),
  consent: z.literal(true, { error: "Please accept the privacy acknowledgment to join." }),
  ...guard,
});

export const projectInquirySchema = z.object({
  fullName: text(2, 120, "Full name"),
  email,
  phone,
  company: optionalText(150, "Company name"),
  service: z.enum(SERVICES, { error: "Select the service you need." }),
  description: text(20, 4000, "Project description"),
  budget: z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.enum(BUDGETS, { error: "Choose a valid budget." }).optional(),
  ),
  timeline: z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.enum(TIMELINES, { error: "Choose a valid timeline." }).optional(),
  ),
  ...guard,
});

export type EarlyAccessInput = z.infer<typeof earlyAccessSchema>;
export type ProjectInquiryInput = z.infer<typeof projectInquirySchema>;

export type FieldErrors = Record<string, string>;

export function flattenErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export const normalizeEmail = (e: string) => e.trim().toLowerCase();
