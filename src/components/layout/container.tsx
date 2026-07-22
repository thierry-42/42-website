import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type ContainerWidth = "wide" | "content" | "reading";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  width?: ContainerWidth;
};

const widthClasses: Record<ContainerWidth, string> = {
  wide: "max-w-[var(--container-wide)]",
  content: "max-w-[var(--container-content)]",
  reading: "max-w-[var(--container-reading)]",
};

export function Container({
  children,
  className,
  width = "wide",
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-[var(--gutter)]",
        widthClasses[width],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
