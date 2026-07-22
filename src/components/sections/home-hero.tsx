import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { HeroAnswerField } from "@/components/sections/hero-answer-field";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Body, Heading } from "@/components/ui/typography";
import { siteContent } from "@/content/site-content";

export function HomeHero({ consultationHref }: { consultationHref: string }) {
  const hero = siteContent.home.hero;

  return (
    <Section
      className="min-h-[calc(100svh-1px)] pt-[calc(var(--header-height)+3.5rem)] md:pt-[calc(var(--header-height)+5rem)]"
      spacing="compact"
      surface="dark"
    >
      <div
        aria-hidden="true"
        className="hairline-grid absolute inset-0 opacity-20"
      />
      <Container className="relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <Eyebrow index="42">{hero.eyebrow}</Eyebrow>
            <Heading as="h1" className="max-w-[7ch]" size="display">
              {hero.headline}
            </Heading>
            <Body className="mt-7 max-w-[50ch]" size="lg">
              {hero.body}
            </Body>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href={consultationHref} showArrow>
                {hero.primaryCta.label}
              </Button>
              <Button href={hero.secondaryCta.href} variant="secondary">
                {hero.secondaryCta.label}
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-4 border-t border-white/14 pt-5 font-mono text-[0.625rem] tracking-[0.12em] text-white/44 uppercase">
              <span className="h-px w-10 bg-signal-400" />
              Hover or focus the answer field
            </div>
          </Reveal>

          <Reveal className="lg:col-span-7">
            <HeroAnswerField />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
