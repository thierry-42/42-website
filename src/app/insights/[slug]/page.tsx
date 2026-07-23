import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { GlobalCta } from "@/components/sections/global-cta";
import { SectionHeading } from "@/components/sections/section-heading";
import { StructuredData } from "@/components/seo/structured-data";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { InsightCard, ServiceCard } from "@/components/ui/cards";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Surface } from "@/components/ui/surface";
import { Heading } from "@/components/ui/typography";
import { getInsightBody } from "@/content/insights";
import {
  getPublishedInsight,
  getPublishedAuthor,
  getPublishedService,
  publicContent,
} from "@/content/site-content";
import { isSearchIndexable, siteConfig } from "@/lib/config";
import { createArticleStructuredData } from "@/lib/structured-data";

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
  return value
    ? dateFormatter.format(new Date(`${value}T00:00:00Z`))
    : "Date pending";
}

export function generateStaticParams() {
  return publicContent.insights.map((insight) => ({ slug: insight.slug }));
}

export async function generateMetadata({
  params,
}: InsightPageProps): Promise<Metadata> {
  const { slug } = await params;
  const insight = getPublishedInsight(slug);

  if (!insight) return {};

  if (!isSearchIndexable) {
    return {
      authors: [{ name: insight.author }],
      description: insight.summary,
      title: insight.title,
    };
  }

  const canonical = new URL(`/insights/${insight.slug}`, siteConfig.siteUrl);
  const image = new URL(insight.image, siteConfig.siteUrl).toString();

  return {
    title: insight.title,
    description: insight.summary,
    authors: [{ name: insight.author }],
    alternates: { canonical },
    openGraph: {
      description: insight.summary,
      locale: "en_GB",
      images: [{ alt: insight.imageAlt, height: 960, url: image, width: 1440 }],
      authors: [insight.author],
      modifiedTime: insight.updatedAt ?? undefined,
      publishedTime: insight.publishedAt ?? undefined,
      siteName: "42",
      title: insight.title,
      type: "article",
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: insight.title,
      description: insight.summary,
      images: [image],
    },
  };
}

export default async function InsightPage({ params }: InsightPageProps) {
  const { slug } = await params;
  const insight = getPublishedInsight(slug);
  const body = getInsightBody(slug);

  if (!insight || !body) notFound();

  const relatedServices = insight.serviceSlugs
    .map((serviceSlug) => getPublishedService(serviceSlug))
    .filter((service) => service !== undefined);
  const relatedInsights = insight.relatedInsightSlugs
    .map((relatedSlug) => getPublishedInsight(relatedSlug))
    .filter((related) => related !== undefined);
  const author = getPublishedAuthor(insight.authorSlug);
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
                    {body.sections.map((section, index) => (
                      <li key={section.id}>
                        <a
                          className="grid grid-cols-[1.5rem_1fr] gap-2 border-l border-transparent py-2 pl-4 text-sm leading-5 text-[var(--text-muted)] transition-colors hover:border-orbit-600 hover:text-current"
                          href={`#${section.id}`}
                        >
                          <span className="font-mono text-[0.625rem]">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span>{section.title.replace(/^\d+\.\s*/, "")}</span>
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
                    {body.quickAnswer}
                  </p>
                </Surface>

                <div className="mt-10 space-y-6 text-lg leading-8 text-ink-800">
                  {body.introduction.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                <div className="mt-16 space-y-16">
                  {body.sections.map((section) => (
                    <Reveal key={section.id}>
                      <section
                        aria-labelledby={`${section.id}-heading`}
                        className="scroll-mt-32"
                        id={section.id}
                      >
                        <h2
                          className="max-w-[22ch] font-serif text-[clamp(2rem,3.5vw,3rem)] leading-[1.02] tracking-[-0.035em]"
                          id={`${section.id}-heading`}
                        >
                          {section.title}
                        </h2>
                        <div className="mt-7 space-y-5 text-lg leading-8 text-ink-800">
                          {section.paragraphs.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                          ))}
                        </div>
                        {section.bullets ? (
                          <ul className="mt-7 grid gap-3">
                            {section.bullets.map((bullet) => (
                              <li
                                className="grid grid-cols-[0.75rem_1fr] gap-3 text-base leading-7 text-ink-800"
                                key={bullet}
                              >
                                <span
                                  aria-hidden="true"
                                  className="mt-[0.65rem] size-1.5 rounded-full bg-signal-500"
                                />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        {section.steps ? (
                          <ol className="mt-8 grid gap-3 sm:grid-cols-2">
                            {section.steps.map((step, index) => (
                              <li key={step.title}>
                                <Surface className="h-full p-5" tone="muted">
                                  <span className="text-orbit-700 font-mono text-[0.6875rem]">
                                    {String(index + 1).padStart(2, "0")}
                                  </span>
                                  <h3 className="mt-5 text-base font-semibold tracking-[-0.025em]">
                                    {step.title}
                                  </h3>
                                  <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                                    {step.body}
                                  </p>
                                </Surface>
                              </li>
                            ))}
                          </ol>
                        ) : null}
                        {section.note ? (
                          <aside className="mt-8 border-l-4 border-signal-500 bg-signal-400/12 px-6 py-5 text-base leading-7 text-ink-800">
                            <strong className="font-semibold">
                              Keep in mind:{" "}
                            </strong>
                            {section.note}
                          </aside>
                        ) : null}
                      </section>
                    </Reveal>
                  ))}
                </div>

                <div className="mt-16 border-t border-[var(--border)] pt-10">
                  <p className="font-serif text-3xl leading-tight tracking-[-0.03em]">
                    {body.conclusion}
                  </p>
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

                <div className="mt-14 border-t border-[var(--border)] pt-10">
                  <h2 className="text-xl font-semibold tracking-[-0.035em]">
                    Sources and further reading
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
                    Product behaviour and pricing can change. These primary
                    sources were reviewed on 22 July 2026.
                  </p>
                  <ul className="mt-6 space-y-3">
                    {body.sources.map((source) => (
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
