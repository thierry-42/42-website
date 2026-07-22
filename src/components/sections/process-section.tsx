import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/sections/section-heading";
import { CardEntrance, Stagger } from "@/components/motion/reveal";
import { ProcessStep } from "@/components/ui/process-step";
import { siteContent } from "@/content/site-content";

export function ProcessSection({ compact = false }: { compact?: boolean }) {
  const process = siteContent.home.process;

  return (
    <Section surface="dark">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12">
          <Stagger className="grid gap-3 lg:col-span-6">
            {process.steps.map((step) => (
              <CardEntrance key={step.number}>
                <ProcessStep
                  body={step.body}
                  number={step.number}
                  title={step.title}
                />
              </CardEntrance>
            ))}
            {!compact ? (
              <p className="mt-4 max-w-[58ch] text-sm leading-6 text-white/58">
                The sequence stays clear while the depth of discovery, build,
                testing, documentation, and enablement adapts to the engagement.
              </p>
            ) : null}
          </Stagger>
          <SectionHeading
            className="lg:sticky lg:top-32 lg:col-span-5 lg:col-start-8 lg:self-start"
            eyebrow={process.eyebrow}
            index="03"
            title={process.headline}
          />
        </div>
      </Container>
    </Section>
  );
}
