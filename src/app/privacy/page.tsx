import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/site";
import { CONSENT_VERSION } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How the Codistack website collects, stores, and uses information submitted through its forms.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="Draft">
      <p>
        This policy explains what information the Codistack website collects when you use its forms, and how it is
        handled. Consent version recorded with waiting-list registrations: <code>{CONSENT_VERSION}</code>.
      </p>

      <h2>1. Who is responsible</h2>
      <p>
        Codistack is an independent technology brand under development. Legal entity name, registered address, and
        grievance officer details: <strong>[TO BE CONFIRMED]</strong>. You can contact us at{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or on WhatsApp / phone{" "}
        <a href={SITE.whatsapp}>{SITE.phoneDisplay}</a>.
      </p>

      <h2>2. Information we collect</h2>
      <p>
        <strong>BILLINGHACKS beta waiting list:</strong> full name, email address, and your consent (required);
        phone / WhatsApp number, business or shop name, and business category (optional). We record the time of
        registration, the time and version of your consent, and a submission status.
      </p>
      <p>
        <strong>Project inquiries:</strong> full name, email address, requested service, and project description
        (required); phone / WhatsApp, company name, estimated budget, and preferred timeline (optional).
      </p>
      <p>
        <strong>Technical and abuse-prevention data:</strong> for each form submission we store a salted one-way hash
        derived from your IP address (not the IP address itself) and a truncated browser user-agent string. Rate-limit
        counters are kept against a hashed identifier. These are used only to detect spam and abuse.
      </p>
      <p>Please do not include passwords, bank or card details, or other sensitive credentials in any form.</p>

      <h2>3. How we use it</h2>
      <ul>
        <li>Waiting-list data: to contact you about BILLINGHACKS beta availability.</li>
        <li>Project inquiries: to review and respond to your request.</li>
        <li>Abuse-prevention data: to protect the forms from spam and misuse.</li>
      </ul>
      <p>
        We do not sell your information, and we do not add waiting-list registrants to unrelated promotional
        marketing.
      </p>

      <h2>4. Storage and access</h2>
      <p>
        Submissions are stored in a PostgreSQL database accessed only by server-side code. There is no public way to
        read stored records. Access for authorised Codistack administrators is protected by authentication.
        Hosting and database provider: <strong>[TO BE CONFIRMED]</strong>.
      </p>

      <h2>5. Cookies and tracking</h2>
      <p>
        This website does not use advertising or analytics cookies or trackers. A strictly necessary, HttpOnly session
        cookie is set only if an authorised administrator signs in to the admin area. If analytics or other
        non-essential tracking is added in the future, this policy will be updated and consent will be requested
        first.
      </p>

      <h2>6. Retention</h2>
      <p>
        Retention periods: <strong>[TO BE CONFIRMED]</strong>. Until then, records are kept only as long as needed
        for the purposes above, and removed on request.
      </p>

      <h2>7. Your choices</h2>
      <p>
        You may ask us to access, correct, or delete the information you submitted, or withdraw from the waiting
        list, by emailing <a href={`mailto:${SITE.email}`}>{SITE.email}</a> from the address you registered with.
      </p>

      <h2>8. Changes</h2>
      <p>We may update this policy as the website and Codistack evolve. Material changes will be reflected on this page.</p>
    </LegalPage>
  );
}
