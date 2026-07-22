"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { useReducedMotion } from "motion/react";

import { SystemIcon, type SystemIconName } from "@/components/ui/system-icons";
import { cn } from "@/lib/cn";

type SpotlightPrincipleCardProps = {
  icon: SystemIconName;
  index: number;
  principle: string;
};

export function SpotlightPrincipleCard({
  icon,
  index,
  principle,
}: SpotlightPrincipleCardProps) {
  const reduceMotion = useReducedMotion();

  function updateSpotlight(event: ReactPointerEvent<HTMLElement>) {
    if (reduceMotion) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--spot-x",
      `${event.clientX - bounds.left}px`,
    );
    event.currentTarget.style.setProperty(
      "--spot-y",
      `${event.clientY - bounds.top}px`,
    );
  }

  const number = `A/${String(index + 1).padStart(2, "0")}`;

  return (
    <article
      className="spotlight-card group relative min-h-44 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] text-ink-950 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.18)]"
      data-testid="principle-spotlight"
      onPointerEnter={updateSpotlight}
      onPointerMove={updateSpotlight}
    >
      <div className="surface-texture relative z-10 flex min-h-44 flex-col justify-between p-5">
        <div className="flex items-start justify-between gap-4">
          <span className="font-mono text-xs text-slate-500">{number}</span>
          <SystemIcon className="size-10" name={icon} />
        </div>
        <p className="mt-10 max-w-[20ch] text-lg font-semibold tracking-[-0.025em]">
          {principle}
        </p>
      </div>

      <div
        aria-hidden="true"
        className={cn(
          "spotlight-card__overlay surface-texture-dark pointer-events-none absolute inset-0 z-20 flex min-h-44 flex-col justify-between bg-ink-950 p-5 text-paper-50 opacity-0",
          reduceMotion && "hidden",
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <span className="font-mono text-xs text-signal-400">{number}</span>
          <SystemIcon className="size-10 text-signal-400" name={icon} />
        </div>
        <p className="mt-10 max-w-[20ch] text-lg font-semibold tracking-[-0.025em]">
          {principle}
        </p>
      </div>
    </article>
  );
}
