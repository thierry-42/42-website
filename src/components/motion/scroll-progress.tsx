"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

export function ScrollProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    damping: 28,
    mass: 0.18,
    stiffness: 180,
  });

  if (reduceMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-[calc(var(--header-height)-2px)] z-[60] h-0.5 origin-left bg-signal-400"
      style={{ scaleX }}
    />
  );
}
