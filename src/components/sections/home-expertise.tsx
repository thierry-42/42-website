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
          className="mt-12 flex flex-col overflow-hidden border border-[var(--colour-border)] xl:min-h-[43rem] xl:flex-row"
          data-testid="home-expertise"
          role="group"
        >
          {services.map((service, index) => {
            const active = index === activeIndex;
            const panelId = `${tabsId}-panel-${index}`;
            const tabId = `${tabsId}-tab-${index}`;

            return (
              <article
                className={cn(
                  "group relative min-w-0 border-b border-[var(--colour-border)] bg-[var(--colour-surface)] transition-[flex-grow,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] last:border-b-0 motion-reduce:transition-none xl:border-r xl:border-b-0 xl:last:border-r-0",
                  active
                    ? "bg-[var(--colour-surface)] xl:flex xl:flex-[7] xl:flex-col"
                    : "bg-[var(--colour-surface-subtle)] xl:flex-[1]",
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
                      "max-w-[20ch] flex-1 text-lg leading-tight font-semibold tracking-[-0.035em]",
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
                  aria-labelledby={tabId}
                  className="p-5 sm:p-7 xl:flex xl:min-w-[39rem] xl:flex-1 xl:flex-col xl:p-7 xl:pt-0"
                  hidden={!active}
                  id={panelId}
                  role="region"
                  tabIndex={0}
                >
                  {active ? (
                    <>
                      <div className="flex items-center justify-between gap-4 border-b border-[var(--colour-border)] pb-4 font-mono text-[0.625rem] tracking-[0.12em] text-[var(--colour-text-muted)] uppercase">
                        <span>Service</span>
                        <span>({String(index + 1).padStart(2, "0")})</span>
                      </div>

                      <div className="mt-5 grid flex-1 gap-7 xl:grid-rows-[minmax(16rem,1fr)_auto]">
                        <div className="relative min-h-56 overflow-hidden rounded-md bg-[var(--colour-surface-subtle)]">
                          <Image
                            alt=""
                            aria-hidden="true"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.015] motion-reduce:transition-none"
                            fill
                            sizes="(max-width: 1279px) 100vw, 620px"
                            src={service.image}
                          />
                          <div
                            aria-hidden="true"
                            className="hairline-grid absolute inset-0 opacity-15"
                          />
                        </div>

                        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(15rem,0.75fr)]">
                          <div>
                            <h3 className="max-w-[18ch] font-serif text-[clamp(2.25rem,4vw,4rem)] leading-[0.95] tracking-[-0.05em] text-pretty">
                              {service.name}
                            </h3>
                            <p className="mt-4 max-w-[54ch] text-sm leading-6 text-[var(--colour-text-muted)] sm:text-base sm:leading-7">
                              {service.summary}
                            </p>
                            <TextLink
                              className="mt-6"
                              href={`/services/${service.slug}`}
                            >
                              Explore this service
                            </TextLink>
                          </div>
                          <div className="flex flex-wrap content-start gap-2 lg:border-l lg:border-[var(--colour-border)] lg:pl-6">
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
                    </>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
