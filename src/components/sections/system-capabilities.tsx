"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/sections/section-heading";
import { CapabilityTag } from "@/components/ui/capability-tag";
import { connectedCapabilityGroups } from "@/content/experience-content";
import { siteContent } from "@/content/site-content";
import { cn } from "@/lib/cn";

type CapabilityGroup = (typeof connectedCapabilityGroups)[number];

const springTransition = {
  damping: 32,
  stiffness: 320,
  type: "spring" as const,
};

export function SystemCapabilities() {
  const content = siteContent.home.integration;
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<CapabilityGroup["id"]>(
    connectedCapabilityGroups[0].id,
  );
  const activeIndex = connectedCapabilityGroups.findIndex(
    (group) => group.id === activeId,
  );
  const activeGroup = connectedCapabilityGroups[activeIndex];

  return (
    <Section surface="paper">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            body={content.body}
            className="lg:col-span-7"
            eyebrow="Connected capability"
            index="05"
            title={content.headline}
          />
          <p className="max-w-[34ch] border-l border-[var(--border-strong)] pl-5 font-mono text-[0.6875rem] leading-5 tracking-[0.1em] text-ink-950/70 uppercase lg:col-span-3 lg:col-start-10">
            Hover, focus, or select a capability to reconfigure the system.
          </p>
        </div>

        <div
          className="mt-14 overflow-hidden rounded-xl border border-[var(--border-strong)] bg-white shadow-[0_2rem_6rem_rgb(9_11_16/0.12)] lg:grid lg:grid-cols-[17rem_1fr]"
          data-testid="capability-explorer"
        >
          <div
            aria-label="Connected capability groups"
            className="hide-scrollbar flex overflow-x-auto border-b border-[var(--border)] bg-paper-100 p-2 lg:block lg:overflow-visible lg:border-r lg:border-b-0 lg:p-3"
          >
            {connectedCapabilityGroups.map((group, index) => {
              const active = group.id === activeId;

              return (
                <button
                  aria-pressed={active}
                  className={cn(
                    "group relative min-w-[11rem] overflow-hidden rounded-md px-4 py-4 text-left transition-colors duration-300 lg:w-full lg:min-w-0 lg:py-5",
                    active
                      ? "text-ink-950"
                      : "text-ink-950/72 hover:bg-white hover:text-ink-950",
                  )}
                  key={group.id}
                  onClick={() => setActiveId(group.id)}
                  onFocus={() => setActiveId(group.id)}
                  onMouseEnter={() => setActiveId(group.id)}
                  type="button"
                >
                  {active ? (
                    <motion.span
                      className="absolute inset-0 bg-signal-400"
                      layoutId="capability-active-group"
                      transition={springTransition}
                    />
                  ) : null}
                  <span className="relative flex items-center justify-between gap-3">
                    <span>
                      <span
                        className={cn(
                          "block font-mono text-[0.625rem] tracking-[0.12em]",
                          active ? "text-signal-900/70" : "text-ink-950/65",
                        )}
                      >
                        C/{String(index + 1).padStart(2, "0")}
                      </span>
                      <strong className="mt-2 block text-sm tracking-[-0.02em]">
                        {group.label}
                      </strong>
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "text-lg transition-transform duration-300",
                        active
                          ? "translate-x-0"
                          : "-translate-x-1 opacity-35 group-hover:translate-x-0",
                      )}
                    >
                      →
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <CapabilitySystemBoard
            activeGroup={activeGroup}
            activeIndex={activeIndex}
            reduceMotion={Boolean(reduceMotion)}
          />
        </div>
      </Container>
    </Section>
  );
}

function CapabilitySystemBoard({
  activeGroup,
  activeIndex,
  reduceMotion,
}: {
  activeGroup: CapabilityGroup;
  activeIndex: number;
  reduceMotion: boolean;
}) {
  return (
    <div
      className="surface-texture-dark relative min-h-[42rem] overflow-hidden bg-ink-950 p-5 text-paper-50 sm:p-8 lg:p-10"
      data-surface="dark"
    >
      <div
        aria-hidden="true"
        className="hairline-grid absolute inset-0 opacity-24"
      />
      <div className="relative z-10 flex min-h-[36rem] flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-white/12 pb-5 font-mono text-[0.625rem] tracking-[0.13em] text-white/48 uppercase">
          <span>System board / {String(activeIndex + 1).padStart(2, "0")}</span>
          <span className="inline-flex items-center gap-2 text-signal-400">
            <span className="relative size-2 rounded-full bg-signal-400">
              {!reduceMotion ? (
                <motion.span
                  className="absolute inset-0 rounded-full border border-signal-400"
                  animate={{ opacity: [0.75, 0], scale: [1, 2.2] }}
                  transition={{
                    duration: 1.8,
                    ease: "easeOut",
                    repeat: Infinity,
                  }}
                />
              ) : null}
            </span>
            Connected
          </span>
        </div>

        <div className="relative min-h-[11.5rem] overflow-hidden border-b border-white/12 py-6 sm:min-h-[10.5rem]">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={activeGroup.id}
              initial={reduceMotion ? false : { y: 24 }}
              animate={{ y: 0 }}
              exit={reduceMotion ? undefined : { y: -24 }}
              transition={springTransition}
            >
              <p className="font-mono text-[0.625rem] tracking-[0.12em] text-orbit-400 uppercase">
                Active layer / {activeGroup.label}
              </p>
              <h3 className="mt-3 max-w-[19ch] font-serif text-[clamp(2.25rem,4vw,4rem)] leading-[0.96] tracking-[-0.045em]">
                {activeGroup.description}
              </h3>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative my-6 min-h-[20rem] flex-1 overflow-hidden rounded-lg border border-white/12 bg-white/[0.025] px-3 py-5 sm:px-5">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-1/2 h-px bg-white/8"
          />
          <svg
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <path
              d="M18 20 L50 50 M18 80 L50 50 M50 50 L82 80"
              fill="none"
              stroke="rgb(247 245 239 / 0.18)"
              strokeWidth="0.65"
              vectorEffect="non-scaling-stroke"
            />
            {!reduceMotion ? (
              <>
                <SignalDot delay={0} from={[18, 20]} to={[50, 50]} />
                <SignalDot delay={0.72} from={[18, 80]} to={[50, 50]} />
                <SignalDot
                  color="var(--color-orbit-400)"
                  delay={1.38}
                  from={[50, 50]}
                  to={[82, 80]}
                />
              </>
            ) : (
              <circle cx="50" cy="50" fill="var(--color-signal-400)" r="1" />
            )}
          </svg>

          <AnimatedSystemNode
            className="top-[6%] left-[3%]"
            index="01"
            label={activeGroup.nodes[0]}
            reduceMotion={reduceMotion}
          />
          <AnimatedSystemNode
            className="bottom-[6%] left-[3%]"
            index="02"
            label={activeGroup.nodes[1]}
            reduceMotion={reduceMotion}
          />

          <motion.div
            className="absolute top-1/2 left-1/2 z-10 w-[7.5rem] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-hubspot-coral/55 bg-ink-900 p-3 shadow-[0_1rem_4rem_rgb(0_0_0/0.38)] sm:w-[10rem] sm:p-4"
            animate={reduceMotion ? undefined : { scale: [1, 1.025, 1] }}
            transition={{ duration: 2.8, ease: "easeInOut", repeat: Infinity }}
          >
            <div className="mb-5 flex items-center gap-2" aria-hidden="true">
              <span className="size-1.5 rounded-full bg-hubspot-coral" />
              <span className="h-px flex-1 bg-hubspot-coral/25" />
            </div>
            <p className="font-semibold">HubSpot</p>
            <p className="mt-1 font-mono text-[0.5625rem] tracking-[0.08em] text-white/48 uppercase">
              Customer platform
            </p>
          </motion.div>

          <AnimatedSystemNode
            className="right-[3%] bottom-[6%] border-signal-400/45"
            index="03"
            label={activeGroup.nodes[2]}
            reduceMotion={reduceMotion}
          />
        </div>

        <div className="min-h-[5.5rem] border-t border-white/12 pt-5">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              className="flex flex-wrap gap-2"
              key={activeGroup.id}
              initial={reduceMotion ? false : { y: 12 }}
              animate={{ y: 0 }}
              exit={reduceMotion ? undefined : { y: -8 }}
              transition={springTransition}
            >
              {activeGroup.capabilities.map((capability) => (
                <CapabilityTag
                  context={
                    capability === "Custom-coded workflows"
                      ? "hubspot"
                      : "default"
                  }
                  key={capability}
                >
                  {capability}
                </CapabilityTag>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function AnimatedSystemNode({
  className,
  index,
  label,
  reduceMotion,
}: {
  className?: string;
  index: string;
  label: string;
  reduceMotion: boolean;
}) {
  return (
    <div
      className={cn(
        "absolute z-10 w-[6.75rem] overflow-hidden rounded-md border border-white/16 bg-ink-900/96 p-3 shadow-soft sm:w-[9rem] sm:p-4",
        className,
      )}
    >
      <div className="mb-3 flex items-center gap-2" aria-hidden="true">
        <span className="size-1 rounded-full bg-signal-400" />
        <span className="h-px flex-1 bg-white/15" />
      </div>
      <div className="min-h-10 overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.p
            className="text-xs leading-5 font-semibold sm:text-sm"
            key={label}
            initial={reduceMotion ? false : { y: 14 }}
            animate={{ y: 0 }}
            exit={reduceMotion ? undefined : { y: -14 }}
            transition={springTransition}
          >
            {label}
          </motion.p>
        </AnimatePresence>
      </div>
      <p className="mt-2 font-mono text-[0.5625rem] tracking-[0.08em] text-white/42 uppercase">
        Node {index}
      </p>
    </div>
  );
}

function SignalDot({
  color = "var(--color-signal-400)",
  delay,
  from,
  to,
}: {
  color?: string;
  delay: number;
  from: [number, number];
  to: [number, number];
}) {
  return (
    <motion.circle
      animate={{
        cx: [from[0], to[0]],
        cy: [from[1], to[1]],
        opacity: [0, 1, 0],
      }}
      cx={from[0]}
      cy={from[1]}
      fill={color}
      r="1.15"
      transition={{
        delay,
        duration: 1.55,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 0.65,
      }}
    />
  );
}
