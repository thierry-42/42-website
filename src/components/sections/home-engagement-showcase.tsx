import Image from "next/image";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/sections/section-heading";
import { CapabilityTag } from "@/components/ui/capability-tag";
import { TextLink } from "@/components/ui/text-link";
import { publicContent, siteContent } from "@/content/site-content";

const engagementServiceIndexes = [0, 1, 4, 7] as const;

export function HomeEngagementShowcase() {
  return (
    <Section overflow="visible" surface="muted">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeading
            body="Start with the shape of the problem, then choose the engagement that gets the system to a useful answer."
            eyebrow="Delivery pathways"
            index="04"
            title="How an engagement can take shape."
          />
          <p className="max-w-[34ch] border-l border-[var(--colour-border-strong)] pl-5 font-mono text-[0.6875rem] leading-5 tracking-[0.1em] text-[var(--colour-text-muted)] uppercase">
            Four clear ways to move from question to working system.
          </p>
        </div>

        <div
          className="home-engagement-stack mt-12 border-y border-[var(--colour-border)]"
          data-testid="home-engagement-showcase"
        >
          {siteContent.engagements.map((engagement, index) => {
            const service =
              publicContent.services[engagementServiceIndexes[index]];
            if (!service) return null;

            return (
              <article
                className="home-engagement-stack-card group grid overflow-hidden border border-[var(--colour-border)] bg-[var(--colour-surface)] shadow-[0_1.5rem_4rem_rgb(9_11_16/0.09)] lg:grid-cols-12"
                data-stack-index={index}
                key={engagement.name}
                style={{ zIndex: index + 1 }}
              >
                <div className="relative min-h-64 overflow-hidden bg-[var(--colour-surface-subtle)] sm:min-h-80 lg:col-span-5 lg:min-h-[27rem]">
                  <Image
                    alt=""
                    aria-hidden="true"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.018] motion-reduce:transition-none"
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    src={service.image}
                  />
                  <div
                    aria-hidden="true"
                    className="hairline-grid absolute inset-0 opacity-15"
                  />
                </div>

                <div className="flex flex-col p-6 sm:p-8 lg:col-span-7 lg:p-10">
                  <div className="flex items-center justify-between gap-4 border-b border-[var(--colour-border)] pb-5 font-mono text-[0.625rem] tracking-[0.12em] text-[var(--colour-text-muted)] uppercase">
                    <span>Engagement pathway</span>
                    <span>({String(index + 1).padStart(2, "0")})</span>
                  </div>

                  <div className="grid flex-1 gap-8 pt-7 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,0.72fr)]">
                    <div>
                      <h3 className="font-serif text-[clamp(2.75rem,5vw,5rem)] leading-[0.9] tracking-[-0.055em]">
                        {engagement.name}
                      </h3>
                      <p className="mt-5 max-w-[38ch] text-lg leading-7 text-[var(--colour-text-muted)]">
                        {engagement.description}
                      </p>
                    </div>
                    <div className="flex flex-col lg:border-l lg:border-[var(--colour-border)] lg:pl-7">
                      <div className="flex flex-wrap gap-2">
                        {engagement.items.map((item) => (
                          <CapabilityTag key={item}>{item}</CapabilityTag>
                        ))}
                      </div>
                      <TextLink
                        className="mt-8 lg:mt-auto"
                        href={`/services/${service.slug}`}
                      >
                        Explore the relevant service
                      </TextLink>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
