import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  robots?: Metadata["robots"];
};

function absoluteUrl(path: string): string {
  return `${SITE_URL}${path === "/" ? "" : path}`;
}

/** hreflang + canonical per SEO Architecture §9 */
export function buildAlternates(path: string): NonNullable<Metadata["alternates"]> {
  const pageUrl = absoluteUrl(path);
  return {
    canonical: pageUrl,
    languages: {
      "en-US": pageUrl,
      "x-default": pageUrl,
    },
  };
}

export function buildPageMetadata({
  title,
  description,
  path,
  robots,
}: PageSeoInput): Metadata {
  const pageUrl = absoluteUrl(path);

  return {
    title: { absolute: title },
    description,
    alternates: buildAlternates(path),
    robots: robots ?? { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/** Appendix D: required title + description for static routes (seo:verify:ssr). */
export const PAGE_SEO_MANIFEST: Record<
  string,
  { title: string; description: string }
> = {
  "/": {
    title:
      "Family Court Accountant | Forensic Accountants for Divorce & Family Finance",
    description:
      "Find a qualified family court forensic accountant. Business valuation, hidden asset investigation, financial affidavit review, and expert witness support for divorce and family financial proceedings.",
  },
  "/what-is-a-family-court-accountant": {
    title:
      "What Is a Family Court Accountant? | Role, Expert Standards & When You Need One",
    description:
      "A family court accountant is a forensic accountant who provides expert evidence in divorce and family financial proceedings. Financial affidavit analysis, business valuation, hidden assets, and expert witness standards explained.",
  },
  "/services": {
    title: "Family Court Accountant Services | Full Service List",
    description:
      "Family court accountant services: business valuation, hidden asset investigation, financial affidavit review, income assessment, lifestyle analysis, add-backs, and court-compliant expert reports.",
  },
  "/how-it-works": {
    title: "How a Family Court Accountant Works | Step-by-Step Guide",
    description:
      "Step-by-step guide to what a family court accountant does — from financial disclosure to court-appointed expert appointment, expert report, and testimony.",
  },
  "/who-we-help": {
    title: "Who We Help | Family Court Accountants for Attorneys & Individuals",
    description:
      "Family court accountants for family law attorneys needing expert witnesses — and for individuals going through divorce who need financial investigation or business valuation help.",
  },
  "/who-we-help/solicitors-barristers": {
    title:
      "Family Court Accountants for Family Law Attorneys | Expert Witnesses",
    description:
      "Forensic accountants and family court expert witnesses for family law attorneys. Court-compliant reports, joint expert appointments, business valuation, and hidden asset investigation.",
  },
  "/who-we-help/individuals-going-through-divorce": {
    title:
      "Going Through Divorce? Family Court Accountant Help | Hidden Assets & Business Valuation",
    description:
      "If your spouse owns a business, you suspect hidden assets, or their declared income doesn't match their lifestyle, a family court accountant can help. Get independent expert financial analysis.",
  },
  "/proceedings": {
    title: "Family Court Proceedings | Equitable Distribution, Child Support & More",
    description:
      "Family court accountant support for equitable distribution, child support provision, cohabitation property, and marital agreement proceedings.",
  },
  "/case-types": {
    title: "Case Types Requiring a Family Court Accountant",
    description:
      "Which family proceedings need a family court accountant? Business valuation, hidden assets, lifestyle analysis, add-backs, overseas assets, and more explained.",
  },
  "/qualifications": {
    title:
      "Family Court Accountant Qualifications | CPA, CFF & Expert Witness Standards",
    description:
      "What credentials should a family court accountant hold? CPA, CFF, ABV, and court expert witness standards explained.",
  },
  "/how-to-instruct": {
    title:
      "How to Instruct a Family Court Accountant | Attorneys & Individuals Guide",
    description:
      "How attorneys and individuals instruct a family court accountant — joint vs party-appointed experts, expert witness rules, letter of instruction, and documents needed.",
  },
  "/guides": {
    title:
      "Guides: Family Court Accountants | Divorce Finance, Hidden Assets & Business Valuation",
    description:
      "In-depth guides on family court accountants for attorneys and individuals — financial affidavit analysis, hidden assets, business valuation in divorce, and more.",
  },
  "/blog": {
    title: "Blog | Family Court Accountant Insights",
    description:
      "Articles for family lawyers on forensic accounting in divorce, including share options, RSUs, equity awards and financial disclosure.",
  },
  "/glossary": {
    title: "Family Court Accountant Glossary | Key Family Finance Terms",
    description:
      "Definitions of key family court accountant and family finance terms — from financial affidavits to add-backs, lifestyle analysis, and court-appointed experts.",
  },
  "/contact": {
    title: "Contact a Family Court Accountant",
    description:
      "Submit a brief enquiry to be matched with a qualified family court forensic accountant. Family law attorneys and individuals welcome.",
  },
};
