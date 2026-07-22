"use client";

import {
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

const revealTransition: Transition = {
  duration: 0.68,
  ease: [0.22, 1, 0.36, 1],
};

const revealVariants: Variants = {
  hidden: { scale: 0.992, y: 26 },
  visible: { scale: 1, transition: revealTransition, y: 0 },
};

type MotionProps = {
  children: ReactNode;
  className?: string;
};

export function Reveal({ children, className }: MotionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : "hidden"}
      variants={revealVariants}
      viewport={{ amount: 0.16, once: true }}
      whileInView="visible"
    >
      {children}
    </motion.div>
  );
}

const staggerVariants: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.05, staggerChildren: 0.1 } },
};

export function Stagger({ children, className }: MotionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : "hidden"}
      variants={reduceMotion ? undefined : staggerVariants}
      viewport={{ amount: 0.1, once: true }}
      whileInView="visible"
    >
      {children}
    </motion.div>
  );
}

export function CardEntrance({ children, className }: MotionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={reduceMotion ? undefined : revealVariants}
    >
      {children}
    </motion.div>
  );
}

export function ImageMaskReveal({ children, className }: MotionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        initial={reduceMotion ? false : { scale: 1.035, y: 20 }}
        transition={revealTransition}
        viewport={{ amount: 0.12, once: true }}
        whileInView={reduceMotion ? undefined : { scale: 1, y: 0 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function AnimatedConnector({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative block h-px overflow-hidden bg-current/15",
        className,
      )}
    >
      <motion.span
        className="absolute inset-y-0 left-0 w-full origin-left bg-orbit-400"
        initial={reduceMotion ? false : { scaleX: 0 }}
        transition={{ delay: 0.15, duration: 0.65, ease: "easeOut" }}
        viewport={{ once: true }}
        whileInView={{ scaleX: 1 }}
      />
    </span>
  );
}
