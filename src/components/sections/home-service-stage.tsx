"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";

import type { Service } from "@/content/site-content";
import { cn } from "@/lib/cn";

type HomeServiceStageProps = {
  services: readonly Service[];
};

export function HomeServiceStage({ services }: HomeServiceStageProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabListId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeService = services[activeIndex];

  function selectAndFocus(index: number) {
    const nextIndex = (index + services.length) % services.length;
    setActiveIndex(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <div
      className="home-service-stage surface-texture-dark relative mt-10 overflow-hidden rounded-xl border border-[var(--colour-border-inverse)] bg-[var(--colour-surface-inverse)] text-[var(--colour-text-inverse)] shadow-[0_2rem_7rem_rgb(9_11_16/0.16)] sm:mt-14"
      data-cursor-color="light"
      data-testid="home-service-stage"
      data-surface="dark"
    >
      <div className="relative min-h-[29rem] sm:min-h-[36rem] lg:min-h-[42rem]">
        <Image
          alt=""
          aria-hidden="true"
          className="home-service-stage-image object-cover object-center opacity-65"
          fill
          key={activeService.slug}
          priority={activeIndex === 0}
          sizes="(max-width: 768px) 100vw, 1320px"
          src={activeService.image}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgb(9_11_16/0.96)_0%,rgb(9_11_16/0.78)_43%,rgb(9_11_16/0.18)_100%)] sm:bg-[linear-gradient(90deg,rgb(9_11_16/0.96)_0%,rgb(9_11_16/0.72)_46%,rgb(9_11_16/0.08)_100%)]"
        />
        <div
          aria-hidden="true"
          className="hairline-grid absolute inset-0 opacity-15"
        />

        <div className="relative z-10 flex min-h-[29rem] flex-col justify-between p-5 pb-32 sm:min-h-[36rem] sm:p-8 sm:pb-36 lg:min-h-[42rem] lg:p-12 lg:pb-40">
          <div className="flex items-center justify-between gap-4 border-b border-[var(--colour-border-inverse)] pb-4 font-mono text-[0.625rem] tracking-[0.13em] text-[var(--colour-text-inverse-muted)] uppercase">
            <span>Answer system / service architecture</span>
            <span>
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(services.length).padStart(2, "0")}
            </span>
          </div>

          <div
            aria-live="polite"
            aria-labelledby={`${tabListId}-tab-${activeIndex}`}
            className="max-w-[41rem]"
            id={`${tabListId}-panel`}
            role="tabpanel"
          >
            <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-[var(--colour-action)] uppercase">
              Active service
            </p>
            <h2 className="mt-4 max-w-[14ch] font-serif text-[clamp(2.65rem,6vw,5.75rem)] leading-[0.92] tracking-[-0.055em] text-pretty text-[var(--colour-text-inverse)]">
              {activeService.shortName}
            </h2>
            <p className="mt-5 max-w-[46ch] text-base leading-7 text-[var(--colour-text-inverse-muted)] sm:text-lg">
              {activeService.headline}
            </p>
          </div>
        </div>
      </div>

      <div
        aria-label="Choose a HubSpot service"
        className="home-service-tabs hide-scrollbar absolute inset-x-0 bottom-0 z-20 flex snap-x snap-mandatory gap-px overflow-x-auto border-t border-[var(--colour-border-inverse)] bg-[color-mix(in_srgb,var(--colour-surface-inverse)_76%,transparent)] p-2 backdrop-blur-sm sm:p-3"
        role="tablist"
      >
        {services.map((service, index) => {
          const active = index === activeIndex;
          return (
            <button
              aria-controls={`${tabListId}-panel`}
              aria-selected={active}
              className={cn(
                "group grid min-h-20 min-w-[13.5rem] snap-start grid-cols-[3.5rem_1fr] items-center gap-3 border px-3 py-2 text-left transition-[background-color,border-color,color] duration-200 motion-reduce:transition-none sm:min-w-[15rem]",
                active
                  ? "border-[var(--colour-action)] bg-[var(--colour-action)] text-[var(--colour-action-text)]"
                  : "border-[var(--colour-border-inverse)] bg-[var(--colour-surface-inverse-raised)]/88 text-[var(--colour-text-inverse)] hover:border-[var(--colour-border-inverse-strong)] hover:bg-[var(--colour-surface-inverse-subtle)]",
              )}
              id={`${tabListId}-tab-${index}`}
              key={service.slug}
              onClick={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowDown") {
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
              role="tab"
              tabIndex={active ? 0 : -1}
              type="button"
            >
              <span className="relative aspect-square overflow-hidden rounded-sm border border-current/20">
                <Image
                  alt=""
                  aria-hidden="true"
                  className="object-cover"
                  fill
                  sizes="56px"
                  src={service.image}
                />
              </span>
              <span>
                <span className="block font-mono text-[0.625rem] tracking-[0.1em] opacity-70">
                  ({String(index + 1).padStart(2, "0")})
                </span>
                <span className="mt-1 block text-sm leading-5 font-semibold tracking-[-0.02em]">
                  {service.shortName}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
