import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type SystemNodeProps = {
  children?: ReactNode;
  className?: string;
  context?: "default" | "hubspot" | "signal";
  label: string;
  meta?: string;
};

const contextClasses = {
  default: "border-[var(--border)] bg-[var(--surface)]",
  hubspot: "border-hubspot-coral/55 bg-hubspot-coral/10",
  signal: "border-signal-400/60 bg-signal-400/10",
};

export function SystemNode({
  children,
  className,
  context = "default",
  label,
  meta,
}: SystemNodeProps) {
  return (
    <div
      className={cn(
        "relative min-w-40 rounded-md border p-4 shadow-soft",
        contextClasses[context],
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-2" aria-hidden="true">
        <span className="size-1.5 rounded-full bg-current opacity-70" />
        <span className="h-px flex-1 bg-current opacity-15" />
      </div>
      <p className="text-sm font-semibold">{label}</p>
      {meta ? (
        <p className="mt-1 font-mono text-[0.625rem] tracking-[0.08em] text-[var(--text-muted)] uppercase">
          {meta}
        </p>
      ) : null}
      {children}
    </div>
  );
}
