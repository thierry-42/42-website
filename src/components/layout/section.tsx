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
  paper: "bg-paper-50 text-ink-950",
  white: "bg-white text-ink-950",
  muted: "bg-paper-100 text-ink-950",
  dark: "bg-ink-950 text-paper-50",
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
