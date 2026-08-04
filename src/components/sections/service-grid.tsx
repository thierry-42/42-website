import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CardEntrance, Stagger } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { ServiceCard } from "@/components/ui/cards";
import { publicContent } from "@/content/site-content";
import { siteConfig } from "@/lib/config";

type ServiceGridProps = {
  body?: string;
  enableStrategyPrototype?: boolean;
  eyebrow?: string;
  title?: string;
};

export async function ServiceGrid({
  body = "Eight connected service lines cover the decisions, architecture, implementation, and ongoing improvement behind a dependable HubSpot system.",
  enableStrategyPrototype = false,
  eyebrow = "What 42 solves",
  title = "Design, build, connect, and improve HubSpot.",
}: ServiceGridProps) {
  const StrategyServiceCardPrototype =
    enableStrategyPrototype && siteConfig.deploymentEnvironment === "staging"
      ? (
          await import("@/components/prototypes/strategy-service-card-prototype")
        ).StrategyServiceCardPrototype
      : null;

  return (
    <Section surface="dark">
      <Container>
        <SectionHeading
          body={body}
          eyebrow={eyebrow}
          index="02"
          title={title}
        />
        <Stagger className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {publicContent.services.map((service, index) => (
            <CardEntrance key={service.slug}>
              {StrategyServiceCardPrototype &&
              service.slug === "hubspot-strategy-consulting" ? (
                <StrategyServiceCardPrototype index={index} service={service} />
              ) : (
                <ServiceCard index={index} service={service} />
              )}
            </CardEntrance>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
