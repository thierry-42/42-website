"use client";

import { useState } from "react";

import { heroAnswerModes } from "@/content/experience-content";
import { cn } from "@/lib/cn";

const nodePositions = [
  "top-[23%] left-[7%]",
  "top-[12%] right-[7%]",
  "right-[8%] bottom-[28%]",
] as const;

export function HeroAnswerField() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeMode = heroAnswerModes[activeIndex];

  return (
    <div
      className="surface-texture relative min-h-[36rem] overflow-hidden rounded-xl border border-ink-950/18 bg-white/90 shadow-[0_1.75rem_6rem_rgb(9_11_16/0.12)] sm:min-h-[39rem]"
      data-testid="hero-answer-field"
    >
      <div
        aria-hidden="true"
        className="hairline-grid absolute inset-0 opacity-28"
      />

      <div className="relative min-h-[24rem] p-5 sm:min-h-[27rem] sm:p-7">
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
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[52%] font-serif text-[clamp(10rem,24vw,18rem)] leading-none tracking-[-0.08em] text-ink-950/[0.035]"
        >
          42
        </p>

        <svg
          aria-hidden="true"
          className="absolute inset-x-[12%] top-[19%] h-[48%] w-[76%] overflow-visible"
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
          aria-live="polite"
          className="absolute top-[43%] left-1/2 z-10 w-[min(15rem,48%)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-hubspot-coral/55 bg-ink-950 p-4 text-center text-paper-50 shadow-[0_1rem_3rem_rgb(9_11_16/0.2)]"
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
              "absolute z-10 max-w-[8rem] rounded-md border border-ink-950/14 bg-paper-50/95 px-3 py-2 font-mono text-[0.625rem] leading-4 tracking-[0.08em] text-ink-950/70 uppercase shadow-soft",
              nodePositions[index],
            )}
            key={`${index}-${signal}`}
          >
            <span className="mr-2 text-signal-900">0{index + 1}</span>
            {signal}
          </div>
        ))}

        <div className="absolute right-5 bottom-5 left-5 flex items-end justify-between gap-4 sm:right-7 sm:bottom-7 sm:left-7">
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
