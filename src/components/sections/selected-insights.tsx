import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CardEntrance, Stagger } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { InsightCard } from "@/components/ui/cards";
import { TextLink } from "@/components/ui/text-link";
import { publicContent } from "@/content/site-content";

export function SelectedInsights() {
  const insights = publicContent.insights
    .filter((insight) => insight.featured)
    .slice(0, 3);
  if (insights.length === 0) return null;

  return (
    <Section surface="muted">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeading
            body="Original, practical guidance for people making decisions about HubSpot, customer data, connected systems, and websites."
            eyebrow="Selected insights"
            index="07"
            title="Useful thinking before the next decision."
          />
          <TextLink href="/insights">Browse all insights</TextLink>
        </div>
        <Stagger className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {insights.map((insight) => (
            <CardEntrance className="h-full" key={insight.slug}>
              <InsightCard insight={insight} />
            </CardEntrance>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
