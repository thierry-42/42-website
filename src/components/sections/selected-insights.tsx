import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { TextLink } from "@/components/ui/text-link";
import type { Insight } from "@/content/site-content";
import { publicContent } from "@/content/site-content";

function formatDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function InsightMeta({ insight }: { insight: Insight }) {
  const publishedDate = formatDate(insight.publishedAt);

  return (
    <p className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-[0.6875rem] tracking-[0.08em] text-[var(--colour-text-muted)] uppercase">
      <span>{insight.category}</span>
      {publishedDate ? (
        <>
          <span aria-hidden="true">/</span>
          <time dateTime={insight.publishedAt ?? undefined}>
            {publishedDate}
          </time>
        </>
      ) : null}
      <span aria-hidden="true">/</span>
      <span>{insight.readingTime}</span>
    </p>
  );
}

export function SelectedInsights() {
  const insights = publicContent.insights
    .filter((insight) => insight.featured)
    .slice(0, 3);
  if (insights.length === 0) return null;

  const [featured, ...supporting] = insights;

  return (
    <Section surface="paper">
      <Container>
        <div className="grid gap-8 border-b border-[var(--colour-border)] pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeading
            body="Original, practical guidance for people making decisions about HubSpot, customer data, connected systems, and websites."
            eyebrow="Latest articles"
            index="06"
            title="Useful thinking before the next decision."
          />
          <TextLink href="/insights">Browse all insights</TextLink>
        </div>

        <div
          className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1.72fr)_minmax(20rem,0.78fr)]"
          data-testid="home-latest-insights"
        >
          {featured ? (
            <Reveal className="h-full">
              <article className="group grid h-full overflow-hidden border border-[var(--colour-border)] bg-[var(--colour-surface-subtle)] md:grid-cols-[minmax(0,0.9fr)_minmax(18rem,1.1fr)]">
                <div className="flex min-h-80 flex-col p-6 sm:p-8 lg:min-h-[35rem] lg:p-10">
                  <InsightMeta insight={featured} />
                  <h3 className="mt-6 max-w-[17ch] font-serif text-[clamp(2.35rem,4.7vw,4.9rem)] leading-[0.92] tracking-[-0.055em] text-pretty">
                    {featured.title}
                  </h3>
                  <p className="mt-5 max-w-[48ch] text-sm leading-6 text-[var(--colour-text-muted)] sm:text-base sm:leading-7">
                    {featured.summary}
                  </p>
                  <div className="mt-auto pt-8">
                    <p className="mb-5 text-sm text-[var(--colour-text-muted)]">
                      By {featured.author}
                    </p>
                    <TextLink href={`/insights/${featured.slug}`}>
                      Read insight
                    </TextLink>
                  </div>
                </div>
                <div className="relative min-h-72 overflow-hidden bg-[var(--colour-surface-subtle-strong)] md:min-h-full">
                  <Image
                    alt={featured.imageAlt}
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.018] motion-reduce:transition-none"
                    fill
                    sizes="(max-width: 768px) 100vw, 52vw"
                    src={featured.image}
                  />
                </div>
              </article>
            </Reveal>
          ) : null}

          <div className="grid gap-5">
            {supporting.map((insight) => (
              <Reveal className="h-full" key={insight.slug}>
                <article className="group h-full border border-[var(--colour-border)] bg-[var(--colour-surface-subtle)]">
                  <Link
                    className="grid h-full min-h-64 gap-6 p-6 sm:grid-cols-[minmax(0,1fr)_8.5rem] sm:items-end sm:p-7 lg:grid-cols-1 lg:items-stretch"
                    href={`/insights/${insight.slug}`}
                    prefetch={false}
                  >
                    <div className="flex flex-col">
                      <InsightMeta insight={insight} />
                      <h3 className="mt-5 max-w-[22ch] text-2xl leading-[1.06] font-semibold tracking-[-0.045em] text-pretty lg:text-3xl">
                        {insight.title}
                      </h3>
                      <span className="mt-auto pt-6 text-sm font-semibold underline decoration-current/30 underline-offset-8">
                        Read insight
                      </span>
                    </div>
                    <div className="relative min-h-36 overflow-hidden bg-[var(--colour-surface-subtle-strong)] lg:min-h-40">
                      <Image
                        alt={insight.imageAlt}
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.025] motion-reduce:transition-none"
                        fill
                        sizes="(max-width: 640px) 136px, (max-width: 1024px) 25vw, 320px"
                        src={insight.image}
                      />
                    </div>
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
