import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { PageShell } from "@/components/PageShell";
import { RelatedLinks } from "@/components/RelatedLinks";
import { getBlogBySlug, getBlogSlugs } from "@/lib/blog";
import { markdownToHtml } from "@/lib/markdown";
import { buildPageMetadata } from "@/lib/seo-metadata";
import { buildArticleSchema } from "@/lib/seo/schema";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) return {};

  const base = buildPageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
  });

  const imageUrl = post.image ? `${SITE_URL}${post.image}` : undefined;

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated || post.date,
      images: imageUrl
        ? [{ url: imageUrl, alt: post.imageAlt || post.title }]
        : base.openGraph && "images" in base.openGraph
          ? base.openGraph.images
          : undefined,
    },
    twitter: {
      ...base.twitter,
      card: "summary_large_image",
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) notFound();

  const html = markdownToHtml(post.content);
  const url = `${SITE_URL}/blog/${post.slug}`;

  return (
    <PageShell
      breadcrumbs={[
        { name: "Home", href: "/" },
        { name: "Blog", href: "/blog" },
        { name: post.title, href: `/blog/${post.slug}` },
      ]}
      title={post.title}
      subtitle={post.description}
    >
      <JsonLd
        data={buildArticleSchema({
          headline: post.title,
          description: post.description,
          url,
        })}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.updated || post.date,
          image: post.image ? `${SITE_URL}${post.image}` : undefined,
          inLanguage: "en-GB",
          author: { "@type": "Organization", name: SITE_NAME },
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
          },
          mainEntityOfPage: url,
          url,
        }}
      />

      {post.image ? (
        <div className="relative mb-8 h-56 w-full overflow-hidden border border-border sm:h-72">
          <Image
            src={post.image}
            alt={post.imageAlt || post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 48rem"
            className="object-cover"
          />
        </div>
      ) : null}

      <p className="mb-6 text-sm text-body/70">
        <time dateTime={post.updated || post.date}>
          {new Date(post.updated || post.date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </time>
        <span className="mx-2">·</span>
        {post.readingTime}
      </p>

      <div
        className="prose-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <RelatedLinks
        links={[
          { href: "/blog", label: "All blog articles" },
          {
            href: "/case-types/business-valuation-divorce",
            label: "Business valuation in divorce",
          },
          {
            href: "/guides/form-e-financial-disclosure-guide",
            label: "Financial disclosure guide",
          },
          { href: "/how-it-works", label: "How a family court accountant works" },
        ]}
      />

      <p className="mt-10 text-sm">
        <Link href="/blog" className="font-semibold text-accent hover:underline">
          ← Back to the blog
        </Link>
      </p>
    </PageShell>
  );
}
