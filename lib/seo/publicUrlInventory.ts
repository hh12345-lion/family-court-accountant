import {

  caseTypeSlugs,

  guideSlugs,

  proceedingSlugs,

  serviceSlugs,

  SITE_URL,

} from "../site";

import { getBlogSlugs } from "../blog";



export const CANONICAL_HOST = SITE_URL;



/**

 * Indexable marketing pages. Keep in sync with app/ routes.

 * Run npm run seo:verify after adding routes.

 */

export const APP_STATIC_PATHS = [

  "/",

  "/what-is-a-family-court-accountant",

  "/services",

  "/how-it-works",

  "/who-we-help",

  "/who-we-help/solicitors-barristers",

  "/who-we-help/individuals-going-through-divorce",

  "/proceedings",

  "/case-types",

  "/qualifications",

  "/how-to-instruct",

  "/guides",

  "/blog",

  "/glossary",

  "/cookies",

] as const;



/** Public pages that exist but must not appear in the XML sitemap */

export const SITEMAP_EXCLUDED_PATHS = [

  "/contact",

  "/thank-you",

  "/privacy",

  "/terms",

  "/404",

] as const;



/** Crawl rules in public/robots.txt (not derived from the sitemap inventory) */

export const ROBOTS_DISALLOW_PATHS = [

  "/admin/",

  "/api/",

  "/private/",

  "/.netlify/",

  "/thank-you",

] as const;



export type PublicUrlInventory = {

  allPaths: string[];

  allUrls: string[];

};



export function buildPublicUrlInventory(): PublicUrlInventory {

  const dynamicPaths = [

    ...proceedingSlugs.map((slug) => `/proceedings/${slug}`),

    ...caseTypeSlugs.map((slug) => `/case-types/${slug}`),

    ...guideSlugs.map((slug) => `/guides/${slug}`),

    ...serviceSlugs.map((slug) => `/services/${slug}`),

    ...getBlogSlugs().map((slug) => `/blog/${slug}`),

  ];



  const excluded = new Set<string>(SITEMAP_EXCLUDED_PATHS);



  const allPaths = [...new Set([...APP_STATIC_PATHS, ...dynamicPaths])]

    .filter((path) => !excluded.has(path))

    .sort((a, b) => a.localeCompare(b));



  return {

    allPaths,

    allUrls: allPaths.map((path) => toAbsoluteUrl(path)),

  };

}



export function toAbsoluteUrl(path: string): string {

  if (path === "/") return `${CANONICAL_HOST}/`;

  const normalized = path.startsWith("/") ? path : `/${path}`;

  return `${CANONICAL_HOST}${normalized}`;

}



export function getSitemapChangefreq(path: string): string {

  if (path === "/") return "weekly";

  if (path === "/privacy" || path === "/terms") return "yearly";

  return "monthly";

}



export function getSitemapPriority(path: string): number {

  if (path === "/") return 1.0;

  if (path === "/services" || path === "/how-it-works") return 0.95;

  if (path === "/who-we-help" || path === "/proceedings") return 0.93;

  if (path === "/proceedings/financial-remedy-divorce") return 0.92;

  if (

    path === "/who-we-help/solicitors-barristers" ||

    path === "/who-we-help/individuals-going-through-divorce" ||

    path === "/case-types"

  )

    return 0.92;

  if (

    path === "/proceedings/schedule-1-children-act" ||

    path === "/proceedings/tolata-cohabitation"

  )

    return 0.9;

  if (path === "/proceedings/nuptial-agreements") return 0.88;

  if (path === "/what-is-a-family-court-accountant") return 0.9;

  if (path === "/qualifications" || path === "/how-to-instruct") return 0.88;

  if (path.startsWith("/services/")) return 0.9;

  if (path.startsWith("/case-types/")) return 0.88;

  if (path === "/guides" || path === "/blog") return 0.87;

  if (path.startsWith("/guides/") || path.startsWith("/blog/")) return 0.8;

  if (path === "/glossary") return 0.75;

  if (path === "/cookies") return 0.5;

  if (path === "/privacy" || path === "/terms") return 0.3;

  return 0.7;

}

