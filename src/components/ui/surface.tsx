import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type SurfaceProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  interactive?: boolean;
  tone?: "default" | "muted" | "dark";
};

const toneClasses = {
  default:
    "surface-texture bg-[var(--colour-surface)] text-[var(--colour-text)]",
  muted:
    "surface-texture bg-[var(--colour-surface-subtle)] text-[var(--colour-text)]",
  dark: "surface-texture-dark bg-[var(--colour-surface-inverse-raised)] text-[var(--colour-text-inverse)]",
};

export function Surface({
  children,
  className,
  interactive = false,
  tone = "default",
  ...props
}: SurfaceProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-[var(--colour-border)]",
        toneClasses[tone],
        interactive &&
          "group transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-[var(--colour-border-strong)] hover:shadow-soft",
        className,
      )}
      data-cursor-color={tone === "dark" ? "light" : "dark"}
      data-surface={tone === "dark" ? "dark" : undefined}
      {...props}
    >
      {children}
    </div>
  );
}
