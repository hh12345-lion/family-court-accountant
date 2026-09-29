import Link from "next/link";
import type { ReactNode } from "react";
import { ContactEmail } from "@/components/ContactEmail";
import { FooterLegal } from "@/components/FooterLegal";
import { PreferredSourceButton } from "@/components/PreferredSourceButton";
import { SERVICES } from "@/lib/services-data";
import { PROCEEDINGS } from "@/lib/proceedings-data";
import { SITE_NAME, SITE_REFERRAL_NOTICE } from "@/lib/site";

const resourceLinks = [
  { href: "/guides", label: "Guides" },
  { href: "/blog", label: "Blog" },
  { href: "/case-types", label: "Case types" },
  { href: "/how-it-works", label: "Process" },
  { href: "/how-to-instruct", label: "How to instruct" },
  { href: "/qualifications", label: "Qualifications" },
  { href: "/who-we-help", label: "Clients" },
];

function FolderColumn({
  tab,
  children,
}: {
  tab: string;
  children: ReactNode;
}) {
  return (
    <div className="relative border border-border bg-surface pt-8 pb-6 px-5">
      <span className="absolute -top-3 left-4 bg-highlight px-3 py-0.5 font-serif text-sm font-medium text-white">
        {tab}
      </span>
      {children}
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t-2 border-primary bg-background">
      {/* Inquiry strip — not coral CTA, not sage panel, not dark utility bar */}
      <div className="border-b border-border bg-section-alt">
        <div className="mx-auto flex max-w-[var(--max-width-content)] flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="font-serif text-lg font-medium text-heading">
            Submit a confidential enquiry
          </p>
          <div className="flex flex-col gap-2 sm:items-end">
            <ContactEmail className="text-sm font-semibold text-accent hover:underline" />
            <Link
              href="/contact"
              className="text-sm text-body hover:text-accent"
            >
              Contact form →
            </Link>
          </div>
        </div>
      </div>

      {/* Tab-folder columns — not numbered 01/02, not pill cloud, not 4-col grid lists */}
      <div className="mx-auto max-w-[var(--max-width-content)] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <FolderColumn tab="Services">
            <ul className="space-y-2">
              {SERVICES.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.id}`}
                    className="text-sm text-body hover:text-accent"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services" className="text-sm font-medium text-accent">
                  All services
                </Link>
              </li>
            </ul>
          </FolderColumn>

          <FolderColumn tab="Proceedings">
            <ul className="space-y-2">
              {PROCEEDINGS.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/proceedings/${p.slug}`}
                    className="text-sm text-body hover:text-accent"
                  >
                    {p.hubLabel}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/proceedings" className="text-sm font-medium text-accent">
                  All proceedings
                </Link>
              </li>
            </ul>
          </FolderColumn>

          <FolderColumn tab="Resources">
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-body hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/glossary" className="text-sm text-body hover:text-accent">
                  Glossary
                </Link>
              </li>
            </ul>
          </FolderColumn>
        </div>
      </div>

      {/* Split legal row — not centered, not middot row, not monospace strip */}
      <div className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[var(--max-width-content)] px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xl">
              <p className="text-xs leading-relaxed text-muted">
                {SITE_REFERRAL_NOTICE}
              </p>
              <p className="mt-2 text-xs text-muted/80">
                © {new Date().getFullYear()} {SITE_NAME}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <FooterLegal />
              <PreferredSourceButton theme="light" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
