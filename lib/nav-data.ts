import { CASE_TYPES } from "@/lib/case-types-data";
import { SERVICES } from "@/lib/services-data";

export type NavLink = { href: string; label: string };

export const whoWeHelpLinks: NavLink[] = [
  { href: "/who-we-help/solicitors-barristers", label: "Family Law Attorneys" },
  {
    href: "/who-we-help/individuals-going-through-divorce",
    label: "Individuals in Divorce",
  },
];

export const proceedingsLinks: NavLink[] = [
  { href: "/proceedings", label: "All proceedings" },
  {
    href: "/proceedings/financial-remedy-divorce",
    label: "Equitable Distribution",
  },
  {
    href: "/proceedings/schedule-1-children-act",
    label: "Child Support & Provision",
  },
  {
    href: "/proceedings/tolata-cohabitation",
    label: "Cohabitation Property",
  },
  { href: "/proceedings/nuptial-agreements", label: "Marital Agreements" },
];

export const servicesNavLinks: NavLink[] = [
  { href: "/services", label: "All services" },
  ...SERVICES.map((s) => ({
    href: `/services/${s.id}`,
    label: s.title,
  })),
];

export const caseTypesNavLinks: NavLink[] = [
  { href: "/case-types", label: "All case types" },
  ...CASE_TYPES.map((c) => ({
    href: `/case-types/${c.slug}`,
    label: c.hubLabel,
  })),
];

export const resourcesNavLinks: NavLink[] = [
  { href: "/guides", label: "Guides" },
  { href: "/blog", label: "Blog" },
  { href: "/how-to-instruct", label: "How to instruct" },
  { href: "/qualifications", label: "Qualifications" },
];

/** Secondary sections shown after primary nav items in the mobile menu. */
export const mobileNavGroups = [
  { heading: "Case types", links: caseTypesNavLinks },
  { heading: "Resources", links: resourcesNavLinks },
];
