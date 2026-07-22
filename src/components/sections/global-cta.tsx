import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/typography";
import { siteContent } from "@/content/site-content";

export function GlobalCta({ href }: { href: string }) {
  const content = siteContent.home.booking;

  return (
    <Section className="!bg-signal-400 !text-signal-900" surface="paper">
      <Container className="text-center">
        <Eyebrow className="justify-center" index="42">
          {content.eyebrow}
        </Eyebrow>
        <Heading className="mx-auto max-w-[18ch]" size="h2">
          {content.headline}
        </Heading>
        <p className="mx-auto mt-6 max-w-[62ch] text-base leading-7 text-signal-900/75 md:text-lg">
          {content.body}
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button
            className="!border-ink-950 !bg-ink-950 !text-paper-50 hover:!bg-ink-800"
            href={href}
            showArrow
          >
            {content.primaryCta.label}
          </Button>
          <Button href="/services" variant="secondary">
            Explore services
          </Button>
        </div>
      </Container>
    </Section>
  );
}
