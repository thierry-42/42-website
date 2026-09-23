import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getMarkdownHeadings,
  MarkdownArticle,
} from "@/components/insights/markdown-article";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { GlobalCta } from "@/components/sections/global-cta";
import { SectionHeading } from "@/components/sections/section-heading";
import { StructuredData } from "@/components/seo/structured-data";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { InsightCard, ServiceCard } from "@/components/ui/cards";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Surface } from "@/components/ui/surface";
import { Heading } from "@/components/ui/typography";
import { getPublishedService } from "@/content/site-content";
import { isSearchIndexable, siteConfig } from "@/lib/config";
import {
  getPublishedInsight,
  getPublishedInsightAuthor,
  getPublishedInsightsBySlugs,
} from "@/lib/insights/repository";
import { createArticleStructuredData } from "@/lib/structured-data";

export const dynamic = "force-dynamic";

type InsightPageProps = {
  params: Promise<{ slug: string }>;
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
  year: "numeric",
});

function formatDate(value: string | null) {
  if (!value) return "Date pending";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00Z`)
    : new Date(value);
  return dateFormatter.format(date);
}

export async function generateMetadata({
  params,
}: InsightPageProps): Promise<Metadata> {
  const { slug } = await params;
  const insight = await getPublishedInsight(slug);

  if (!insight) return {};

  if (!isSearchIndexable) {
    return {
      authors: [{ name: insight.author }],
      description: insight.seoDescription,
      title: insight.seoTitle,
    };
  }

  const canonical = new URL(`/insights/${insight.slug}`, siteConfig.siteUrl);
  const image = new URL(insight.ogImage, siteConfig.siteUrl).toString();

  return {
    title: insight.seoTitle,
    description: insight.seoDescription,
    authors: [{ name: insight.author }],
    alternates: { canonical },
    openGraph: {
      description: insight.seoDescription,
      locale: "en_GB",
      images: [{ alt: insight.imageAlt, height: 960, url: image, width: 1440 }],
      authors: [insight.author],
      modifiedTime: insight.updatedAt ?? undefined,
      publishedTime: insight.publishedAt ?? undefined,
      siteName: "42",
      title: insight.seoTitle,
      type: "article",
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: insight.seoTitle,
      description: insight.seoDescription,
      images: [image],
    },
  };
}

export default async function InsightPage({ params }: InsightPageProps) {
  const { slug } = await params;
  const insight = await getPublishedInsight(slug);

  if (!insight) notFound();

  const relatedServices = insight.serviceSlugs
    .map((serviceSlug) => getPublishedService(serviceSlug))
    .filter((service) => service !== undefined);
  const [relatedInsights, author] = await Promise.all([
    getPublishedInsightsBySlugs(insight.relatedInsightSlugs),
    getPublishedInsightAuthor(insight.authorSlug),
  ]);
  const headings = getMarkdownHeadings(insight.bodyMarkdown).filter(
    (heading) => heading.depth === 2,
  );
  return (
    <>
      <StructuredData data={createArticleStructuredData(insight, author)} />

      <Section
        className="pt-[calc(var(--header-height)+3rem)] md:pt-[calc(var(--header-height)+5rem)]"
        spacing="compact"
        surface="dark"
      >
        <div
          aria-hidden="true"
          className="hairline-grid absolute inset-0 opacity-30"
        />
        <Container className="relative z-10">
          <Breadcrumb
            currentPath={`/insights/${insight.slug}`}
            items={[
              { href: "/", label: "Home" },
              { href: "/insights", label: "Insights" },
              {
                href: `/insights/category/${insight.categorySlug}`,
                label: insight.category,
              },
              { label: insight.title },
            ]}
          />
          <div className="mt-12 grid items-end gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Link
                href={`/insights/category/${insight.categorySlug}`}
                prefetch={false}
              >
                <Eyebrow>{insight.category}</Eyebrow>
              </Link>
              <Heading as="h1" className="max-w-[14ch]" size="h1">
                {insight.title}
              </Heading>
              <p className="mt-7 max-w-[64ch] text-lg leading-8 text-paper-50/72 md:text-xl md:leading-9">
                {insight.summary}
              </p>
              <div className="mt-9 flex flex-wrap gap-x-7 gap-y-2 font-mono text-xs tracking-[0.08em] text-paper-50/60 uppercase">
                {author ? (
                  <Link
                    className="underline decoration-paper-50/30 underline-offset-4 transition-colors hover:text-paper-50"
                    href={`/insights/author/${author.slug}`}
                    prefetch={false}
                  >
                    By {author.name}
                  </Link>
                ) : (
                  <span>By {insight.author}</span>
                )}
                <time dateTime={insight.publishedAt ?? undefined}>
                  {formatDate(insight.publishedAt)}
                </time>
                <span>{insight.readingTime}</span>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative aspect-[3/2] overflow-hidden rounded-lg border border-white/12 bg-ink-900 shadow-lift">
                <Image
                  alt={insight.imageAlt}
                  className="object-cover"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  src={insight.image}
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <article>
        <Section surface="paper">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[15rem_minmax(0,48rem)] lg:justify-center lg:gap-20">
              <aside className="lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start">
                <p className="font-mono text-xs tracking-[0.12em] text-[var(--text-muted)] uppercase">
                  On this page
                </p>
                <nav aria-label="Article contents" className="mt-5">
                  <ol className="space-y-1 border-l border-[var(--border)]">
                    {headings.map((heading, index) => (
                      <li key={heading.id}>
                        <a
                          className="grid grid-cols-[1.5rem_1fr] gap-2 border-l border-transparent py-2 pl-4 text-sm leading-5 text-[var(--text-muted)] transition-colors hover:border-orbit-600 hover:text-current"
                          href={`#${heading.id}`}
                        >
                          <span className="font-mono text-[0.625rem]">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span>{heading.title}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </aside>

              <div className="min-w-0">
                <Surface
                  className="border-orbit-500/25 p-6 md:p-8"
                  tone="muted"
                >
                  <p className="text-orbit-700 font-mono text-xs tracking-[0.12em] uppercase">
                    The short answer
                  </p>
                  <p className="mt-4 text-lg leading-8 font-medium md:text-xl md:leading-9">
                    {insight.quickAnswer}
                  </p>
                </Surface>

                <div className="mt-12">
                  <MarkdownArticle markdown={insight.bodyMarkdown} />
                </div>

                {author ? (
                  <Surface className="mt-14 p-6 md:p-8" tone="dark">
                    <p className="font-mono text-xs tracking-[0.12em] text-signal-400 uppercase">
                      About the author
                    </p>
                    <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
                      {author.name}
                    </h2>
                    <p className="mt-2 text-sm font-medium text-paper-50/72">
                      {author.role}
                    </p>
                    <p className="mt-4 max-w-[60ch] text-sm leading-7 text-paper-50/68">
                      {author.shortBiography}
                    </p>
                    <Link
                      className="mt-6 inline-flex text-sm font-semibold underline underline-offset-4"
                      href={`/insights/author/${author.slug}`}
                      prefetch={false}
                    >
                      View author profile
                    </Link>
                  </Surface>
                ) : null}

                {insight.sources.length ? (
                  <div className="mt-14 border-t border-[var(--border)] pt-10">
                    <h2 className="text-xl font-semibold tracking-[-0.035em]">
                      Sources and further reading
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
                      Product behaviour and pricing can change. These primary
                      sources
                      {insight.sourcesReviewedAt
                        ? ` were reviewed on ${formatDate(insight.sourcesReviewedAt)}.`
                        : " should be checked before making a current product decision."}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {insight.sources.map((source) => (
                        <li key={source.url}>
                          <a
                            className="group inline-flex items-start gap-3 text-sm font-semibold underline decoration-[var(--border-strong)] underline-offset-4 hover:decoration-current"
                            href={source.url}
                            rel="noreferrer"
                            target="_blank"
                          >
                            <span className="font-mono text-[0.625rem] text-[var(--text-muted)]">
                              {source.publisher}
                            </span>
                            <span>{source.title}</span>
                            <span aria-hidden="true">↗</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </Container>
        </Section>
      </article>

      {relatedServices.length ? (
        <Section surface="dark">
          <Container>
            <SectionHeading
              body="The services most closely connected to this guide."
              eyebrow="Related services"
              index="03"
              title="Turn the thinking into a working system."
            />
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {relatedServices.map((service, index) => (
                <ServiceCard
                  index={index}
                  key={service.slug}
                  service={service}
                />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section surface="muted">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Continue reading"
              index="04"
              title="Related practical guides."
            />
            <Link
              className="text-sm font-semibold underline decoration-[var(--border-strong)] underline-offset-4"
              href="/insights"
              prefetch={false}
            >
              View all insights
            </Link>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {relatedInsights.map((related) => (
              <InsightCard insight={related} key={related.slug} />
            ))}
          </div>
        </Container>
      </Section>

      <GlobalCta href={siteConfig.bookingUrl ?? "/contact"} />
    </>
  );
}
