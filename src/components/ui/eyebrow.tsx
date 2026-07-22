import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type EyebrowProps = HTMLAttributes<HTMLParagraphElement> & {
  children: ReactNode;
  index?: string;
};

export function Eyebrow({
  children,
  className,
  index = "42",
  ...props
}: EyebrowProps) {
  return (
    <p
      className={cn(
        "mb-5 inline-flex items-center gap-3 font-mono text-[0.6875rem] leading-none font-semibold tracking-[0.16em] text-current uppercase",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="inline-grid h-6 min-w-6 place-items-center rounded-xs bg-signal-400 px-1.5 tracking-[-0.04em] text-signal-900"
      >
        {index}
      </span>
      {children}
    </p>
  );
}
