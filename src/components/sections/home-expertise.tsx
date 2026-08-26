"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/sections/section-heading";
import { CapabilityTag } from "@/components/ui/capability-tag";
import { TextLink } from "@/components/ui/text-link";
import type { Service } from "@/content/site-content";
import { cn } from "@/lib/cn";

export function HomeExpertise({ services }: { services: readonly Service[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabsId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function selectAndFocus(index: number) {
    const nextIndex = (index + services.length) % services.length;
    setActiveIndex(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <Section className="border-y border-[var(--colour-border)]" surface="paper">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeading
            body="Strategy, implementation, data, automation, development, websites, service, and ongoing support work as one connected system."
            eyebrow="What 42 solves"
            index="02"
            title="Expertise for the full HubSpot system."
          />
          <p className="max-w-[34ch] border-l border-[var(--colour-border-strong)] pl-5 font-mono text-[0.6875rem] leading-5 tracking-[0.1em] text-[var(--colour-text-muted)] uppercase">
            Choose a service to open the working detail.
          </p>
        </div>

        <div
          aria-label="42 service expertise"
          className="home-expertise-grid mt-12 flex flex-col overflow-hidden border border-[var(--colour-border)] xl:grid"
          data-testid="home-expertise"
          role="group"
          style={{
            gridTemplateColumns: services
              .map((_, index) =>
                index === activeIndex
                  ? "minmax(0, 8fr)"
                  : "minmax(4.75rem, 1fr)",
              )
              .join(" "),
          }}
        >
          {services.map((service, index) => {
            const active = index === activeIndex;
            const panelId = `${tabsId}-panel-${index}`;
            const tabId = `${tabsId}-tab-${index}`;

            return (
              <article
                className={cn(
                  "home-expertise-panel group relative min-w-0 border-b border-[var(--colour-border)] bg-[var(--colour-surface)] transition-colors duration-500 last:border-b-0 motion-reduce:transition-none xl:flex xl:flex-col xl:overflow-hidden xl:border-r xl:border-b-0 xl:last:border-r-0",
                  active
                    ? "bg-[var(--colour-surface)]"
                    : "bg-[var(--colour-surface-subtle)]",
                )}
                data-active={active ? "true" : "false"}
                data-testid={`expertise-service-${service.slug}`}
                key={service.slug}
              >
                <button
                  aria-controls={panelId}
                  aria-expanded={active}
                  className={cn(
                    "flex min-h-20 w-full items-center justify-between gap-5 px-5 py-4 text-left hover:bg-[var(--colour-surface-subtle-strong)]/45",
                    active
                      ? "xl:relative xl:z-20 xl:min-h-20 xl:flex-row xl:px-7 xl:py-5"
                      : "xl:absolute xl:inset-0 xl:z-20 xl:min-h-0 xl:flex-col xl:items-center xl:justify-start xl:px-4 xl:py-6",
                  )}
                  id={tabId}
                  onClick={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onKeyDown={(event) => {
                    if (
                      event.key === "ArrowRight" ||
                      event.key === "ArrowDown"
                    ) {
                      event.preventDefault();
                      selectAndFocus(activeIndex + 1);
                    }
                    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                      event.preventDefault();
                      selectAndFocus(activeIndex - 1);
                    }
                    if (event.key === "Home") {
                      event.preventDefault();
                      selectAndFocus(0);
                    }
                    if (event.key === "End") {
                      event.preventDefault();
                      selectAndFocus(services.length - 1);
                    }
                  }}
                  ref={(element) => {
                    tabRefs.current[index] = element;
                  }}
                  type="button"
                >
                  <span className="font-mono text-[0.625rem] tracking-[0.12em] text-[var(--colour-text-muted)]">
                    S/{String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "home-expertise-button-title max-w-[20ch] min-w-0 flex-1 text-lg leading-tight font-semibold tracking-[-0.035em] whitespace-normal",
                      !active &&
                        "xl:mt-auto xl:mb-10 xl:max-w-none xl:flex-none xl:rotate-180 xl:text-2xl xl:[writing-mode:vertical-rl]",
                    )}
                  >
                    {service.shortName}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid size-9 place-items-center rounded-full border border-[var(--colour-border-strong)] font-mono text-sm transition-colors",
                      active &&
                        "border-[var(--colour-action)] bg-[var(--colour-action)] text-[var(--colour-action-text)]",
                    )}
                  >
                    {active ? "−" : "+"}
                  </span>
                </button>

                <div
                  aria-hidden={!active}
                  aria-labelledby={tabId}
                  className={cn(
                    "home-expertise-content min-w-0 xl:flex-1",
                    !active &&
                      "pointer-events-none xl:absolute xl:inset-x-0 xl:top-20",
                  )}
                  id={panelId}
                  inert={!active}
                  role="region"
                  tabIndex={active ? 0 : -1}
                >
                  <div className="home-expertise-content__inner min-h-0 min-w-0 overflow-hidden">
                    <div className="flex min-h-full min-w-0 flex-col p-5 sm:p-7 xl:p-7 xl:pt-0">
                      <div className="home-expertise-content__meta flex items-center justify-between gap-4 border-b border-[var(--colour-border)] pb-4 font-mono text-[0.625rem] tracking-[0.12em] text-[var(--colour-text-muted)] uppercase">
                        <span>Service</span>
                        <span>({String(index + 1).padStart(2, "0")})</span>
                      </div>

                      <div className="mt-5 grid min-w-0 flex-1 gap-7 xl:grid-rows-[minmax(16rem,1fr)_auto]">
                        <div className="home-expertise-content__image relative min-h-56 overflow-hidden rounded-md bg-[var(--colour-surface-subtle)]">
                          <Image
                            alt=""
                            aria-hidden="true"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.015] motion-reduce:transition-none"
                            fill
                            sizes="(max-width: 1279px) 100vw, 720px"
                            src={service.image}
                          />
                          <div
                            aria-hidden="true"
                            className="hairline-grid absolute inset-0 opacity-15"
                          />
                        </div>

                        <div className="home-expertise-detail grid min-w-0 gap-6">
                          <div className="home-expertise-content__copy min-w-0">
                            <h3 className="max-w-[18ch] min-w-0 font-serif text-[clamp(2.25rem,4vw,4rem)] leading-[0.95] tracking-[-0.05em] text-pretty whitespace-normal">
                              {service.name}
                            </h3>
                            <p className="mt-4 max-w-[54ch] text-sm leading-6 text-[var(--colour-text-muted)] sm:text-base sm:leading-7">
                              {service.summary}
                            </p>
                            <TextLink
                              className="home-expertise-content__cta mt-6"
                              href={`/services/${service.slug}`}
                            >
                              Explore this service
                            </TextLink>
                          </div>
                          <div className="home-expertise-content__tags flex min-w-0 flex-wrap content-start gap-2">
                            {service.capabilities
                              .slice(0, 5)
                              .map((capability) => (
                                <CapabilityTag key={capability}>
                                  {capability}
                                </CapabilityTag>
                              ))}
                          </div>
                        </div>
                      </div>
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
