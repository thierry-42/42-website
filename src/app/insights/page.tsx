import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CardEntrance, Stagger } from "@/components/motion/reveal";
import { GlobalCta } from "@/components/sections/global-cta";
import { PageIntro } from "@/components/sections/page-intro";
import { SectionHeading } from "@/components/sections/section-heading";
import { CapabilityTag } from "@/components/ui/capability-tag";
import { InsightCard } from "@/components/ui/cards";
import { publicContent } from "@/content/site-content";
import { siteConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  description:
    "Clear, practical guides for better HubSpot systems, CRM operations, websites, integrations, reporting, accessibility, and managed support.",
  path: "/insights",
  title: "Insights",
});

export default function InsightsPage() {
  const insights = publicContent.insights;
  const featured = insights[0];
  const supporting = insights.slice(1, 4);
  const remaining = insights.slice(4);
  const categories = [...new Set(insights.map((insight) => insight.category))];

  return (
    <>
      <PageIntro
        body="Clear guides, checklists, and explanations for people making decisions about CRM, websites, integrations, data, and digital operations."
        breadcrumb="Insights"
        eyebrow="Practical thinking"
        title="Practical guides for better HubSpot systems."
      />

      <Section surface="paper">
        <Container>
          <SectionHeading
            body="Start with the questions that most often expose avoidable risk in a growing HubSpot system."
            eyebrow="Featured guides"
            index="01"
            title="Useful before the next decision."
          />
          {featured ? (
            <div className="mt-12 grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
              <InsightCard insight={featured} variant="featured" />
              <div className="border-y border-[var(--border)]">
                {supporting.map((insight) => (
                  <InsightCard
                    insight={insight}
                    key={insight.slug}
                    variant="compact"
                  />
                ))}
              </div>
            </div>
          ) : null}
        </Container>
      </Section>

      <Section surface="muted">
        <Container>
          <div className="grid gap-8 border-b border-[var(--border)] pb-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <SectionHeading
              body="Original, source-checked guidance written to be applied—not padded for search."
              eyebrow="The library"
              index="02"
              title="Browse every practical guide."
            />
            <div className="flex max-w-2xl flex-wrap gap-2 lg:justify-end">
              {categories.map((category) => (
                <CapabilityTag key={category}>{category}</CapabilityTag>
              ))}
            </div>
          </div>
          <Stagger className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {remaining.map((insight) => (
              <CardEntrance className="h-full" key={insight.slug}>
                <InsightCard insight={insight} />
              </CardEntrance>
            ))}
          </Stagger>
        </Container>
      </Section>

      <GlobalCta href={siteConfig.bookingUrl ?? "/contact"} />
    </>
  );
}
