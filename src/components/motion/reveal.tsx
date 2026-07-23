import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type MotionProps = {
  children: ReactNode;
  className?: string;
};

export function Reveal({ children, className }: MotionProps) {
  return (
    <div className={cn("view-reveal", className)} data-reveal="">
      {children}
    </div>
  );
}

export function Stagger({ children, className }: MotionProps) {
  return (
    <div className={cn("view-stagger", className)} data-stagger="">
      {children}
    </div>
  );
}

export function CardEntrance({ children, className }: MotionProps) {
  return (
    <div className={cn("view-card-entrance", className)} data-card-entrance="">
      {children}
    </div>
  );
}

export function ImageMaskReveal({ children, className }: MotionProps) {
  return (
    <div className={cn("overflow-hidden", className)}>
      <div className="view-image-reveal" data-image-reveal="">
        {children}
      </div>
    </div>
  );
}

export function AnimatedConnector({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative block h-px overflow-hidden bg-current/15",
        className,
      )}
    >
      <span className="view-connector absolute inset-y-0 left-0 w-full origin-left bg-orbit-400" />
    </span>
  );
}
