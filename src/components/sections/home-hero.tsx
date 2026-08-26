import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { HomeServiceStage } from "@/components/sections/home-service-stage";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Body, Heading } from "@/components/ui/typography";
import { publicContent, siteContent } from "@/content/site-content";

export function HomeHero({ consultationHref }: { consultationHref: string }) {
  const hero = siteContent.home.hero;

  return (
    <Section
      className="border-b border-[var(--colour-border)] pt-[calc(var(--header-height)+2.5rem)] sm:pt-[calc(var(--header-height)+3.5rem)]"
      spacing="compact"
      surface="paper"
    >
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Eyebrow index="42">{hero.eyebrow}</Eyebrow>
            <Heading
              as="h1"
              className="max-w-none text-[clamp(3.6rem,9.4vw,9rem)] leading-[0.82] tracking-[-0.075em]"
            >
              {hero.headline}
            </Heading>
          </div>
          <div className="pb-1 lg:col-span-4">
            <Body className="max-w-[47ch]" size="lg">
              {hero.body}
            </Body>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href={consultationHref} showArrow>
                {hero.primaryCta.label}
              </Button>
              <Button href={hero.secondaryCta.href} variant="secondary">
                {hero.secondaryCta.label}
              </Button>
            </div>
          </div>
        </div>

        <HomeServiceStage services={publicContent.services} />
      </Container>
    </Section>
  );
}
