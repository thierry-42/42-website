import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";
import type { SurfaceTone } from "@/types/common";

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  overflow?: "hidden" | "visible";
  surface?: SurfaceTone;
  spacing?: "none" | "compact" | "default";
};

const surfaceClasses: Record<SurfaceTone, string> = {
  paper: "bg-[var(--colour-canvas)] text-[var(--colour-text)]",
  white: "bg-[var(--colour-surface)] text-[var(--colour-text)]",
  muted: "bg-[var(--colour-surface-subtle)] text-[var(--colour-text)]",
  dark: "bg-[var(--colour-surface-inverse)] text-[var(--colour-text-inverse)]",
};

const spacingClasses = {
  none: "",
  compact: "py-16 md:py-22",
  default: "py-[var(--section-space)]",
};

const overflowClasses = {
  hidden: "overflow-hidden",
  visible: "overflow-visible",
};

export function Section({
  children,
  className,
  overflow = "hidden",
  surface = "paper",
  spacing = "default",
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        "relative isolate",
        overflowClasses[overflow],
        surfaceClasses[surface],
        spacingClasses[spacing],
        className,
      )}
      data-cursor-color={surface === "dark" ? "light" : "dark"}
      data-surface={surface === "dark" ? "dark" : "light"}
      {...props}
    >
      {children}
    </section>
  );
}
