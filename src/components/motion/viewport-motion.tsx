"use client";

import { useRef, type ReactNode } from "react";

import { useViewportMotion } from "@/components/motion/use-viewport-motion";

export function ViewportMotion({
  children,
  className,
  rootMargin,
  testId,
  threshold,
}: {
  children: ReactNode;
  className: string;
  rootMargin?: string;
  testId: string;
  threshold?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { canAnimate, isInViewport } = useViewportMotion(containerRef, {
    rootMargin,
    threshold,
  });
  const motionState = !canAnimate
    ? "static"
    : isInViewport
      ? "playing"
      : "paused";

  return (
    <div
      aria-hidden="true"
      className={className}
      data-motion-renderer="svg-css"
      data-motion-state={motionState}
      data-testid={testId}
      ref={containerRef}
    >
      {children}
    </div>
  );
}
