import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * BILLINGHACKS beta waiting list registrations.
 * Completely separate from project inquiries.
 */
export const earlyAccessRegistrations = pgTable(
  "early_access_registrations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    emailNormalized: text("email_normalized").notNull(),
    phone: text("phone"),
    businessName: text("business_name"),
    businessCategory: text("business_category"),
    status: text("status").notNull().default("waiting"),
    consentAt: timestamp("consent_at", { withTimezone: true }).notNull(),
    consentVersion: text("consent_version").notNull(),
    /** Client-generated idempotency key: makes retries safe. */
    submissionKey: uuid("submission_key").notNull(),
    /** Salted hash only. The raw IP address is never stored. */
    ipHash: text("ip_hash"),
    userAgent: text("user_agent"),
    adminNotes: text("admin_notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("ea_email_normalized_uq").on(t.emailNormalized),
    uniqueIndex("ea_submission_key_uq").on(t.submissionKey),
    index("ea_created_at_idx").on(t.createdAt),
    check("ea_status_chk", sql`${t.status} in ('waiting','contacted','invited','declined')`),
    check("ea_name_len_chk", sql`char_length(${t.fullName}) between 2 and 120`),
  ],
);

/**
 * Paid custom-development project inquiries.
 */
export const projectInquiries = pgTable(
  "project_inquiries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    emailNormalized: text("email_normalized").notNull(),
    phone: text("phone"),
    company: text("company"),
    service: text("service").notNull(),
    description: text("description").notNull(),
    budget: text("budget"),
    timeline: text("timeline"),
    status: text("status").notNull().default("new"),
    /** sha256 of normalized description: blocks re-submitting the same inquiry. */
    contentHash: text("content_hash").notNull(),
    submissionKey: uuid("submission_key").notNull(),
    ipHash: text("ip_hash"),
    userAgent: text("user_agent"),
    adminNotes: text("admin_notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("pi_submission_key_uq").on(t.submissionKey),
    uniqueIndex("pi_email_content_uq").on(t.emailNormalized, t.contentHash),
    index("pi_created_at_idx").on(t.createdAt),
    check(
      "pi_status_chk",
      sql`${t.status} in ('new','in_review','contacted','closed','spam')`,
    ),
    check("pi_desc_len_chk", sql`char_length(${t.description}) between 20 and 4000`),
  ],
);

/** Fixed-window rate limiter storage (keys are hashed, never raw IPs). */
export const rateLimits = pgTable("rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull().default(0),
  windowStart: timestamp("window_start", { withTimezone: true }).notNull().defaultNow(),
});

export type EarlyAccessRegistration = typeof earlyAccessRegistrations.$inferSelect;
export type ProjectInquiry = typeof projectInquiries.$inferSelect;
