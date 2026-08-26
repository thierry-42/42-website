import Image from "next/image";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/sections/section-heading";
import { publicContent, siteContent } from "@/content/site-content";
import { cn } from "@/lib/cn";

export function HomeHowWeWork() {
  const process = siteContent.home.process;
  const processImages = [
    publicContent.services[0]?.image,
    publicContent.services[2]?.image,
    publicContent.services[4]?.image,
    publicContent.services[6]?.image,
  ];

  return (
    <Section
      className="border-y border-[var(--colour-border)]"
      overflow="visible"
      surface="paper"
    >
      <Container>
        <SectionHeading
          body="The sequence stays clear while the depth of discovery, build, testing, documentation, and enablement adapts to the engagement."
          eyebrow={process.eyebrow}
          index="03"
          title={process.headline}
        />

        <ol
          className="home-process-grid mt-12 border-t border-l border-[var(--colour-border)] lg:grid lg:grid-cols-2 xl:grid-cols-4 xl:items-start"
          data-testid="home-how-we-work"
        >
          {process.steps.map((step, index) => (
            <li
              className="home-process-card grid border-r border-b border-[var(--colour-border)] bg-[var(--colour-surface)] sm:grid-cols-2 lg:grid-cols-1"
              data-process-index={index}
              key={step.number}
            >
              <div
                className={cn(
                  "flex min-h-64 flex-col justify-between p-6 sm:min-h-72 sm:p-8 lg:min-h-80",
                  index % 2 === 1 && "lg:order-2",
                )}
              >
                <p className="font-mono text-[0.6875rem] tracking-[0.12em] text-[var(--colour-text-muted)] uppercase">
                  (Step - {step.number})
                </p>
                <div>
                  <h3 className="font-serif text-[clamp(2rem,3.1vw,3.25rem)] leading-[0.98] tracking-[-0.045em]">
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-[35ch] text-sm leading-6 text-[var(--colour-text-muted)] sm:text-base sm:leading-7">
                    {step.body}
                  </p>
                </div>
              </div>

              <div
                className={cn(
                  "relative min-h-64 overflow-hidden bg-[var(--colour-surface-subtle)] sm:min-h-72 lg:min-h-80",
                  index % 2 === 1 && "lg:order-1",
                )}
              >
                {processImages[index] ? (
                  <Image
                    alt=""
                    aria-hidden="true"
                    className="object-cover transition-transform duration-700 hover:scale-[1.018] motion-reduce:transition-none"
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                    src={processImages[index]}
                  />
                ) : null}
                <div
                  aria-hidden="true"
                  className="hairline-grid absolute inset-0 opacity-20"
                />
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
