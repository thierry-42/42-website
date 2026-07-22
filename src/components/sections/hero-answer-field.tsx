"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { heroAnswerModes } from "@/content/experience-content";
import { cn } from "@/lib/cn";

const nodePositions = [
  "top-[23%] left-[7%]",
  "top-[12%] right-[7%]",
  "right-[8%] bottom-[28%]",
] as const;

export function HeroAnswerField() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const activeMode = heroAnswerModes[activeIndex];

  useEffect(() => {
    if (reduceMotion || isInteracting) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroAnswerModes.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [isInteracting, reduceMotion]);

  return (
    <div
      className="surface-texture-dark relative min-h-[36rem] overflow-hidden rounded-xl border border-white/14 bg-ink-900 shadow-[0_2rem_7rem_rgb(0_0_0/0.28)] sm:min-h-[39rem]"
      data-testid="hero-answer-field"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsInteracting(false);
        }
      }}
      onFocusCapture={() => setIsInteracting(true)}
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
    >
      <div
        aria-hidden="true"
        className="hairline-grid absolute inset-0 opacity-30"
      />

      <div className="relative min-h-[24rem] p-5 sm:min-h-[27rem] sm:p-7">
        <div className="flex items-center justify-between gap-4 font-mono text-[0.625rem] tracking-[0.14em] text-white/48 uppercase">
          <span>Answer field / live</span>
          <span className="inline-flex items-center gap-2">
            <span className="relative size-2 rounded-full bg-signal-400">
              {!reduceMotion ? (
                <motion.span
                  className="absolute inset-0 rounded-full border border-signal-400"
                  animate={{ opacity: [0.8, 0], scale: [1, 2.25] }}
                  transition={{
                    duration: 1.8,
                    ease: "easeOut",
                    repeat: Infinity,
                  }}
                />
              ) : null}
            </span>
            System connected
          </span>
        </div>

        <p
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[52%] font-serif text-[clamp(10rem,24vw,18rem)] leading-none tracking-[-0.08em] text-white/[0.055]"
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
            stroke="rgb(247 245 239 / 0.16)"
            strokeWidth="0.7"
            vectorEffect="non-scaling-stroke"
          />
          <motion.path
            key={activeMode.number}
            d="M11 20 L50 50 L88 14 M50 50 L89 80"
            fill="none"
            initial={reduceMotion ? false : { pathLength: 0, pathOffset: 0 }}
            animate={{ pathLength: 0.28, pathOffset: [0, 0.72] }}
            stroke="var(--color-signal-400)"
            strokeLinecap="round"
            strokeWidth="1.5"
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    duration: 2.6,
                    ease: "linear",
                    repeat: Infinity,
                  }
            }
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <AnimatePresence mode="wait">
          <motion.div
            className="absolute top-[43%] left-1/2 z-10 w-[min(15rem,48%)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-hubspot-coral/45 bg-ink-950/92 p-4 text-center shadow-lift backdrop-blur-sm"
            key={activeMode.number}
            initial={reduceMotion ? false : { scale: 0.94, y: 8 }}
            animate={{ scale: 1, y: 0 }}
            exit={reduceMotion ? undefined : { scale: 0.96, y: -6 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="font-mono text-[0.625rem] tracking-[0.12em] text-hubspot-coral uppercase">
              HubSpot / {activeMode.number}
            </span>
            <strong className="mt-2 block text-xl tracking-[-0.035em] sm:text-2xl">
              {activeMode.title}
            </strong>
          </motion.div>
        </AnimatePresence>

        {activeMode.signals.map((signal, index) => (
          <motion.div
            className={cn(
              "absolute z-10 max-w-[8rem] rounded-md border border-white/15 bg-ink-950/88 px-3 py-2 font-mono text-[0.625rem] leading-4 tracking-[0.08em] text-white/72 uppercase shadow-soft",
              nodePositions[index],
            )}
            key={`${activeMode.number}-${signal}`}
            initial={reduceMotion ? false : { scale: 0.88, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: index * 0.07, duration: 0.4 }}
          >
            <span className="mr-2 text-signal-400">0{index + 1}</span>
            {signal}
          </motion.div>
        ))}

        <div className="absolute right-5 bottom-5 left-5 flex items-end justify-between gap-4 sm:right-7 sm:bottom-7 sm:left-7">
          <AnimatePresence mode="wait">
            <motion.p
              className="max-w-[36ch] text-sm leading-6 text-white/58"
              key={activeMode.number}
              initial={reduceMotion ? false : { y: 8 }}
              animate={{ y: 0 }}
              exit={reduceMotion ? undefined : { y: -6 }}
            >
              {activeMode.body}
            </motion.p>
          </AnimatePresence>
          <span className="hidden font-mono text-[0.625rem] tracking-[0.1em] text-white/35 uppercase sm:block">
            Question → working answer
          </span>
        </div>
      </div>

      <div
        aria-label="Explore the 42 delivery stages"
        className="relative grid border-t border-white/14 sm:flex"
      >
        {heroAnswerModes.map((mode, index) => {
          const active = index === activeIndex;

          return (
            <motion.button
              aria-pressed={active}
              className={cn(
                "group relative min-h-20 overflow-hidden border-b border-white/12 px-4 py-4 text-left last:border-b-0 sm:min-h-28 sm:border-r sm:border-b-0 sm:last:border-r-0",
                active
                  ? "text-ink-950"
                  : "text-paper-50 hover:bg-white/[0.055]",
              )}
              data-testid={`hero-mode-${mode.title.toLowerCase()}`}
              key={mode.number}
              onClick={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onMouseEnter={() => setActiveIndex(index)}
              style={{ flexGrow: active ? 1.72 : 1 }}
              transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
              type="button"
            >
              {active ? (
                <motion.span
                  className="absolute inset-0 bg-signal-400"
                  layoutId="hero-active-mode"
                  transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
                />
              ) : null}
              <span className="relative flex items-center gap-3">
                <span
                  className={cn(
                    "font-mono text-[0.625rem]",
                    active ? "text-signal-900/65" : "text-white/38",
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
                  active ? "text-signal-900/60" : "text-white/32",
                )}
              >
                {active ? "Answer in focus" : "Explore"}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
