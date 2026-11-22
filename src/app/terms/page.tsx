import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms governing use of the Codistack website, its waiting list, and project inquiry forms.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="Draft">
      <p>These terms govern your use of the Codistack website. By using the site you agree to them.</p>

      <h2>1. About this website</h2>
      <p>
        The website is operated by Codistack, an independent technology brand under development. Legal entity name and
        registered address: <strong>[TO BE CONFIRMED]</strong>. Contact: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>

      <h2>2. Information only</h2>
      <p>
        Content on this site is for general information. Descriptions of services and of BILLINGHACKS Business OS
        describe intent and current status; they are not offers, warranties, or guarantees of availability, features,
        or timelines.
      </p>

      <h2>3. BILLINGHACKS waiting list</h2>
      <ul>
        <li>The waiting list is for the BILLINGHACKS Business OS beta.</li>
        <li>Joining does not guarantee access, a particular date, or a particular feature set.</li>
        <li>Joining does not create a paid subscription, and no payment is taken through this website.</li>
        <li>Planned prices shown for BILLINGHACKS are intentions and may change before any commercial release.</li>
      </ul>

      <h2>4. Project inquiries</h2>
      <p>
        Submitting an inquiry does not create a contract or commit either party to work. Scope, price, timeline, and
        terms for any paid project will be agreed separately and in writing.
      </p>

      <h2>5. Acceptable use</h2>
      <p>
        Do not misuse the site: no automated or abusive submissions, attempts to access data that isn&apos;t yours,
        probing or disrupting the service, or submitting unlawful or misleading content. Do not submit passwords or
        financial credentials.
      </p>

      <h2>6. Intellectual property</h2>
      <p>
        The Codistack name, logo, BILLINGHACKS name, and site content belong to Codistack unless stated otherwise. Trademark
        registration status: <strong>[TO BE CONFIRMED]</strong>. Do not copy or reuse them without permission.
      </p>

      <h2>7. Disclaimer and liability</h2>
      <p>
        The site is provided &quot;as is&quot; without warranties of any kind, to the extent permitted by law. To that
        extent, Codistack is not liable for losses arising from use of, or inability to use, the website.
        Jurisdiction and governing-law details: <strong>[TO BE CONFIRMED]</strong>.
      </p>

      <h2>8. Privacy</h2>
      <p>Our handling of personal data is described in the <Link href="/privacy">Privacy Policy</Link>.</p>

      <h2>9. Changes</h2>
      <p>We may update these terms as the website and business evolve. Continued use means you accept the updated terms.</p>
    </LegalPage>
  );
}
