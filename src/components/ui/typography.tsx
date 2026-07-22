import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type HeadingLevel = "h1" | "h2" | "h3" | "h4";
type HeadingSize = "display" | "h1" | "h2" | "h3";

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  as?: HeadingLevel;
  children: ReactNode;
  size?: HeadingSize;
};

const headingSizes: Record<HeadingSize, string> = {
  display:
    "text-[clamp(3.75rem,7.5vw,7rem)] leading-[0.92] tracking-[-0.045em]",
  h1: "text-[clamp(3.25rem,5.2vw,5.25rem)] leading-[0.94] tracking-[-0.04em]",
  h2: "text-[clamp(2.5rem,4vw,4rem)] leading-[0.98] tracking-[-0.035em]",
  h3: "text-[clamp(1.75rem,2.5vw,2.5rem)] leading-[1.04] tracking-[-0.025em]",
};

export function Heading({
  as: Component = "h2",
  children,
  className,
  size = "h2",
  ...props
}: HeadingProps) {
  return (
    <Component
      className={cn(
        "font-serif font-normal text-balance",
        headingSizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

type EditorialProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
};

export function Editorial({ children, className, ...props }: EditorialProps) {
  return (
    <span
      className={cn(
        "font-serif font-normal tracking-[-0.025em] italic",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

type BodyProps = HTMLAttributes<HTMLParagraphElement> & {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
};

const bodySizes = {
  sm: "text-sm leading-6",
  md: "text-base leading-7 md:text-lg md:leading-8",
  lg: "text-lg leading-8 md:text-xl md:leading-9",
};

export function Body({
  children,
  className,
  size = "md",
  ...props
}: BodyProps) {
  return (
    <p
      className={cn(
        "max-w-[68ch] text-pretty text-[var(--text-muted)]",
        bodySizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}
