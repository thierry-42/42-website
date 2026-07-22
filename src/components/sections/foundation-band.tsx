import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CardEntrance, Reveal, Stagger } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SpotlightPrincipleCard } from "@/components/ui/spotlight-principle-card";
import type { SystemIconName } from "@/components/ui/system-icons";
import { Body, Heading } from "@/components/ui/typography";
import { siteContent } from "@/content/site-content";

type FoundationBandProps = {
  body?: string;
  title?: string;
};

export function FoundationBand({
  body = siteContent.brand.positioning,
  title = "Clear thinking, built into the system.",
}: FoundationBandProps) {
  const principleIcons: SystemIconName[] = [
    "engagement-review",
    "engagement-connect",
    "engagement-build",
    "engagement-improve",
  ];

  return (
    <Section surface="paper">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <Eyebrow index="01">How 42 thinks</Eyebrow>
            <Heading className="max-w-[13ch]" size="h2">
              {title}
            </Heading>
            <Body className="mt-6" size="lg">
              {body}
            </Body>
          </Reveal>
          <Stagger className="grid gap-3 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
            {siteContent.brand.principles
              .slice(0, 4)
              .map((principle, index) => (
                <CardEntrance className="h-full" key={principle}>
                  <SpotlightPrincipleCard
                    icon={principleIcons[index]}
                    index={index}
                    principle={principle}
                  />
                </CardEntrance>
              ))}
          </Stagger>
        </div>
      </Container>
    </Section>
  );
}
