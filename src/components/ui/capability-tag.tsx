import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type CapabilityTagProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  context?: "default" | "hubspot";
};

export function CapabilityTag({
  children,
  className,
  context = "default",
  ...props
}: CapabilityTagProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 max-w-full items-center justify-center rounded-full border px-3 py-1 text-center font-mono text-[0.6875rem] leading-5 tracking-[0.06em] [overflow-wrap:anywhere]",
        context === "hubspot"
          ? "border-hubspot-coral/45 bg-hubspot-coral/10 text-current"
          : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)]",
        className,
      )}
      {...props}
    >
      <span className="min-w-0 text-balance">{children}</span>
    </span>
  );
}
