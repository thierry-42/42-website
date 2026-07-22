"use client";

import { motion, useReducedMotion } from "motion/react";
import type { PointerEvent as ReactPointerEvent } from "react";

import { CapabilityTag } from "@/components/ui/capability-tag";
import { SystemIcon, type SystemIconName } from "@/components/ui/system-icons";
import { cn } from "@/lib/cn";

type Engagement = {
  description: string;
  items: string[];
  name: string;
};

const engagementIcons: SystemIconName[] = [
  "engagement-review",
  "engagement-build",
  "engagement-connect",
  "engagement-improve",
];

const engagementTones = [
  "border-ink-950/16 bg-white text-ink-950",
  "surface-texture-dark border-white/15 bg-ink-950 text-paper-50",
  "border-orbit-600/24 bg-[#dfe5ff] text-ink-950",
  "border-ink-950/16 bg-paper-100 text-ink-950",
] as const;

const stackTopClasses = [
  "lg:top-[calc(var(--header-height)+1.25rem)]",
  "lg:top-[calc(var(--header-height)+2.5rem)]",
  "lg:top-[calc(var(--header-height)+3.75rem)]",
  "lg:top-[calc(var(--header-height)+5rem)]",
] as const;

export function EngagementStack({
  engagements,
}: {
  engagements: Engagement[];
}) {
  return (
    <div className="mt-14 lg:pb-[8vh]" data-testid="engagement-stack">
      {engagements.map((engagement, index) => (
        <EngagementStackCard
          engagement={engagement}
          index={index}
          key={engagement.name}
        />
      ))}
    </div>
  );
}

function EngagementStackCard({
  engagement,
  index,
}: {
  engagement: Engagement;
  index: number;
}) {
  const reduceMotion = useReducedMotion();
  const dark = index === 1;

  function updateGlow(event: ReactPointerEvent<HTMLElement>) {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--engagement-x",
      `${event.clientX - bounds.left}px`,
    );
    event.currentTarget.style.setProperty(
      "--engagement-y",
      `${event.clientY - bounds.top}px`,
    );
  }

  return (
    <motion.article
      className={cn(
        "group surface-texture relative mb-5 min-h-[32rem] overflow-hidden rounded-xl border p-6 shadow-[0_1.5rem_5rem_rgb(9_11_16/0.13)] md:p-10 lg:sticky lg:mb-[18vh] lg:min-h-[34rem] lg:last:mb-0",
        engagementTones[index],
        stackTopClasses[index],
      )}
      data-surface={dark ? "dark" : "light"}
      data-testid={`engagement-stack-card-${index + 1}`}
      onPointerEnter={updateGlow}
      onPointerMove={updateGlow}
      initial={reduceMotion ? false : { scale: 0.985, y: 32 }}
      style={{ zIndex: index + 1 }}
      transition={{ damping: 30, stiffness: 240, type: "spring" }}
      viewport={{ amount: 0.12, once: true }}
      whileInView={{ scale: 1, y: 0 }}
    >
      <div
        aria-hidden="true"
        className="engagement-stack__glow absolute inset-0"
      />
      <div
        aria-hidden="true"
        className="absolute -right-4 -bottom-14 font-serif text-[clamp(11rem,25vw,24rem)] leading-none tracking-[-0.09em] opacity-[0.045] transition-transform duration-700 ease-out group-hover:-translate-y-3 group-hover:-rotate-2"
      >
        {index + 1}
      </div>

      <div className="relative z-10 flex min-h-[26rem] flex-col">
        <div className="flex items-start justify-between gap-8 border-b border-current/15 pb-6">
          <p
            className={cn(
              "font-mono text-xs",
              dark ? "text-white/48" : "text-slate-500",
            )}
          >
            Engagement / {String(index + 1).padStart(2, "0")}
          </p>
          <SystemIcon
            className={cn(
              "size-16 transition-[transform,color] duration-500 ease-out group-hover:scale-110 group-hover:rotate-6",
              dark
                ? "text-signal-400"
                : "text-ink-950 group-hover:text-orbit-600",
            )}
            name={engagementIcons[index]}
          />
        </div>

        <div className="grid flex-1 gap-10 pt-9 md:grid-cols-12 md:items-end">
          <div className="md:col-span-6">
            <h3 className="font-serif text-[clamp(3.75rem,8vw,7.75rem)] leading-[0.85] tracking-[-0.06em]">
              {engagement.name}
            </h3>
            <p
              className={cn(
                "mt-6 max-w-[34ch] text-lg leading-8",
                dark ? "text-white/62" : "text-slate-500",
              )}
            >
              {engagement.description}
            </p>
          </div>

          <div className="md:col-span-5 md:col-start-8">
            <p
              className={cn(
                "font-mono text-[0.625rem] tracking-[0.12em] uppercase",
                dark ? "text-white/42" : "text-slate-500",
              )}
            >
              Typical scope
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {engagement.items.map((item) => (
                <CapabilityTag key={item}>{item}</CapabilityTag>
              ))}
            </div>
            <div className="mt-8 h-1 overflow-hidden rounded-full bg-current/10">
              <span
                className="block h-full origin-left scale-x-[0.18] bg-signal-400 transition-transform duration-700 ease-out group-hover:scale-x-100"
                style={{ width: `${25 * (index + 1)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
