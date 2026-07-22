import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type SurfaceProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  interactive?: boolean;
  tone?: "default" | "muted" | "dark";
};

const toneClasses = {
  default: "surface-texture bg-[var(--surface)] text-[var(--foreground)]",
  muted: "surface-texture bg-[var(--surface-muted)] text-[var(--foreground)]",
  dark: "surface-texture-dark bg-ink-900 text-paper-50",
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
        "rounded-lg border border-[var(--border)]",
        toneClasses[tone],
        interactive &&
          "group transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-soft",
        className,
      )}
      data-surface={tone === "dark" ? "dark" : undefined}
      {...props}
    >
      {children}
    </div>
  );
}
