import Link from "next/link";
import type { Brand } from "@/lib/brand";
import { SERVICES_LIST, SITE } from "@/lib/site";
import { Logo } from "./Logo";
import { MailIcon, WhatsAppIcon } from "./Icons";

const linkCls = "text-sm text-slate-300 transition-colors hover:text-white";

export function Footer({ brand }: { brand: Brand }) {
  return (
    <footer className="relative isolate overflow-hidden border-t border-sky/10 bg-base pt-16">
      <div className="tech-grid absolute inset-0 -z-10 opacity-30" aria-hidden />
      <div className="divider-glow absolute inset-x-0 top-0" aria-hidden />
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/#home" aria-label="Codistack home" className="inline-block"><Logo brand={brand} height={38} /></Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
              Codistack is an independent technology brand building modern digital solutions, scalable business
              software, SaaS platforms, and intelligent technologies. Accepting paid project inquiries.
            </p>
            <ul className="mt-6 space-y-3">
              <li><a href={`mailto:${SITE.email}`} className={`${linkCls} inline-flex items-center gap-2.5 break-all`}><MailIcon className="size-4 shrink-0 text-sky" />{SITE.email}</a></li>
              <li><a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className={`${linkCls} inline-flex items-center gap-2.5`}><WhatsAppIcon className="size-4 shrink-0 text-sky" />{SITE.phoneDisplay}</a></li>
            </ul>
          </div>

          <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8">
            <div>
              <h2 className="label-mono !text-[0.68rem]">Company</h2>
              <ul className="mt-4 space-y-3">
                <li><Link className={linkCls} href="/#home">Home</Link></li>
                <li><Link className={linkCls} href="/#about">About</Link></li>
                <li><Link className={linkCls} href="/#products">Products</Link></li>
                <li><Link className={linkCls} href="/#future">The future</Link></li>
                <li><Link className={linkCls} href="/#faq">FAQ</Link></li>
                <li><Link className={linkCls} href="/#contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="label-mono !text-[0.68rem]">Services</h2>
              <ul className="mt-4 space-y-3">
                {SERVICES_LIST.map((s) => (
                  <li key={s.id}><Link className={linkCls} href="/#services">{s.title}</Link></li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h2 className="label-mono !text-[0.68rem]">BILLINGHACKS</h2>
              <ul className="mt-4 space-y-3">
                <li><Link className={linkCls} href="/early-access">Join the beta waiting list</Link></li>
                <li><Link className={linkCls} href="/#products">About the product</Link></li>
              </ul>
              <h2 className="label-mono mt-8 !text-[0.68rem]">Legal</h2>
              <ul className="mt-4 space-y-3">
                <li><Link className={linkCls} href="/privacy">Privacy Policy</Link></li>
                <li><Link className={linkCls} href="/terms">Terms of Use</Link></li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-sky/10 py-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Codistack. All rights reserved.</p>
          <p>BILLINGHACKS is a product by Codistack. Codistack is an unregistered brand under development.</p>
        </div>
      </div>
    </footer>
  );
}
