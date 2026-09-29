import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PageShell } from "@/components/PageShell";
import { getAllBlogPosts } from "@/lib/blog";
import { buildPageMetadata } from "@/lib/seo-metadata";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "Blog | Family Court Accountant Insights",
  description:
    "Articles for family lawyers on forensic accounting in divorce, including share options, RSUs, equity awards and financial disclosure.",
  path: "/blog",
});

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <PageShell
      breadcrumbs={[
        { name: "Home", href: "/" },
        { name: "Blog", href: "/blog" },
      ]}
      title="Blog"
      subtitle="Practitioner-facing articles on forensic accounting in family proceedings, equity awards, and financial disclosure."
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: `${SITE_NAME} Blog`,
          url: `${SITE_URL}/blog`,
          inLanguage: "en-GB",
          blogPost: posts.map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.updated || post.date,
            url: `${SITE_URL}/blog/${post.slug}`,
            image: post.image ? `${SITE_URL}${post.image}` : undefined,
          })),
        }}
      />

      {posts.length === 0 ? (
        <p className="text-body">Articles will appear here shortly.</p>
      ) : (
        <ul className="grid gap-8">
          {posts.map((post) => (
            <li
              key={post.slug}
              className="overflow-hidden border border-border bg-white"
            >
              {post.image ? (
                <Link
                  href={`/blog/${post.slug}`}
                  className="relative block h-52 w-full"
                >
                  <Image
                    src={post.image}
                    alt={post.imageAlt || post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 48rem"
                    className="object-cover"
                  />
                </Link>
              ) : null}
              <div className="p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                  <time dateTime={post.updated || post.date}>
                    {new Date(post.updated || post.date).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </time>
                  <span className="mx-2 text-body/50">·</span>
                  <span className="normal-case tracking-normal text-body/70">
                    {post.readingTime}
                  </span>
                </p>
                <h2 className="mt-3 font-serif text-xl font-semibold text-primary">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-accent focus:outline-none focus-visible:underline"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-3 text-body leading-relaxed">
                  {post.description}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-flex min-h-[44px] items-center text-sm font-semibold text-accent hover:underline"
                >
                  Read article
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
