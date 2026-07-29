"use client";

import { useState } from "react";

import { heroAnswerModes } from "@/content/experience-content";
import { cn } from "@/lib/cn";

const desktopNodePositions = [
  "sm:top-[23%] sm:left-[7%]",
  "sm:top-[12%] sm:right-[7%]",
  "sm:right-[8%] sm:bottom-[28%]",
] as const;

const mobileNodePositions = [
  "order-1",
  "order-1",
  "order-3 col-span-2 justify-self-center",
] as const;

export function HeroAnswerField() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeMode = heroAnswerModes[activeIndex];

  return (
    <div
      className="surface-texture relative overflow-hidden rounded-xl border border-ink-950/18 bg-white/90 shadow-[0_1.75rem_6rem_rgb(9_11_16/0.12)] sm:min-h-[39rem]"
      data-testid="hero-answer-field"
    >
      <div
        aria-hidden="true"
        className="hairline-grid absolute inset-0 opacity-28"
      />

      <div className="relative p-4 sm:min-h-[27rem] sm:p-7">
        <div className="flex items-center justify-between gap-4 font-mono text-[0.625rem] tracking-[0.14em] text-ink-950/62 uppercase">
          <span>Answer field / live</span>
          <span className="inline-flex items-center gap-2">
            <span className="relative size-2 rounded-full bg-signal-500">
              <span className="hero-status-pulse absolute inset-0 rounded-full border border-signal-500" />
            </span>
            System connected
          </span>
        </div>

        <p
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-[52%] font-serif text-[clamp(10rem,24vw,18rem)] leading-none tracking-[-0.08em] text-ink-950/[0.035] sm:block"
        >
          42
        </p>

        <svg
          aria-hidden="true"
          className="absolute inset-x-[12%] top-[19%] hidden h-[48%] w-[76%] overflow-visible sm:block"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <path
            d="M11 20 L50 50 L88 14 M50 50 L89 80"
            fill="none"
            stroke="rgb(9 11 16 / 0.16)"
            strokeWidth="0.7"
            vectorEffect="non-scaling-stroke"
          />
          <path
            className="hero-connection-pulse"
            d="M11 20 L50 50 L88 14 M50 50 L89 80"
            fill="none"
            pathLength="1"
            stroke="var(--color-signal-500)"
            strokeDasharray="0.22 0.78"
            strokeLinecap="round"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div
          className="relative mt-5 grid grid-cols-2 gap-2 sm:absolute sm:inset-0 sm:mt-0 sm:block"
          data-testid="hero-answer-diagram"
        >
          <div
            aria-live="polite"
            className="z-10 order-2 col-span-2 flex min-h-24 w-full max-w-60 flex-col items-center justify-center justify-self-center rounded-lg border border-hubspot-coral/55 bg-ink-950 p-4 text-center text-paper-50 shadow-[0_1rem_3rem_rgb(9_11_16/0.2)] sm:absolute sm:top-[43%] sm:left-1/2 sm:min-h-0 sm:w-[min(15rem,48%)] sm:-translate-x-1/2 sm:-translate-y-1/2"
            data-testid="hero-answer-centre"
          >
            <span className="font-mono text-[0.625rem] tracking-[0.12em] text-hubspot-coral uppercase">
              HubSpot / {activeMode.number}
            </span>
            <strong className="mt-2 block text-xl tracking-[-0.035em] sm:text-2xl">
              {activeMode.title}
            </strong>
          </div>

          {activeMode.signals.map((signal, index) => (
            <div
              className={cn(
                "z-10 flex min-h-12 w-full max-w-36 items-center rounded-md border border-ink-950/14 bg-paper-50/95 px-3 py-2 font-mono text-[0.625rem] leading-4 tracking-[0.08em] text-ink-950/70 uppercase shadow-soft sm:absolute sm:min-h-0 sm:w-auto sm:max-w-[8rem]",
                mobileNodePositions[index],
                desktopNodePositions[index],
              )}
              data-testid="hero-answer-signal"
              key={`${index}-${signal}`}
            >
              <span className="mr-2 text-signal-900">0{index + 1}</span>
              {signal}
            </div>
          ))}
        </div>

        <div className="mt-5 flex min-h-[4.5rem] items-end justify-between gap-4 sm:absolute sm:right-7 sm:bottom-7 sm:left-7 sm:mt-0 sm:min-h-0">
          <p className="max-w-[36ch] text-sm leading-6 text-ink-950/68">
            {activeMode.body}
          </p>
          <span className="hidden font-mono text-[0.625rem] tracking-[0.1em] text-ink-950/52 uppercase sm:block">
            Question → working answer
          </span>
        </div>
      </div>

      <div
        aria-label="Explore the 42 delivery stages"
        className="relative grid grid-cols-2 border-t border-ink-950/14 sm:grid-cols-4"
      >
        {heroAnswerModes.map((mode, index) => {
          const active = index === activeIndex;

          return (
            <button
              aria-pressed={active}
              className={cn(
                "group relative min-h-20 overflow-hidden border-r border-b border-ink-950/12 px-4 py-4 text-left transition-[background-color,color] duration-150 even:border-r-0 nth-[n+3]:border-b-0 sm:min-h-28 sm:border-b-0 sm:last:border-r-0 sm:even:border-r",
                active
                  ? "bg-ink-950 text-paper-50"
                  : "bg-paper-100/72 text-ink-950 hover:bg-white",
              )}
              data-testid={`hero-mode-${mode.title.toLowerCase()}`}
              key={mode.number}
              onClick={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onMouseEnter={() => setActiveIndex(index)}
              type="button"
            >
              {active ? (
                <span className="absolute inset-x-0 top-0 h-0.5 bg-signal-400" />
              ) : null}
              <span className="relative flex items-center gap-3">
                <span
                  className={cn(
                    "font-mono text-[0.625rem]",
                    active ? "text-signal-400" : "text-ink-950/55",
                  )}
                >
                  {mode.number}
                </span>
                <strong className="text-sm tracking-[-0.02em] sm:text-base">
                  {mode.title}
                </strong>
              </span>
              <span
                className={cn(
                  "relative mt-3 hidden font-mono text-[0.625rem] tracking-[0.08em] uppercase sm:block",
                  active ? "text-white/65" : "text-ink-950/55",
                )}
              >
                {active ? "Answer in focus" : "Explore"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
