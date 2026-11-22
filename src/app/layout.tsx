import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { getBrand } from "@/lib/brand";
import { SITE } from "@/lib/site";
import { MotionProvider } from "@/components/Motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const brand = getBrand();

const DESCRIPTION =
  "Codistack is an independent technology brand building software products, SaaS platforms, and custom business software. Home of BILLINGHACKS Business OS. Now accepting project inquiries.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Codistack — Software, SaaS & AI Solutions | Engineering What's Next",
    template: "%s | Codistack",
  },
  description: DESCRIPTION,
  applicationName: "Codistack",
  keywords: [
    "Codistack",
    "software development India",
    "custom web applications",
    "business software development",
    "SaaS development",
    "BILLINGHACKS Business OS",
  ],
  openGraph: {
    type: "website",
    siteName: "Codistack",
    title: "Codistack — Engineering What's Next",
    description: DESCRIPTION,
    locale: "en_IN",
  },
  twitter: { card: "summary", title: "Codistack — Engineering What's Next", description: DESCRIPTION },
  ...(brand.symbol ? { icons: { icon: brand.symbol.src, apple: brand.symbol.src } } : {}),
};

export const viewport: Viewport = {
  themeColor: "#060B19",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Codistack",
      description: "Independent technology brand building software products, SaaS platforms, and custom business software.",
      email: SITE.email,
      telephone: SITE.phoneTel,
      ...(SITE.hasConfirmedDomain ? { url: SITE.url } : {}),
      contactPoint: {
        "@type": "ContactPoint",
        email: SITE.email,
        telephone: SITE.phoneTel,
        contactType: "customer support",
        areaServed: "IN",
      },
    },
    {
      "@type": "WebSite",
      name: "Codistack",
      ...(SITE.hasConfirmedDomain ? { url: SITE.url } : {}),
    },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN">
      <body className="bg-base text-slate-200 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <a
          href="#main"
          className="fixed left-4 top-4 z-[100] -translate-y-20 rounded-lg bg-white px-4 py-2 font-semibold text-base focus:translate-y-0"
        >
          Skip to content
        </a>
        <MotionProvider>
          <Navbar brand={brand} />
          <main id="main">{children}</main>
          <Footer brand={brand} />
        </MotionProvider>
      </body>
    </html>
  );
}
